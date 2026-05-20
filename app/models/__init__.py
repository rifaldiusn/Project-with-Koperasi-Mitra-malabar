# LEVEL 0: Tabel Independen
from .akun import Akun
from .produk import Produk
from .file import File
from .kol import KOL

# LEVEL 1: Merujuk ke Tabel Level 0
from .variasi import Variasi
from .token import Token
from .data import Data
from .pesan import Pesan
from .target import Target
from .customer import Customer
from .campaign import Campaign

# LEVEL 2: Merujuk ke Tabel Level 1
from .penjualan import Penjualan
from .kunjungan import Kunjungan
from .tahapan import Tahapan
from .kpi import KPI
from .brief import Brief
from .dealing import Dealing

__all__ = [
    "Akun",
    "Produk",
    "File",
    "KOL",
    "Variasi",
    "Token",
    "Data",
    "Pesan",
    "Target",
    "Customer",
    "Campaign",
    "Penjualan",
    "Kunjungan",
    "Tahapan",
    "KPI",
    "Brief",
    "Dealing"
]