from sqlalchemy.orm import Session
from . import models

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, email: str, username: str, hashed_password: str):
    user = models.User(email=email, username=username, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def update_last_login(db: Session, user: models.User, ts):
    user.last_login = ts
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def set_refresh_jti(db: Session, user: models.User, jti: str):
    user.refresh_jti = jti
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
