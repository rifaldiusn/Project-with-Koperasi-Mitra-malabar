import os
from dotenv import load_dotenv

from app.db.session import SessionLocal, engine
from app.db.base import Base
import app.models  # Register all models with Base
from app.models.akun import Akun
from app.core.security import hash_password

def seed_super_admin() -> None:
    load_dotenv()

    # Create all tables if they don't exist
    Base.metadata.create_all(bind=engine)

    username = os.getenv("SUPER_ADMIN_USERNAME")
    password = os.getenv("SUPER_ADMIN_PASSWORD")
    nama = os.getenv("SUPER_ADMIN_NAME", "Super Admin")
    telp = os.getenv("SUPER_ADMIN_TELP")
    role = int(os.getenv("SUPER_ADMIN_ROLE", "1"))

    if not username or not password:
        raise RuntimeError("SUPER_ADMIN_USERNAME or SUPER_ADMIN_PASSWORD is missing.")
    
    db = SessionLocal()
    try:
        existing = db.query(Akun).filter(Akun.username == username).first()
        if existing:
            print("Super admin already exists.")
            return

        hashed = hash_password(password)
        akun = Akun(
            username=username,
            nama=nama,
            telp=telp,
            role=role,
            hashed_password=hashed,
            salt=""
        )
        db.add(akun)
        db.commit()
        print("Super admin created.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_super_admin()