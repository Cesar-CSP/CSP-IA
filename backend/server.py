from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import hmac
import ipaddress
import logging
import os
import re
import uuid
from datetime import datetime, timezone, timedelta
from html import escape
from html.parser import HTMLParser
from typing import List
from urllib.parse import urlparse

import httpx
import jwt
from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict
from starlette.middleware.cors import CORSMiddleware

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="CSP IA API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ---------- Email (Emergent managed Resend) ----------
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY")
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
ADMIN_NOTIFY_EMAIL = os.environ.get("ADMIN_NOTIFY_EMAIL")

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: str | None = None) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    try:
        async with httpx.AsyncClient(timeout=30) as http_client:
            resp = await http_client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except httpx.HTTPStatusError as e:
        logger.error(f"Email send failed: {e.response.status_code} {e.response.text}")
        raise HTTPException(status_code=502, detail="Failed to send email")
    except Exception as e:
        logger.error(f"Email send error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send email")


def _lead_row(label: str, value: str) -> str:
    return (f'<tr><td style="padding:8px 16px 8px 0;color:#64748b;font-size:13px;vertical-align:top;'
            f'white-space:nowrap">{escape(label)}</td>'
            f'<td style="padding:8px 0;color:#0f172a;font-size:14px">{escape(value or "—")}</td></tr>')


async def notify_new_lead(lead: "Lead") -> None:
    if not (EMAIL_KEY and ADMIN_NOTIFY_EMAIL):
        logger.warning("Email notification skipped: missing EMERGENT_EMAIL_KEY or ADMIN_NOTIFY_EMAIL")
        return
    rows = "".join([
        _lead_row("Nombre", lead.nombre),
        _lead_row("Empresa", lead.empresa),
        _lead_row("Email", lead.email),
        _lead_row("Teléfono", lead.telefono),
        _lead_row("Tipo de empresa", lead.tipo_empresa),
        _lead_row("Quiere automatizar", lead.automatizar),
        _lead_row("Mensaje", lead.mensaje),
        _lead_row("Fecha", lead.created_at),
    ])
    html = (
        '<table role="presentation" width="100%" style="background:#f8fafc;padding:24px 0"><tr><td align="center">'
        '<table role="presentation" width="560" style="background:#ffffff;border-radius:12px;padding:32px;'
        'font-family:Arial,sans-serif;border:1px solid #e2e8f0">'
        '<tr><td><p style="font-size:12px;color:#0891b2;letter-spacing:2px;text-transform:uppercase;margin:0">'
        'CSP IA · Nueva solicitud</p>'
        f'<h1 style="font-size:20px;color:#0f172a;margin:12px 0 4px">Nueva solicitud de demostración</h1>'
        f'<p style="font-size:14px;color:#475569;margin:0 0 20px">Recibida desde el formulario de la web.</p>'
        f'<table role="presentation" width="100%">{rows}</table>'
        '<p style="font-size:12px;color:#94a3b8;margin:24px 0 0">Enviado por CSP IA. '
        'Nunca pedimos contraseñas ni datos bancarios por email.</p>'
        '</td></tr></table></td></tr></table>'
    )
    try:
        await send_email(
            to=ADMIN_NOTIFY_EMAIL,
            subject=f"Nueva solicitud de demostración — {lead.empresa}",
            html=html,
        )
        logger.info(f"Lead notification email sent for {lead.empresa}")
    except Exception as e:
        logger.error(f"Lead notification email failed: {e}")


# ---------- Admin auth ----------
JWT_ALGORITHM = "HS256"


def create_admin_token() -> str:
    payload = {"sub": "admin", "type": "admin",
               "exp": datetime.now(timezone.utc) + timedelta(hours=12)}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


async def require_admin(request: Request) -> dict:
    auth = request.headers.get("Authorization", "")
    token = auth[7:] if auth.startswith("Bearer ") else None
    if not token:
        raise HTTPException(status_code=401, detail="No autenticado")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "admin":
            raise HTTPException(status_code=401, detail="Token inválido")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sesión expirada")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")


class AdminLogin(BaseModel):
    password: str = Field(min_length=1, max_length=200)


# ---------- Leads ----------
class LeadCreate(BaseModel):
    nombre: str = Field(min_length=1, max_length=120)
    empresa: str = Field(min_length=1, max_length=160)
    email: str = Field(min_length=3, max_length=200)
    telefono: str = Field(default="", max_length=40)
    tipo_empresa: str = Field(default="", max_length=120)
    automatizar: str = Field(default="", max_length=200)
    mensaje: str = Field(default="", max_length=4000)


class Lead(LeadCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    origen: str = "web"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


@api_router.get("/")
async def root():
    return {"message": "CSP IA API", "status": "ok"}


@api_router.post("/leads", response_model=Lead)
async def create_lead(input: LeadCreate):
    lead = Lead(**input.model_dump(), origen="web")
    await db.leads.insert_one(lead.model_dump())
    await notify_new_lead(lead)
    return lead


@api_router.get("/leads", response_model=List[Lead], dependencies=[Depends(require_admin)])
async def list_leads():
    leads = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return leads


@api_router.post("/admin/login")
async def admin_login(input: AdminLogin, request: Request):
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:admin"
    since = (datetime.now(timezone.utc) - timedelta(minutes=15)).isoformat()
    fails = await db.login_attempts.count_documents({"identifier": identifier, "ts": {"$gte": since}})
    if fails >= 5:
        raise HTTPException(status_code=429, detail="Demasiados intentos. Inténtalo de nuevo en 15 minutos.")
    expected = os.environ.get("ADMIN_PASSWORD", "")
    if not expected or not hmac.compare_digest(input.password, expected):
        await db.login_attempts.insert_one(
            {"identifier": identifier, "ts": datetime.now(timezone.utc).isoformat()})
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")
    await db.login_attempts.delete_many({"identifier": identifier})
    return {"token": create_admin_token()}


@api_router.post("/admin/leads", response_model=Lead, dependencies=[Depends(require_admin)])
async def create_lead_manual(input: LeadCreate):
    lead = Lead(**input.model_dump(), origen="manual")
    await db.leads.insert_one(lead.model_dump())
    return lead


@api_router.put("/admin/leads/{lead_id}", response_model=Lead, dependencies=[Depends(require_admin)])
async def update_lead(lead_id: str, input: LeadCreate):
    result = await db.leads.update_one({"id": lead_id}, {"$set": input.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead no encontrado")
    doc = await db.leads.find_one({"id": lead_id}, {"_id": 0})
    return Lead(**doc)


@api_router.delete("/admin/leads/{lead_id}", dependencies=[Depends(require_admin)])
async def delete_lead(lead_id: str):
    result = await db.leads.delete_one({"id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead no encontrado")
    return {"deleted": True, "id": lead_id}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def create_indexes():
    try:
        await db.login_attempts.create_index("identifier")
    except Exception as e:
        logger.error(f"Index creation failed (non-fatal): {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
