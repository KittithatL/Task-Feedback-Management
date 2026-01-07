from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import user_route, task_route, project_route

app = FastAPI(title="Task Management API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_route.router)
app.include_router(task_route.router)
app.include_router(project_route.router)

@app.get("/")
def health():
    return {"status": "OK"}