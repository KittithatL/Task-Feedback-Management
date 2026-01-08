from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TaskCreate(BaseModel):
    project_id: str
    task_title: str
    description: Optional[str] = ""

    deadline: Optional[datetime] = None 

    status: Optional[str] = "TODO" 
    created_by: str
    assigned_to: str

class TaskStatusUpdate(BaseModel):
    status: str