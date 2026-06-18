from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date

class CampaignBase(BaseModel):
    tanggal: Optional[date] = None
    keterangan: Optional[str] = None
    budget: Optional[int] = None
    batas: Optional[date] = None


class CampaignCreate(CampaignBase):
    pass

class CampaignUpdate(CampaignBase):
    id_akun: Optional[int] = None

class Campaign(CampaignBase):
    id_campaign: int
    id_akun: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)