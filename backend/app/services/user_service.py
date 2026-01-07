from app.core.database import get_db
from app.models.user_model import user_document

db = get_db()
users = db["Users"]

def create_user(payload: dict):
    result = users.insert_one(user_document(payload))
    return str(result.inserted_id)

def list_users():
    data = []
    for u in users.find():
        u["id"] = str(u["_id"])
        del u["_id"]
        data.append(u)
    return data
