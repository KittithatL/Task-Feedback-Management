from datetime import datetime
from bson import ObjectId

def project_document(data: dict):
    now = datetime.utcnow()
    return {
        "project_title": data["title"],
        "created_by": ObjectId(data["created_by"]),
        "created_at": now,
        "updated_at": now
    }
