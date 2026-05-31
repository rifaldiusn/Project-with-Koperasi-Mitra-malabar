from sqlalchemy.orm import Session
from app import models
from app import schemas

class CRUDBase:
    def __init__(self, model):
        self.model = model

    def get(self, db: Session, id: int):
        return db.query(self.model).get(id)

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(self.model).offset(skip).limit(limit).all()

    def create(self, db: Session, obj_in):
        obj_data = obj_in.dict() if hasattr(obj_in, "dict") else obj_in
        db_obj = self.model(**obj_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, db_obj, obj_in):
        update_data = obj_in if isinstance(obj_in, dict) else obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, id: int):
        obj = db.query(self.model).get(id)
        db.delete(obj)
        db.commit()
        return obj

# LEVEL 0
akun = CRUDBase(models.Akun)
produk = CRUDBase(models.Produk)
file = CRUDBase(models.File)
kol = CRUDBase(models.KOL)

# LEVEL 1
variasi = CRUDBase(models.Variasi)
data = CRUDBase(models.Data)
pesan = CRUDBase(models.Pesan)
target = CRUDBase(models.Target)
customer = CRUDBase(models.Customer)
campaign = CRUDBase(models.Campaign)

# LEVEL 2
penjualan = CRUDBase(models.Penjualan)
kunjungan = CRUDBase(models.Kunjungan)
tahapan = CRUDBase(models.Tahapan)
kpi = CRUDBase(models.KPI)
brief = CRUDBase(models.Brief)
dealing = CRUDBase(models.Dealing)