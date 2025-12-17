import smtplib
from email.message import EmailMessage
from .config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM_EMAIL, FRONTEND_ORIGIN

def send_reset_email(recipient_email: str, token: str):
    msg = EmailMessage()
    msg["From"] = SMTP_FROM_EMAIL
    msg["To"] = recipient_email
    msg["Subject"] = "Reset Password"
    link = f"{FRONTEND_ORIGIN}/reset-password?token={token}"
    msg.set_content(f"Reset your password: {link}")
    if SMTP_USER and SMTP_PASSWORD:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
    else:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.send_message(msg)
