from sqlalchemy import Column, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Penjualan(Base):
    __tablename__ = "Penjualan"
    
    id_penjualan = Column(Integer, primary_key=True, index=True, autoincrement=True)
    periode = Column(Date)
    nominal = Column(Integer)
    jenis = Column(Integer)
    id_variasi = Column(Integer, ForeignKey("Variasi.id_variasi", ondelete="CASCADE"))

    variasi = relationship("Variasi")