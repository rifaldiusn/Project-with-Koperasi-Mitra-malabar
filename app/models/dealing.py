from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Dealing(Base):
    __tablename__ = "Dealing"
    
    id_dealing = Column(Integer, primary_key=True, index=True, autoincrement=True)
    budget_produk = Column(Integer)
    kode_voucher = Column(String(255))
    lampiran = Column(Text)
    id_campaign = Column(Integer, ForeignKey("Campaign.id_campaign", ondelete="CASCADE"))
    id_file = Column(Integer, ForeignKey("File.id_file", ondelete="SET NULL"))
    id_kol = Column(Integer, ForeignKey("KOL.id_kol", ondelete="CASCADE"))

    campaign = relationship("Campaign")
    file = relationship("File")
    kol = relationship("KOL")