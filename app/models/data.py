from sqlalchemy import Column, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Data(Base):
    __tablename__ = "Data"
    
    id_data = Column(Integer, primary_key=True, index=True, autoincrement=True)
    periode = Column(Date)
    dilihat = Column(Integer)
    diklik = Column(Integer)
    suka = Column(Integer)
    keranjang = Column(Integer)
    id_produk = Column(Integer, ForeignKey("Produk.id_produk", ondelete="CASCADE"))

    produk = relationship("Produk")