from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from ..schemas import UserOut
from ..database import get_db
from ..models import User
from ..auth import decode_access_token

router = APIRouter(prefix="/users", tags=["users"])

def get_current_user(token: str, db: Session) -> User:
    payload = decode_access_token(token)
    user_id = int(payload.get("sub"))
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user")
    return user

@router.get("/me", response_model=UserOut)
def read_me(authorization: str | None = Header(default=None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    token = authorization.replace("Bearer ", "")
    user = get_current_user(token, db)
    return user
