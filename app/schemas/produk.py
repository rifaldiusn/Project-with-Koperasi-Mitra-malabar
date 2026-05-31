from pydantic import BaseModel, ConfigDict
from typing import Optional

class ProdukBase(BaseModel):
    kode: str
    nama: Optional[str] = None
    status: Optional[str] = None

class ProdukCreate(ProdukBase):
    pass

class ProdukUpdate(BaseModel):
    kode: Optional[str] = None
    nama: Optional[str] = None
    status: Optional[str] = None

class Produk(ProdukBase):
    id_produk: int

    model_config = ConfigDict(from_attributes=True)