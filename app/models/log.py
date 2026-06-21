from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.base import Base


class Log(Base):
    __tablename__ = "Log"

    id_log = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_akun = Column(Integer, ForeignKey("Akun.id_akun", ondelete="SET NULL"), nullable=True)
    role = Column(Integer, nullable=True)
    method = Column(String(10))
    path = Column(String(500))
    status_code = Column(Integer)
    ip_address = Column(String(45))
    created_at = Column(DateTime, server_default=func.now())

    akun = relationship("Akun")
