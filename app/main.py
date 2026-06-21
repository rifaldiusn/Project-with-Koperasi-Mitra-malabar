from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os
from app.api import *
from app.middleware.audit import AuditLogMiddleware

app = FastAPI()

app.add_middleware(AuditLogMiddleware)

# Mount static uploads
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

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
