from pydantic import BaseModel, ConfigDict
from typing import Optional

class TargetBase(BaseModel):
    nama: Optional[str] = None
    deskripsi: Optional[str] = None
    id_akun: Optional[int] = None

class TargetCreate(TargetBase):
    pass

class Target(TargetBase):
    id_target: int

    model_config = ConfigDict(from_attributes=True)