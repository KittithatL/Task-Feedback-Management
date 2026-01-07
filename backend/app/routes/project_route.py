from fastapi import APIRouter, HTTPException
from app.schemas.project_schema import ProjectCreate, ProjectUpdate
from app.services.project_service import (
    create_project, 
    list_projects, 
    update_project, 
    delete_project, 
    restore_project,
    permanent_delete_project
)

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("/")
def create(payload: ProjectCreate):
    return {"id": create_project(payload.dict())}


@router.get("/")
def get_all(show_trash: bool = False):
    return list_projects(show_trash=show_trash)

@router.patch("/{project_id}")
def update(project_id: str, payload: ProjectUpdate):
    update_project(project_id, payload.dict(exclude_unset=True))
    return {"message": "updated"}


@router.delete("/{project_id}")
def delete_to_trash(project_id: str):
    success = delete_project(project_id)
    if success:
        return {"message": "Moved to trash successfully"}
    raise HTTPException(status_code=404, detail="Project not found")


@router.patch("/{project_id}/restore")
def restore(project_id: str):
    success = restore_project(project_id)
    if success:
        return {"message": "Project restored successfully"}
    raise HTTPException(status_code=404, detail="Project not found in trash")


@router.delete("/{project_id}/permanent")
def permanent_delete(project_id: str):
    success = permanent_delete_project(project_id)
    if success:
        return {"message": "Project permanently deleted"}
    raise HTTPException(status_code=404, detail="Project not found")