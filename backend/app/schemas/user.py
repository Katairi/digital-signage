# app/schemas/user.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    role: str = "admin"
    site_id: Optional[int] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    site_id: Optional[int] = None
    password: Optional[str] = None

class UserRead(UserBase):
    id: int
    
    class Config:
        from_attributes = True