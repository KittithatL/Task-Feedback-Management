from datetime import datetime

def user_document(data:dict):
    return{
        "name": data["name"],
        "email": data["email"],
        "role": data["role"],
        "created_at": datetime.utcnow()
    }