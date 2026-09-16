from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import hmac
import logging
import os
import uuid
from datetime import datetime, timezone, timedelta
from typing import List

import jwt
from fastapi import FastAPI, APIRouter, BackgroundTasks, Depends, HTTPException, Request
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict
from starlette.middleware.cors import CORSMiddleware

from services.email_service import send_contact_notification, warn_if_smtp_config_missing

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="CSP IA API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

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
async def create_lead(input: LeadCreate, background_tasks: BackgroundTasks):
    lead = Lead(**input.model_dump(), origen="web")
    await db.leads.insert_one(lead.model_dump())
    background_tasks.add_task(send_contact_notification, lead.model_dump())
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
async def on_startup():
    warn_if_smtp_config_missing()
    try:
        await db.login_attempts.create_index("identifier")
    except Exception as e:
        logger.error(f"Index creation failed (non-fatal): {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
