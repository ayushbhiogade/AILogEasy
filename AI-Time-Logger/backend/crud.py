from sqlmodel import Session, select
from typing import Optional

from . import models, security

def get_user_by_email(session: Session, email: str) -> Optional[models.User]:
    statement = select(models.User).where(models.User.email == email)
    return session.exec(statement).first()

def create_user(session: Session, user_in: models.UserCreate) -> models.User:
    hashed_password = security.get_password_hash(user_in.password)
    # Create a User instance, excluding the plain password from user_in
    db_user = models.User.model_validate(user_in, update={"hashed_password": hashed_password})

    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

def authenticate_user(session: Session, email: str, password: str) -> Optional[models.User]:
    user = get_user_by_email(session, email=email)
    if not user:
        return None
    if not security.verify_password(password, user.hashed_password):
        return None
    return user

# Add other CRUD functions as needed (get_user, update_user, delete_user) 