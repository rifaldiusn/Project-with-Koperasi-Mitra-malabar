from sqlalchemy import Column, Integer, String, Text
from app.db.base import Base

class KOL(Base):
    __tablename__ = "KOL"
    
    id_kol = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nama = Column(String(255))
    kategori = Column(Text)
    rate = Column(Text)