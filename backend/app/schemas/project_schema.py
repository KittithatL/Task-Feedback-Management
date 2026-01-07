from pydantic import BaseModel, Field
from typing import Optional

class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    created_by: str

class ProjectUpdate(BaseModel):
    title: Optional[str] = None