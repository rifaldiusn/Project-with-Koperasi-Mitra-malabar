from sqlalchemy import Column, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Pesan(Base):
    __tablename__ = "Pesan"
    
    id_pesan = Column(Integer, primary_key=True, index=True, autoincrement=True)
    periode = Column(Date)
    dibuat = Column(Integer)
    dikirim = Column(Integer)
    id_produk = Column(Integer, ForeignKey("Produk.id_produk", ondelete="CASCADE"))

    produk = relationship("Produk")