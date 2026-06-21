from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os
from app.api import *
from app.middleware.audit import AuditLogMiddleware

limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])

app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(AuditLogMiddleware)

# Mount static uploads
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
# CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173,http://127.0.0.1:5500").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#A
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(akun_router, prefix="/akun", tags=["akun"])
#B
app.include_router(brief_router, prefix="/brief", tags=["brief"])
#C
app.include_router(campaign_router, prefix="/campaign", tags=["campaign"])
app.include_router(customer_router, prefix="/customer", tags=["customer"])
#D
app.include_router(dealing_router, prefix="/dealing", tags=["dealing"])
#K
app.include_router(kpi_router, prefix="/kpi", tags=["kpi"])
app.include_router(kunjungan_router, prefix="/kunjungan", tags=["kunjungan"])
app.include_router(kol_router, prefix="/kol", tags=["kol"])
#P
app.include_router(produk_router, prefix="/produk", tags=["produk"])
#V
app.include_router(variasi_router, prefix="/variasi", tags=["variasi"])
#PE
app.include_router(penjualan_router, prefix="/penjualan", tags=["penjualan"])
#DA
app.include_router(data_router, prefix="/data", tags=["data"])
#PE_S
app.include_router(pesan_router, prefix="/pesan", tags=["pesan"])
#T
app.include_router(tahapan_router, prefix="/tahapan", tags=["tahapan"])
#L
app.include_router(log_router, prefix="/log", tags=["log"])
