from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class LogBase(BaseModel):
    id_akun: Optional[int] = None
    role: Optional[int] = None
    method: Optional[str] = None
    path: Optional[str] = None
    status_code: Optional[int] = None
    ip_address: Optional[str] = None


class Log(LogBase):
    id_log: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
