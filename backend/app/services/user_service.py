from app.core.database import get_db
from app.models.user_model import user_document
from bson import ObjectId
from datetime import datetime

db = get_db()
users = db["Users"]

def create_user(payload: dict):
    doc = user_document(payload)
    result = users.insert_one(doc)
    return str(result.inserted_id)

def update_user_link(user_id: str, image_url: str):
    users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"profile_img": image_url, "updated_at": datetime.utcnow()}}
    )
    return True

def list_users():
    data = []
    for u in users.find():
        u["id"] = str(u["_id"])
        del u["_id"]
        data.append(u)
    return data