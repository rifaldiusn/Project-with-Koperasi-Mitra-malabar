from pydantic import BaseModel, ConfigDict
from typing import Optional

class DealingBase(BaseModel):
    budget_produk: Optional[int] = None
    kode_voucher: Optional[str] = None
    lampiran: Optional[str] = None
    id_campaign: Optional[int] = None
    id_file: Optional[int] = None
    id_kol: Optional[int] = None

class DealingCreate(DealingBase):
    pass

class Dealing(DealingBase):
    id_dealing: int

    model_config = ConfigDict(from_attributes=True)