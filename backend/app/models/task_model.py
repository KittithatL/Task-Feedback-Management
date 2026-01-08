from datetime import datetime
from bson import ObjectId

def task_document(data: dict):
    now = datetime.utcnow()
    return {
        # แปลงเป็น ObjectId สำหรับเก็บใน MongoDB
        "project_id": ObjectId(data["project_id"]) if data.get("project_id") else None,
        "task_title": data.get("task_title"),  # เปลี่ยนจาก data["title"]
        "description": data.get("description", ""),
        "status": data.get("status", "TODO"), # รับค่าจาก schema หรือ default เป็น TODO
        "deadline": data.get("deadline"),     # รองรับค่า None (Optional)
        "created_by": ObjectId(data["created_by"]) if data.get("created_by") else None,
        "assigned_to": ObjectId(data["assigned_to"]) if data.get("assigned_to") else None,
        "created_at": data.get("created_at", now),
        "updated_at": now
    }