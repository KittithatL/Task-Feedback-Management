from datetime import datetime

def user_document(data: dict):
    now = datetime.utcnow()
    return {
        "name": data["name"],
        "email": data["email"],
        "role": data["role"],
        "profile_img": data.get("profile_img"),
        "created_at": now,
        "updated_at": now
    }