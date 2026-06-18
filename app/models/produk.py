from sqlalchemy import Column, Integer, String
from app.db.base import Base

class Produk(Base):
    __tablename__ = "Produk"
    
    id_produk = Column(Integer, primary_key=True, index=True, autoincrement=True)
    kode = Column(String(255), unique=True)
    nama = Column(String(255))
    status = Column(String(100))