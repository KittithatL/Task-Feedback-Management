from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TaskCreate(BaseModel):
    title: str
    description: Optional[str]
    deadline: datetime
    created_by: str
    assigned_to: str

class TaskStatusUpdate(BaseModel):
    status: str
