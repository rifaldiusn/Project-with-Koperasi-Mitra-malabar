from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Brief(Base):
    __tablename__ = "Brief"
    
    id_brief = Column(Integer, primary_key=True, index=True, autoincrement=True)
    poin = Column(String(255))
    detail_pesan = Column(String(255))
    id_campaign = Column(Integer, ForeignKey("Campaign.id_campaign", ondelete="CASCADE"))

    campaign = relationship("Campaign")