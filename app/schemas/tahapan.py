from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date

class TahapanBase(BaseModel):
    nama: Optional[str] = None
    aktivitas: Optional[str] = None
    deadline: Optional[date] = None
    status: Optional[int] = None

class TahapanCreate(TahapanBase):
    nama: str
    id_campaign: int
    id_akun: Optional[int] = None

class TahapanUpdate(TahapanBase):
    id_akun: Optional[int] = None
    id_campaign: Optional[int] = None

class Tahapan(TahapanBase):
    id_tahapan: int
    id_akun: Optional[int] = None
    id_campaign: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)