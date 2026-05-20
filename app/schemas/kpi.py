from pydantic import BaseModel, ConfigDict
from typing import Optional

class KPIBase(BaseModel):
    nama: Optional[str] = None
    deskripsi: Optional[str] = None
    id_campaign: Optional[int] = None

class KPICreate(KPIBase):
    pass

class KPI(KPIBase):
    id_kpi: int

    model_config = ConfigDict(from_attributes=True)