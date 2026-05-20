from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date

class PenjualanBase(BaseModel):
    periode: Optional[date] = None
    nominal: Optional[int] = None
    jenis: Optional[int] = None
    id_variasi: Optional[int] = None

class PenjualanCreate(PenjualanBase):
    pass

class Penjualan(PenjualanBase):
    id_penjualan: int

    model_config = ConfigDict(from_attributes=True)