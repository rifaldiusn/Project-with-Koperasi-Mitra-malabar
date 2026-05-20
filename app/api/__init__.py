from app.api.akun import router as akun_router
from app.api.auth import router as auth_router
from app.api.customer import router as customer_router
from app.api.kunjungan import router as kunjungan_router

__all__ = [
    "akun_router", 
    "auth_router", 
    "customer_router",
    "kunjungan_router"
    ]