from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Token(Base):
    __tablename__ = "Token"
    
    id_token = Column(Integer, primary_key=True, index=True, autoincrement=True)
    token = Column(Text)
    id_akun = Column(Integer, ForeignKey("Akun.id_akun", ondelete="CASCADE"))

    akun = relationship("Akun")