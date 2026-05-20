from pydantic import BaseModel, ConfigDict
from typing import Optional

class BriefBase(BaseModel):
    poin: Optional[str] = None
    detail_pesan: Optional[str] = None
    id_campaign: Optional[int] = None

class BriefCreate(BriefBase):
    pass

class Brief(BriefBase):
    id_brief: int

    model_config = ConfigDict(from_attributes=True)