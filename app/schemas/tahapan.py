from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date

class TahapanBase(BaseModel):
    nama: Optional[str] = None
    aktivitas: Optional[str] = None
    deadline: Optional[date] = None
    status: Optional[int] = None
    id_akun: Optional[int] = None
    id_campaign: Optional[int] = None

class TahapanCreate(TahapanBase):
    pass

class Tahapan(TahapanBase):
    id_tahapan: int

    model_config = ConfigDict(from_attributes=True)