from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date

class CampaignBase(BaseModel):
    tanggal: Optional[date] = None
    keterangan: Optional[str] = None
    budget: Optional[int] = None
    batas: Optional[date] = None
    id_akun: Optional[int] = None

class CampaignCreate(CampaignBase):
    pass

class Campaign(CampaignBase):
    id_campaign: int

    model_config = ConfigDict(from_attributes=True)