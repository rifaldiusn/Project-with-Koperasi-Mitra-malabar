from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os
from app.api import *
from app.middleware.audit import AuditLogMiddleware
from app.middleware.cors import setup_cors

limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])

app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(AuditLogMiddleware)

# CORS
setup_cors(app)

#A
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(akun_router, prefix="/api/akun", tags=["akun"])
#B
app.include_router(brief_router, prefix="/api/brief", tags=["brief"])
#C
app.include_router(campaign_router, prefix="/api/campaign", tags=["campaign"])
app.include_router(customer_router, prefix="/api/customer", tags=["customer"])
#D
app.include_router(data_router, prefix="/api/data", tags=["data"])
app.include_router(dealing_router, prefix="/api/dealing", tags=["dealing"])
#K
app.include_router(kpi_router, prefix="/api/kpi", tags=["kpi"])
app.include_router(kunjungan_router, prefix="/api/kunjungan", tags=["kunjungan"])
app.include_router(kol_router, prefix="/api/kol", tags=["kol"])
#L
app.include_router(log_router, prefix="/api/log", tags=["log"])
#P
app.include_router(produk_router, prefix="/api/produk", tags=["produk"])
app.include_router(penjualan_router, prefix="/api/penjualan", tags=["penjualan"])
app.include_router(pesan_router, prefix="/api/pesan", tags=["pesan"])
#T
app.include_router(tahapan_router, prefix="/api/tahapan", tags=["tahapan"])
#V
app.include_router(variasi_router, prefix="/api/variasi", tags=["variasi"])

# Mount static uploads
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Mount frontend files (HTML/CSS/JS) as the default route
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")