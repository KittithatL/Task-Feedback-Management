from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    MONGO_URI: str = os.getenv("URI")
    DB_NAME: str = os.getenv("DB_NAME")

setting = Settings()