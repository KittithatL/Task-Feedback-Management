from fastapi import APIRouter
from app.schemas.project_schema import ProjectCreate, ProjectUpdate
from app.services.project_service import create_project, list_projects, update_project

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("/")
def create(payload: ProjectCreate):
    return {"id": create_project(payload.dict())}

@router.get("/")
def get_all():
    return list_projects()

@router.patch("/{project_id}")
def update(project_id: str, payload: ProjectUpdate):
    update_project(project_id, payload.dict(exclude_unset=True))
    return {"message": "updated"}