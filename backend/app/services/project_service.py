from app.core.database import get_db
from app.models.project_model import project_document
from bson import ObjectId
from datetime import datetime

db = get_db()
projects = db["Projects"]

def _format_project(p):
    """แปลงข้อมูลจาก MongoDB ให้พร้อมส่งออกเป็น JSON"""
    if not p: return None
    p["id"] = str(p["_id"])
    
    # แปลง ObjectId ทุกตัวที่มีโอกาสเจอเป็น String
    fields_to_str = ["created_by", "owner_id"]
    for field in fields_to_str:
        if field in p and isinstance(p[field], ObjectId):
            p[field] = str(p[field])
            
    del p["_id"]
    return p

def create_project(payload: dict):
    # ตรวจสอบว่ามีคีย์ project_title หรือไม่ (กันพังจาก KeyError)
    if "title" in payload and "project_title" not in payload:
        payload["project_title"] = payload.pop("title")
        
    doc = project_document(payload)
    # รับประกันว่าสถานะเริ่มต้นคือยังไม่ถูกลบ
    doc["is_deleted"] = False 
    
    result = projects.insert_one(doc)
    return str(result.inserted_id)

def list_projects(show_trash: bool = False):
    """
    show_trash = False: ดึงโปรเจกต์ปกติ
    show_trash = True: ดึงโปรเจกต์ที่อยู่ในถังขยะ
    """
    data = []
    # ใช้ query ให้ชัดเจน
    query = {"is_deleted": True} if show_trash else {"is_deleted": {"$ne": True}}
    
    # ดึงข้อมูลและเรียงลำดับตามเวลาสร้าง (ล่าสุดขึ้นก่อน)
    for p in projects.find(query).sort("created_at", -1):
        data.append(_format_project(p))
    return data

def update_project(project_id: str, payload: dict):
    # ปรับคีย์ถ้า Frontend ส่ง 'title' มาแทน 'project_title'
    if "title" in payload:
        payload["project_title"] = payload.pop("title")

    # กรองเอาเฉพาะค่าที่ไม่ใช่ None เพื่อไม่ให้ไปทับค่าเดิมใน DB
    update_data = {k: v for k, v in payload.items() if v is not None}
    
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        result = projects.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": update_data}
        )
        return result.modified_count > 0
    return False

def delete_project(project_id: str):
    """ย้ายไปที่ถังขยะ (Soft Delete)"""
    try:
        result = projects.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": {
                "is_deleted": True, 
                "deleted_at": datetime.utcnow()
            }}
        )
        return result.modified_count > 0
    except Exception as e:
        print(f"Error moving to trash: {e}")
        return False

def restore_project(project_id: str):
    """กู้คืนจากถังขยะ"""
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
    """ลบออกจากฐานข้อมูลถาวร"""
    try:
        result = projects.delete_one({"_id": ObjectId(project_id)})
        return result.deleted_count > 0
    except Exception as e:
        print(f"Error permanent deleting: {e}")
        return False