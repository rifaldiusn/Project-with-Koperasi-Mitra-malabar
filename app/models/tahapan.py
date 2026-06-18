from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Tahapan(Base):
    __tablename__ = "Tahapan"
    
    id_tahapan = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nama = Column(String(255))
    aktivitas = Column(String(255))
    deadline = Column(Date)
    status = Column(Integer)
    id_akun = Column(Integer, ForeignKey("Akun.id_akun", ondelete="SET NULL"))
    id_campaign = Column(Integer, ForeignKey("Campaign.id_campaign", ondelete="CASCADE"))

    akun = relationship("Akun")
    campaign = relationship("Campaign")