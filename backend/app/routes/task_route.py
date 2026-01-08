from fastapi import APIRouter, HTTPException
from app.schemas.task_schema import TaskCreate, TaskStatusUpdate
from app.services.task_service import (
    create_task, 
    list_tasks, 
    update_status, 
    get_tasks_by_project,
    delete_task # เพิ่มลบเข้าไปด้วยเผื่อใช้ในอนาคต
)

router = APIRouter(prefix="/tasks", tags=["Tasks"])

# ดึงงานทั้งหมดในระบบ
@router.get("/")
def get_all():
    return list_tasks()

# ดึงงานแยกตามโปรเจกต์
@router.get("/project/{project_id}")
def get_by_project(project_id: str):
    return get_tasks_by_project(project_id)

# อัปเดตสถานะ (Kanban Drag & Drop)
@router.patch("/{task_id}")
def update(task_id: str, payload: TaskStatusUpdate):
    success = update_status(task_id, payload.status)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "updated"}

# สร้าง Task ใหม่
@router.post("/")
def create(payload: TaskCreate):
    try:
        task_id = create_task(payload.dict())
        return {"id": task_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ลบ Task
@router.delete("/{task_id}")
def remove(task_id: str):
    success = delete_task(task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "deleted"}