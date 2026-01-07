from fastapi import APIRouter, HTTPException
from app.schemas.user_schema import UserCreate, UserResponse
from app.services.user_service import create_user, list_users, update_user_link
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/users", tags=["Users"])

class ImageLinkUpdate(BaseModel):
    profile_img: str

@router.post("/")
def create(payload: UserCreate):
    return {"id": create_user(payload.dict())}

@router.get("/", response_model=List[UserResponse])
def get_all():
    return list_users()

@router.patch("/{user_id}/update-link")
def update_link(user_id: str, payload: ImageLinkUpdate):
    update_user_link(user_id, payload.profile_img)
    return {"message": "Link updated successfully"}