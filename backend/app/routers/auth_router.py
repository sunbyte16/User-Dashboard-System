from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from itsdangerous import URLSafeTimedSerializer, BadTimeSignature, SignatureExpired
from ..database import get_db
from ..schemas import UserCreate, UserLogin, TokenResponse, Message, PasswordResetRequest, PasswordResetConfirm
from ..crud import get_user_by_email, get_user_by_username, create_user, update_last_login, set_refresh_jti, get_user_by_id
from ..auth import verify_password, get_password_hash, create_access_token, create_refresh_token, decode_refresh_token
from ..config import SECRET_KEY, PASSWORD_RESET_TOKEN_EXPIRE_MINUTES
from ..email_utils import send_reset_email

router = APIRouter(prefix="/auth", tags=["auth"])

def set_refresh_cookie(response: Response, token: str):
    response.set_cookie(
        key="refresh_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=60 * 60 * 24 * 7,
        path="/"
    )

@router.post("/signup", response_model=TokenResponse)
def signup(payload: UserCreate, response: Response, db: Session = Depends(get_db)):
    if get_user_by_email(db, payload.email) or get_user_by_username(db, payload.username):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User exists")
    hashed = get_password_hash(payload.password)
    user = create_user(db, payload.email, payload.username, hashed)
    access = create_access_token(str(user.id))
    refresh, jti = create_refresh_token(str(user.id))
    set_refresh_jti(db, user, jti)
    set_refresh_cookie(response, refresh)
    return TokenResponse(access_token=access)

@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, response: Response, db: Session = Depends(get_db)):
    user = get_user_by_email(db, payload.email)
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    update_last_login(db, user, datetime.now(timezone.utc))
    access = create_access_token(str(user.id))
    refresh, jti = create_refresh_token(str(user.id))
    set_refresh_jti(db, user, jti)
    set_refresh_cookie(response, refresh)
    return TokenResponse(access_token=access)

@router.post("/logout", response_model=Message)
def logout(response: Response):
    response.delete_cookie("refresh_token", path="/")
    return Message(message="Logged out")

@router.post("/refresh", response_model=TokenResponse)
def refresh_token(request: Request, response: Response, db: Session = Depends(get_db)):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No refresh token")
    payload = decode_refresh_token(token)
    user = get_user_by_id(db, int(payload.get("sub")))
    if not user or not user.refresh_jti or user.refresh_jti != payload.get("jti"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    access = create_access_token(str(user.id))
    new_refresh, new_jti = create_refresh_token(str(user.id))
    set_refresh_jti(db, user, new_jti)
    set_refresh_cookie(response, new_refresh)
    return TokenResponse(access_token=access)

@router.post("/request-reset-password", response_model=Message)
def request_reset_password(payload: PasswordResetRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, payload.email)
    if not user:
        return Message(message="If account exists, email sent")
    s = URLSafeTimedSerializer(SECRET_KEY)
    token = s.dumps({"user_id": user.id})
    send_reset_email(user.email, token)
    return Message(message="Email sent")

@router.post("/reset-password", response_model=Message)
def reset_password(payload: PasswordResetConfirm, db: Session = Depends(get_db)):
    s = URLSafeTimedSerializer(SECRET_KEY)
    try:
        data = s.loads(payload.token, max_age=PASSWORD_RESET_TOKEN_EXPIRE_MINUTES * 60)
    except SignatureExpired:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token expired")
    except BadTimeSignature:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")
    user = get_user_by_id(db, int(data.get("user_id")))
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")
    user.hashed_password = get_password_hash(payload.new_password)
    user.refresh_jti = None
    db.add(user)
    db.commit()
    return Message(message="Password updated")
