from sqlalchemy import Column, Integer, String, Text
from app.db.base import Base

class Akun(Base):
    __tablename__ = "Akun"
    
    id_akun = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(255), unique=True)
    nama = Column(String(255))
    telp = Column(String(50))
    role = Column(Integer)
    hashed_password = Column(Text)
    salt = Column(Text)