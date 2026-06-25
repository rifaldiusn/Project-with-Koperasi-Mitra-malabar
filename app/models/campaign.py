from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Campaign(Base):
    __tablename__ = "Campaign"
    
    id_campaign = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nama = Column(String(255))
    tanggal = Column(Date)
    keterangan = Column(Text)
    budget = Column(Integer)
    batas = Column(Date)
    id_akun = Column(Integer, ForeignKey("Akun.id_akun", ondelete="SET NULL"))

    akun = relationship("Akun")