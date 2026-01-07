from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TaskCreate(BaseModel):
    project_id: str
    task_title: str
    description: Optional[str] = None
    deadline: datetime
    created_by: str
    assigned_to: str

class TaskStatusUpdate(BaseModel):
    status: str
