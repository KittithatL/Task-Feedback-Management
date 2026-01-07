from fastapi import FastAPI
from app.routes import user_route, task_route

app = FastAPI(title="Task Management API")

app.include_router(user_route.router)
app.include_router(task_route.router)

@app.get("/")
def health():
    return {"status": "OK"}
