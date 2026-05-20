from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import os
from sqlalchemy import text
from app.db.session import engine
from app.api import *

app = FastAPI()

# Mount static uploads
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(akun_router, prefix="/akun", tags=["akun"])
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(customer_router, prefix="/customer", tags=["customer"])
app.include_router(kunjungan_router, prefix="/kunjungan", tags=["kunjungan"])

@app.get("/demo", response_class=HTMLResponse)
def demo():
    demo_path = os.path.join("app", "api", "demo.html")
    if os.path.exists(demo_path):
        with open(demo_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(content="<h1>Demo UI not found</h1>")

