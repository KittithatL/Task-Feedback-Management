from app.core.database import get_db
from app.models.project_model import project_document
from bson import ObjectId
from datetime import datetime

db = get_db()
projects = db["Projects"]

def create_project(payload: dict):
    result = projects.insert_one(project_document(payload))
    return str(result.inserted_id)

def list_projects():
    data = []
    for p in projects.find():
        p["id"] = str(p["_id"])
        del p["_id"]
        data.append(p)
    return data

def update_project(project_id: str, payload: dict):
    update_data = {k: v for k, v in payload.items() if v is not None}
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        projects.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": update_data}
        )
    return True