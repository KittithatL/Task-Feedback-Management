from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    role: str
    profile_img: Optional[str] = None 

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    profile_img: Optional[str] = None
    created_at: datetime