from datetime import datetime
from bson import ObjectId

def project_document(data: dict):
    return {
        # เปลี่ยนจาก data["title"] เป็น data["project_title"]
        "project_title": data.get("project_title"), 
        "description": data.get("description", ""),
        "created_by": data.get("created_by"),
        "created_at": datetime.utcnow(),
        "is_deleted": False  # กำหนดค่าเริ่มต้นเป็น False
    }