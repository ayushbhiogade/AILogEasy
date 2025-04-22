from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

# Adjust relative imports based on your project structure
# Assuming 'api' is directly under 'backend'
from .... import crud, models, security
from ....database import get_session

router = APIRouter()

# Define the response model for the token endpoint
# This should ideally live in models.py
# class Token(models.SQLModel):
#     access_token: str
#     token_type: str

# Reference the model defined in models.py
@router.post("/token", response_model=models.Token)
def login_for_access_token(session: Session = Depends(get_session), form_data: OAuth2PasswordRequestForm = Depends()):
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    user = crud.authenticate_user(
        session=session, email=form_data.username, password=form_data.password # Note: form_data.username is used for email here
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")

    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email, "id": user.id}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
