from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.services.deps import get_db, require_sales
from app.services import crud
from app import models, schemas

router = APIRouter()

@router.post("/", response_model=schemas.Penjualan)
def create_penjualan(
    payload: schemas.PenjualanCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    # Verify manually chosen id_variasi exists
    if payload.id_variasi is not None:
        variasi = db.query(models.Variasi).filter(models.Variasi.id_variasi == payload.id_variasi).first()
        if not variasi:
            raise HTTPException(status_code=404, detail="Variation not found")
            
    return crud.penjualan.create(db, obj_in=payload)

@router.get("/", response_model=list[schemas.Penjualan])
def list_penjualan(
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    return crud.penjualan.get_multi(db)

@router.get("/{id_penjualan}", response_model=schemas.Penjualan)
def get_penjualan(
    id_penjualan: int,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    penjualan = crud.penjualan.get(db, id=id_penjualan)
    if not penjualan:
        raise HTTPException(status_code=404, detail="Penjualan not found")
    return penjualan

@router.put("/{id_penjualan}", response_model=schemas.Penjualan)
def update_penjualan(
    id_penjualan: int,
    payload: schemas.PenjualanUpdate,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    penjualan = crud.penjualan.get(db, id=id_penjualan)
    if not penjualan:
        raise HTTPException(status_code=404, detail="Penjualan not found")
            
    # Verify manually chosen id_variasi exists if updated
    if payload.id_variasi is not None and payload.id_variasi != penjualan.id_variasi:
        variasi = db.query(models.Variasi).filter(models.Variasi.id_variasi == payload.id_variasi).first()
        if not variasi:
            raise HTTPException(status_code=404, detail="Variation not found")
            
    return crud.penjualan.update(db, db_obj=penjualan, obj_in=payload)

@router.delete("/{id_penjualan}", response_model=schemas.Penjualan)
def delete_penjualan(
    id_penjualan: int,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    penjualan = crud.penjualan.get(db, id=id_penjualan)
    if not penjualan:
        raise HTTPException(status_code=404, detail="Penjualan not found")
    return crud.penjualan.remove(db, id=id_penjualan)
