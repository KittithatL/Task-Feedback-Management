from app.core.database import get_db
from app.models.task_model import task_document
from bson import ObjectId
from datetime import datetime

db = get_db()
tasks = db["Tasks"]

def serialize_task(t):
    """แปลง MongoDB Document เป็น JSON-friendly dict"""
    if not t: return None
    t["id"] = str(t["_id"])
    for field in ["project_id", "created_by", "assigned_to"]:
        if field in t and t[field]:
            t[field] = str(t[field])
    del t["_id"]
    return t

def create_task(payload: dict):
    # ปรับคีย์ให้ตรงกับที่ task_model ต้องการ (task_title)
    if "title" in payload:
        payload["task_title"] = payload.pop("title")
    elif "task_title" in payload:
        pass # ถูกต้องแล้ว
        
    doc = task_document(payload)
    result = tasks.insert_one(doc)
    return str(result.inserted_id)

def list_tasks():
    """เพิ่มฟังก์ชันนี้เพื่อแก้ ImportError"""
    data = []
    # ดึงงานทั้งหมด เรียงตามเวลาล่าสุด
    for t in tasks.find().sort("created_at", -1):
        data.append(serialize_task(t))
    return data

def get_tasks_by_project(project_id: str):
    data = []
    cursor = tasks.find({"project_id": ObjectId(project_id)}).sort("created_at", 1)
    for t in cursor:
        data.append(serialize_task(t))
    return data

def update_status(task_id: str, status: str):
    result = tasks.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {
            "status": status, 
            "updated_at": datetime.utcnow()
        }}
    )
    return result.modified_count > 0

def delete_task(task_id: str):
    result = tasks.delete_one({"_id": ObjectId(task_id)})
    return result.deleted_count > 0