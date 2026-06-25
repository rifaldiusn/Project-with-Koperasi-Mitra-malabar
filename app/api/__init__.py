from app.api.akun import router as akun_router
from app.api.auth import router as auth_router
from app.api.customer import router as customer_router
from app.api.kunjungan import router as kunjungan_router
from app.api.campaign import router as campaign_router
from app.api.kpi import router as kpi_router
from app.api.brief import router as brief_router
from app.api.tahapan import router as tahapan_router
from app.api.kol import router as kol_router
from app.api.dealing import router as dealing_router
from app.api.produk import router as produk_router
from app.api.variasi import router as variasi_router
from app.api.penjualan import router as penjualan_router
from app.api.data import router as data_router
from app.api.pesan import router as pesan_router
from app.api.log import router as log_router
from app.api.target import router as target_router

__all__ = [
    "akun_router", 
    "auth_router", 
    "customer_router",
    "kunjungan_router",
    "campaign_router",
    "kpi_router",
    "brief_router",
    "tahapan_router",
    "kol_router",
    "dealing_router",
    "produk_router",
    "variasi_router",
    "penjualan_router",
    "data_router",
    "pesan_router",
    "log_router",
    "target_router"
    ]