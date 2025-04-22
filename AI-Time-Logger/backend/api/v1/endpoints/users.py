from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

# Adjust relative imports based on your project structure
from .... import crud, models, security
from ....database import get_session

router = APIRouter()

@router.post("/", response_model=models.UserRead, status_code=status.HTTP_201_CREATED)
def create_user(*, session: Session = Depends(get_session), user_in: models.UserCreate):
    """
    Create new user.
    """
    user = crud.get_user_by_email(session=session, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The user with this email already exists in the system.",
        )
    user = crud.create_user(session=session, user_in=user_in)
    return user

@router.get("/me", response_model=models.UserRead)
def read_user_me(current_user: models.User = Depends(security.get_current_active_user)):
    """
    Get current user.
    """
    # The dependency already fetches and validates the user
    return current_user

# Add other user endpoints as needed (e.g., update user, list users for admin) 