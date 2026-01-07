from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    role: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    created_at: datetime
