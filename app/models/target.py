from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Target(Base):
    __tablename__ = "Target"
    
    id_target = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nama = Column(String(255))
    deskripsi = Column(Text)
    id_akun = Column(Integer, ForeignKey("Akun.id_akun", ondelete="SET NULL"))

    akun = relationship("Akun")