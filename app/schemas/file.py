from pydantic import BaseModel, ConfigDict
from typing import Optional

class FileBase(BaseModel):
    nama: Optional[str] = None
    jenis: Optional[str] = None
    ukuran: Optional[int] = None
    path: Optional[str] = None

class FileCreate(FileBase):
    pass

class File(FileBase):
    id_file: int

    model_config = ConfigDict(from_attributes=True)