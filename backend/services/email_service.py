"""Notificaciones por correo para CSP IA mediante Gmail SMTP y STARTTLS."""

import logging
import os
import smtplib
import ssl
from email.message import EmailMessage
from email.utils import formataddr
from html import escape

logger = logging.getLogger(__name__)

REQUIRED_VARS = (
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_APP_PASSWORD",
    "EMAIL_FROM",
    "ADMIN_NOTIFY_EMAIL",
)

SMTP_TIMEOUT_SECONDS = 15


def missing_smtp_vars() -> list[str]:
    """Devuelve nombres de variables ausentes sin revelar sus valores."""
    return [name for name in REQUIRED_VARS if not os.environ.get(name)]


def warn_if_smtp_config_missing() -> None:
    """Avisa de configuración incompleta sin impedir el arranque."""
    missing = missing_smtp_vars()
    if missing:
        logger.warning(
            "Configuracion SMTP incompleta al arrancar; faltan: %s. "
            "El formulario seguira guardando en MongoDB, pero no se enviaran correos.",
            ", ".join(missing),
        )
    else:
        logger.info("Configuracion SMTP detectada correctamente al arrancar.")


def _sanitize_header(value: str) -> str:
    """Evita inyección de cabeceras mediante retornos de carro o saltos de línea."""
    return (value or "").replace("\r", " ").replace("\n", " ").strip()


def _row(label: str, value: str) -> str:
    return (
        f'<tr><td style="padding:8px 16px 8px 0;color:#64748b;font-size:13px;'
        f'vertical-align:top;white-space:nowrap">{escape(label)}</td>'
        f'<td style="padding:8px 0;color:#0f172a;font-size:14px">'
        f'{escape(value or "—")}</td></tr>'
    )


def _build_html(lead: dict) -> str:
    rows = "".join(
        [
            _row("Nombre", lead.get("nombre", "")),
            _row("Empresa", lead.get("empresa", "")),
            _row("Email", lead.get("email", "")),
            _row("Teléfono", lead.get("telefono", "")),
            _row("Tipo de empresa", lead.get("tipo_empresa", "")),
            _row("Automatización solicitada", lead.get("automatizar", "")),
            _row("Mensaje", lead.get("mensaje", "")),
            _row("Origen", lead.get("origen", "")),
            _row("Fecha", lead.get("created_at", "")),
        ]
    )
    return (
        '<table role="presentation" width="100%" style="background:#f8fafc;padding:24px 0">'
        '<tr><td align="center">'
        '<table role="presentation" width="560" style="background:#ffffff;border-radius:12px;'
        'padding:32px;font-family:Arial,sans-serif;border:1px solid #e2e8f0"><tr><td>'
        '<p style="font-size:12px;color:#0891b2;letter-spacing:2px;text-transform:uppercase;'
        'margin:0">CSP IA · Nuevo contacto</p>'
        '<h1 style="font-size:20px;color:#0f172a;margin:12px 0 4px">Nuevo contacto desde la web</h1>'
        '<p style="font-size:14px;color:#475569;margin:0 0 20px">Recibido desde el formulario.</p>'
        f'<table role="presentation" width="100%">{rows}</table>'
        '<p style="font-size:12px;color:#94a3b8;margin:24px 0 0">Enviado por CSP IA.</p>'
        '</td></tr></table></td></tr></table>'
    )


def _build_text(lead: dict) -> str:
    fields = [
        ("Nombre", lead.get("nombre", "")),
        ("Empresa", lead.get("empresa", "")),
        ("Email", lead.get("email", "")),
        ("Teléfono", lead.get("telefono", "")),
        ("Tipo de empresa", lead.get("tipo_empresa", "")),
        ("Automatización solicitada", lead.get("automatizar", "")),
        ("Mensaje", lead.get("mensaje", "")),
        ("Origen", lead.get("origen", "")),
        ("Fecha", lead.get("created_at", "")),
    ]
    lines = ["Nuevo contacto desde la web", ""]
    lines.extend(f"{label}: {value or '—'}" for label, value in fields)
    return "\n".join(lines)


def send_contact_notification(lead: dict) -> None:
    """Envía la notificación; nunca propaga fallos de correo al lead guardado."""
    missing = missing_smtp_vars()
    if missing:
        logger.warning(
            "Email notification skipped: faltan variables: %s", ", ".join(missing)
        )
        return

    try:
        port = int(os.environ["SMTP_PORT"])
    except ValueError:
        logger.error("Email notification skipped: SMTP_PORT no es un entero")
        return

    visitor_email = _sanitize_header(lead.get("email", ""))
    empresa = lead.get("empresa", "")
    nombre = lead.get("nombre", "")

    message = EmailMessage()
    message["Subject"] = _sanitize_header(
        f"Nuevo contacto web — {nombre} ({empresa})"
    )
    message["From"] = formataddr(
        (os.environ.get("EMAIL_FROM_NAME", "CSP IA"), os.environ["EMAIL_FROM"])
    )
    message["To"] = os.environ["ADMIN_NOTIFY_EMAIL"]
    if visitor_email and "@" in visitor_email:
        message["Reply-To"] = visitor_email
    message.set_content(_build_text(lead))
    message.add_alternative(_build_html(lead), subtype="html")

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP(
            os.environ["SMTP_HOST"], port, timeout=SMTP_TIMEOUT_SECONDS
        ) as smtp:
            smtp.ehlo()
            smtp.starttls(context=context)
            smtp.ehlo()
            smtp.login(os.environ["SMTP_USER"], os.environ["SMTP_APP_PASSWORD"])
            smtp.send_message(message)
        logger.info("Lead notification email sent (empresa=%r)", empresa)
    except Exception as exc:
        logger.error(
            "Lead notification email FAILED (empresa=%r): %s: %s",
            empresa,
            type(exc).__name__,
            exc,
        )
