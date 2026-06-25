from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.services.deps import get_db, require_log_viewer
from app.services import crud
from app import models, schemas

router = APIRouter()

@router.post("/", response_model=schemas.Variasi)
def create_variasi(
    payload: schemas.VariasiCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_log_viewer),
):
    existing = db.query(models.Variasi).filter(models.Variasi.kode == payload.kode).first()
    if existing:
        raise HTTPException(status_code=400, detail="Variation code already exists")

    if payload.id_produk is not None:
        produk = db.query(models.Produk).filter(models.Produk.id_produk == payload.id_produk).first()
        if not produk:
            raise HTTPException(status_code=404, detail="Product not found")
            
    return crud.variasi.create(db, obj_in=payload)

@router.get("/", response_model=list[schemas.Variasi])
def list_variasi(
    db: Session = Depends(get_db),
    _user=Depends(require_log_viewer),
):
    return crud.variasi.get_multi(db)

@router.get("/{id_variasi}", response_model=schemas.Variasi)
def get_variasi(
    id_variasi: int,
    db: Session = Depends(get_db),
    _user=Depends(require_log_viewer),
):
    variasi = crud.variasi.get(db, id=id_variasi)
    if not variasi:
        raise HTTPException(status_code=404, detail="Variation not found")
    return variasi

@router.put("/{id_variasi}", response_model=schemas.Variasi)
def update_variasi(
    id_variasi: int,
    payload: schemas.VariasiUpdate,
    db: Session = Depends(get_db),
    _user=Depends(require_log_viewer),
):
    variasi = crud.variasi.get(db, id=id_variasi)
    if not variasi:
        raise HTTPException(status_code=404, detail="Variation not found")
    
    if payload.kode is not None and payload.kode != variasi.kode:
        existing = db.query(models.Variasi).filter(models.Variasi.kode == payload.kode).first()
        if existing:
            raise HTTPException(status_code=400, detail="Variation code already exists")
            
    if payload.id_produk is not None and payload.id_produk != variasi.id_produk:
        produk = db.query(models.Produk).filter(models.Produk.id_produk == payload.id_produk).first()
        if not produk:
            raise HTTPException(status_code=404, detail="Product not found")
            
    return crud.variasi.update(db, db_obj=variasi, obj_in=payload)

@router.delete("/{id_variasi}", response_model=schemas.Variasi)
def delete_variasi(
    id_variasi: int,
    db: Session = Depends(get_db),
    _user=Depends(require_log_viewer),
):
    variasi = crud.variasi.get(db, id=id_variasi)
    if not variasi:
        raise HTTPException(status_code=404, detail="Variation not found")
    return crud.variasi.remove(db, id=id_variasi)
