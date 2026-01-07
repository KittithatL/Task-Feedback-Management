from app.core.database import get_db
from app.models.project_model import project_document
from bson import ObjectId
from datetime import datetime

db = get_db()
projects = db["Projects"]


def _format_project(p):
    p["id"] = str(p["_id"])
    if "created_by" in p and isinstance(p["created_by"], ObjectId):
        p["created_by"] = str(p["created_by"])
    del p["_id"]
    return p

def create_project(payload: dict):
    doc = project_document(payload)
    doc["is_deleted"] = False
    result = projects.insert_one(doc)
    return str(result.inserted_id)

def list_projects(show_trash: bool = False):
    """
    show_trash = False: ดึงเฉพาะโปรเจกต์ที่ใช้งานอยู่
    show_trash = True: ดึงเฉพาะโปรเจกต์ที่อยู่ในถังขยะ
    """
    data = []

    query = {"is_deleted": True} if show_trash else {"is_deleted": {"$ne": True}}
    
    for p in projects.find(query).sort("created_at", -1):
        data.append(_format_project(p))
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


def delete_project(project_id: str):
    try:
        result = projects.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": {"is_deleted": True, "deleted_at": datetime.utcnow()}}
        )
        return result.modified_count > 0
    except Exception as e:
        print(f"Error moving to trash: {e}")
        return False


def restore_project(project_id: str):
    try:
        result = projects.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": {"is_deleted": False}, "$unset": {"deleted_at": ""}}
        )
        return result.modified_count > 0
    except Exception as e:
        print(f"Error restoring project: {e}")
        return False


def permanent_delete_project(project_id: str):
    try:
        result = projects.delete_one({"_id": ObjectId(project_id)})
        return result.deleted_count > 0
    except Exception as e:
        print(f"Error permanent deleting: {e}")
        return False