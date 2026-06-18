from pydantic import BaseModel, ConfigDict
from typing import Optional

class VariasiBase(BaseModel):
    kode: str
    nama: Optional[str] = None
    harga: Optional[int] = None
    status: Optional[int] = None
    id_produk: Optional[int] = None

class VariasiCreate(VariasiBase):
    pass

class VariasiUpdate(BaseModel):
    kode: Optional[str] = None
    nama: Optional[str] = None
    harga: Optional[int] = None
    status: Optional[int] = None
    id_produk: Optional[int] = None

class Variasi(VariasiBase):
    id_variasi: int

    model_config = ConfigDict(from_attributes=True)