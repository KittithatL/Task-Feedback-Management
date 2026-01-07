from app.core.database import get_db
from app.models.task_model import task_document
from bson import ObjectId
from datetime import datetime

db = get_db()
tasks = db["Tasks"]

def create_task(payload: dict):
    result = tasks.insert_one(task_document(payload))
    return str(result.inserted_id)

def list_tasks():
    data = []
    for t in tasks.find():
        t["id"] = str(t["_id"])
        del t["_id"]
        data.append(t)
    return data

def update_status(task_id: str, status: str):
    tasks.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"status": status, "updated_at": datetime.utcnow()}}
    )
