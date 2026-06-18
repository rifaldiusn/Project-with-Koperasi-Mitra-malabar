from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Customer(Base):
    __tablename__ = "Customer"
    
    id_customer = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nama = Column(String(255))
    alamat = Column(Text)
    email = Column(String(255))
    telp = Column(String(50))
    jenis = Column(String(100))
    id_akun = Column(Integer, ForeignKey("Akun.id_akun", ondelete="SET NULL"))

    akun = relationship("Akun")