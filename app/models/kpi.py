from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class KPI(Base):
    __tablename__ = "KPI"
    
    id_kpi = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nama = Column(String(255))
    deskripsi = Column(Text)
    id_campaign = Column(Integer, ForeignKey("Campaign.id_campaign", ondelete="CASCADE"))

    campaign = relationship("Campaign")