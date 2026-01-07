from datetime import datetime

def task_document(data: dict):
    return {
        "title": data["title"],
        "description": data.get("description"),
        "status": "TODO",
        "deadline": data["deadline"],
        "created_by": data["created_by"],
        "assigned_to": data["assigned_to"],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }