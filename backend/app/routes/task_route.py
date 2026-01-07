from fastapi import APIRouter
from app.schemas.task_schema import TaskCreate, TaskStatusUpdate
from app.services.task_service import create_task, list_tasks, update_status

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/")
def create(payload: TaskCreate):
    return {"id": create_task(payload.dict())}

@router.get("/")
def get_all():
    return list_tasks()

@router.patch("/{task_id}/status")
def update(task_id: str, payload: TaskStatusUpdate):
    update_status(task_id, payload.status)
    return {"message": "updated"}
