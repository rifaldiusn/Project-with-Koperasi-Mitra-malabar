from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date

class PesanBase(BaseModel):
    periode: Optional[date] = None
    dibuat: Optional[int] = None
    dikirim: Optional[int] = None
    id_produk: Optional[int] = None

class PesanCreate(PesanBase):
    pass

class Pesan(PesanBase):
    id_pesan: int

    model_config = ConfigDict(from_attributes=True)