from typing import Optional
from sqlmodel import Field, SQLModel, Column
from sqlalchemy import String # Using SQLAlchemy for unique constraint

class UserBase(SQLModel):
    email: str = Field(index=True, sa_column=Column("email", String, unique=True))
    # username: Optional[str] = Field(default=None, index=True, unique=True) # Optional username
    full_name: Optional[str] = None
    is_active: bool = Field(default=True)
    is_superuser: bool = Field(default=False)

# Database model (table=True indicates this is a database table)
class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str = Field()

# Pydantic models for API requests/responses
class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int

class UserUpdate(SQLModel):
    email: Optional[str] = None
    password: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None

# --- Added Token Models --- 

# Contents of JWT token
class TokenPayload(SQLModel):
    sub: Optional[str] = None # "sub" is standard for subject (often user identifier like email)
    id: Optional[int] = None

# Response model for login endpoint
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer" 