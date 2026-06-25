from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date
from .customer import Customer
from .file import File

class KunjunganBase(BaseModel):
    nama: Optional[str] = None
    tanggal: Optional[date] = None
    catatan: Optional[str] = None
    longitude: Optional[str] = None
    latitude: Optional[str] = None
    id_file: Optional[int] = None
    id_customer: Optional[int] = None

class KunjunganCreate(KunjunganBase):
    pass

class KunjunganUpdate(KunjunganBase):
    pass

class Kunjungan(KunjunganBase):
    id_kunjungan: int
    customer: Optional[Customer] = None
    file: Optional[File] = None

    model_config = ConfigDict(from_attributes=True)