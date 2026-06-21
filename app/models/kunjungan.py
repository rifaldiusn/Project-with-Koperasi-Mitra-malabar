from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date
from sqlalchemy.orm import relationship
import datetime
from app.db.base import Base

class Kunjungan(Base):
    __tablename__ = "Kunjungan"
    
    id_kunjungan = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nama = Column(String(255))
    tanggal = Column(Date, default=datetime.date.today)
    catatan = Column(Text)
    longitude = Column(String(255))
    latitude = Column(String(255))
    id_file = Column(Integer, ForeignKey("File.id_file", ondelete="SET NULL"))
    id_customer = Column(Integer, ForeignKey("Customer.id_customer", ondelete="CASCADE"))

    file = relationship("File")
    customer = relationship("Customer")