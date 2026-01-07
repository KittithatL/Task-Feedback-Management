from datetime import datetime
from bson import ObjectId

def task_document(data: dict):
    now = datetime.utcnow()
    return {
        "project_id": ObjectId(data["project_id"]),
        "task_title": data["title"],
        "description": data.get("description"),
        "status": "TODO",
        "deadline": data["deadline"],
        "created_by": ObjectId(data["created_by"]),
        "assigned_to": ObjectId(data["assigned_to"]),
        "created_at": now,
        "updated_at": now
    }