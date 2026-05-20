from pydantic import BaseModel, ConfigDict
from typing import Optional

class AkunBase(BaseModel):
    username: str
    nama: Optional[str] = None
    telp: Optional[str] = None
    role: Optional[int] = None

class AkunCreate(AkunBase):
    hashed_password: str
    salt: str

class AkunCreateRequest(AkunBase):
    password: str

class AkunUpdate(BaseModel):
    username: Optional[str] = None
    nama: Optional[str] = None
    telp: Optional[str] = None
    role: Optional[int] = None
    password: Optional[str] = None

class Akun(AkunBase):
    id_akun: int

    model_config = ConfigDict(from_attributes=True)