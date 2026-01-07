from fastapi import APIRouter
from app.schemas.user_schema import UserCreate
from app.services.user_service import create_user, list_users

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/")
def create(payload: UserCreate):
    return {"id": create_user(payload.dict())}

@router.get("/")
def get_all():
    return list_users()
