from pydantic import BaseModel, ConfigDict
from typing import Optional

class CustomerBase(BaseModel):
    nama: Optional[str] = None
    alamat: Optional[str] = None
    email: Optional[str] = None
    telp: Optional[str] = None
    jenis: Optional[str] = None
    link_gmaps: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(CustomerBase):
    id_akun: Optional[int] = None

class Customer(CustomerBase):
    id_customer: int
    id_akun: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)