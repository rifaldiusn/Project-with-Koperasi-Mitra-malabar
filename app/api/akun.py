from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_db, require_super_admin
from app.core.security import hash_password
from app.core import crud
from app import models, schemas

router = APIRouter()

@router.post("/", response_model=schemas.Akun)
def create_akun(
    payload: schemas.AkunCreateRequest,
    db: Session = Depends(get_db),
    _super_admin=Depends(require_super_admin),
):
    existing = db.query(models.Akun).filter(models.Akun.username == payload.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    obj_in = schemas.AkunCreate(
        username=payload.username,
        nama=payload.nama,
        telp=payload.telp,
        role=payload.role,
        hashed_password=hash_password(payload.password),
        salt="",
    )
    return crud.akun.create(db, obj_in=obj_in)

@router.get("/", response_model=list[schemas.Akun])
def list_akun(
    db: Session = Depends(get_db),
    _super_admin=Depends(require_super_admin),
):
    return crud.akun.get_multi(db)

@router.get("/{id_akun}", response_model=schemas.Akun)
def get_akun(
    id_akun: int,
    db: Session = Depends(get_db),
    _super_admin=Depends(require_super_admin),
):
    akun = crud.akun.get(db, id=id_akun)
    if not akun:
        raise HTTPException(status_code=404, detail="Akun not found")
    return akun

@router.put("/{id_akun}", response_model=schemas.Akun)
def update_akun(
    id_akun: int,
    payload: schemas.AkunUpdate,
    db: Session = Depends(get_db),
    _super_admin=Depends(require_super_admin),
):
    akun = crud.akun.get(db, id=id_akun)
    if not akun:
        raise HTTPException(status_code=404, detail="Akun not found")

    update_data = payload.model_dump(exclude_unset=True)
    if "password" in update_data:
        update_data["hashed_password"] = hash_password(update_data.pop("password"))
        
    return crud.akun.update(db, db_obj=akun, obj_in=update_data)

@router.delete("/{id_akun}", response_model=schemas.Akun)
def delete_akun(
    id_akun: int,
    db: Session = Depends(get_db),
    _super_admin=Depends(require_super_admin),
):
    akun = crud.akun.get(db, id=id_akun)
    if not akun:
        raise HTTPException(status_code=404, detail="Akun not found")
    return crud.akun.remove(db, id=id_akun)