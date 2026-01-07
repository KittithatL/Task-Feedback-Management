from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from app.core.config import setting

client = MongoClient(
    setting.MONGO_URI,
    server_api=ServerApi("1")
)

db = client[setting.DB_NAME]

def get_db():
    return db