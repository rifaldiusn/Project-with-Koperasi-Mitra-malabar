from sqlalchemy import Column, Integer, String
from app.db.base import Base

class File(Base):
    __tablename__ = "File"
    
    id_file = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nama = Column(String(255))
    jenis = Column(String(100))
    ukuran = Column(Integer)
    path = Column(String(255))