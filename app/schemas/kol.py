from pydantic import BaseModel, ConfigDict
from typing import Optional

class KOLBase(BaseModel):
    nama: Optional[str] = None
    kategori: Optional[str] = None
    rate: Optional[str] = None

class KOLCreate(KOLBase):
    pass

class KOLUpdate(KOLBase):
    pass

class KOL(KOLBase):
    id_kol: int

    model_config = ConfigDict(from_attributes=True)