from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date

class DataBase(BaseModel):
    periode: Optional[date] = None
    dilihat: Optional[int] = None
    diklik: Optional[int] = None
    suka: Optional[int] = None
    keranjang: Optional[int] = None
    id_produk: Optional[int] = None

class DataCreate(DataBase):
    pass

class Data(DataBase):
    id_data: int

    model_config = ConfigDict(from_attributes=True)