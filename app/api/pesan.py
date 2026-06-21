from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.services.deps import get_db, require_sales
from app.services import crud
from app import models, schemas

router = APIRouter()

@router.post("/", response_model=schemas.Pesan)
def create_pesan(
    payload: schemas.PesanCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    if payload.id_produk is not None:
        produk = db.query(models.Produk).filter(models.Produk.id_produk == payload.id_produk).first()
        if not produk:
            raise HTTPException(status_code=404, detail="Product not found")
            
    return crud.pesan.create(db, obj_in=payload)

@router.get("/", response_model=list[schemas.Pesan])
def list_pesan(
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    return crud.pesan.get_multi(db)

@router.get("/{id_pesan}", response_model=schemas.Pesan)
def get_pesan(
    id_pesan: int,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    pesan = crud.pesan.get(db, id=id_pesan)
    if not pesan:
        raise HTTPException(status_code=404, detail="Pesan not found")
    return pesan

@router.put("/{id_pesan}", response_model=schemas.Pesan)
def update_pesan(
    id_pesan: int,
    payload: schemas.PesanUpdate,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    pesan = crud.pesan.get(db, id=id_pesan)
    if not pesan:
        raise HTTPException(status_code=404, detail="Pesan not found")
            
    if payload.id_produk is not None and payload.id_produk != pesan.id_produk:
        produk = db.query(models.Produk).filter(models.Produk.id_produk == payload.id_produk).first()
        if not produk:
            raise HTTPException(status_code=404, detail="Product not found")
            
    return crud.pesan.update(db, db_obj=pesan, obj_in=payload)

@router.delete("/{id_pesan}", response_model=schemas.Pesan)
def delete_pesan(
    id_pesan: int,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    pesan = crud.pesan.get(db, id=id_pesan)
    if not pesan:
        raise HTTPException(status_code=404, detail="Pesan not found")
    return crud.pesan.remove(db, id=id_pesan)
