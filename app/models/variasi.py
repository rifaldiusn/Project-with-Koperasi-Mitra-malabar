from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Variasi(Base):
    __tablename__ = "Variasi"
    
    id_variasi = Column(Integer, primary_key=True, index=True, autoincrement=True)
    kode = Column(String(255), unique=True)
    nama = Column(String(255))
    harga = Column(Integer)
    status = Column(Integer)
    id_produk = Column(Integer, ForeignKey("Produk.id_produk", ondelete="CASCADE"))

    produk = relationship("Produk")