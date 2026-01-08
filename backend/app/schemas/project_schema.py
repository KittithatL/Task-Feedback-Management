from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ProjectCreate(BaseModel):
    # เปลี่ยนจาก title เป็น project_title ให้ตรงกับ task_title เพื่อความสวยงามของ API
    project_title: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = ""
    created_by: str

class ProjectUpdate(BaseModel):
    # รองรับการแก้ไขชื่อโปรเจกต์ และรายละเอียด
    project_title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    # เพิ่มฟิลด์นี้เพื่อให้รองรับระบบ Trash (Soft Delete) ที่เราทำในหน้าแรก
    is_deleted: Optional[bool] = None

class ProjectResponse(ProjectCreate):
    id: str
    created_at: datetime
    is_deleted: bool = False

    class Config:
        from_attributes = True