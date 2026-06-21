from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.services.deps import get_db, require_sales
from app.services import crud
from app import models, schemas

router = APIRouter()

@router.post("/", response_model=schemas.Data)
def create_data(
    payload: schemas.DataCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    if payload.id_produk is not None:
        produk = db.query(models.Produk).filter(models.Produk.id_produk == payload.id_produk).first()
        if not produk:
            raise HTTPException(status_code=404, detail="Product not found")
            
    return crud.data.create(db, obj_in=payload)

@router.get("/", response_model=list[schemas.Data])
def list_data(
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    return crud.data.get_multi(db)

from sqlalchemy import func, extract

@router.get("/chart/produk/{id_produk}")
def get_data_chart_produk(id_produk: int, year: int, start_month: int = 1, end_month: int = 12, db: Session = Depends(get_db)):
    res = db.query(
        extract('month', models.Data.periode).label('bulan'),
        func.sum(models.Data.suka).label("suka"),
        func.sum(models.Data.keranjang).label("keranjang"),
        func.sum(models.Data.diklik).label("diklik"),
        func.sum(models.Data.dilihat).label("dilihat")
    ).filter(
        models.Data.id_produk == id_produk,
        extract('year', models.Data.periode) == year,
        extract('month', models.Data.periode) >= start_month,
        extract('month', models.Data.periode) <= end_month
    ).group_by('bulan').order_by('bulan').all()
    
    return [{"bulan": int(r.bulan), "suka": int(r.suka or 0), "keranjang": int(r.keranjang or 0), "diklik": int(r.diklik or 0), "dilihat": int(r.dilihat or 0)} for r in res]

@router.get("/{id_data}", response_model=schemas.Data)
def get_data(
    id_data: int,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    data = crud.data.get(db, id=id_data)
    if not data:
        raise HTTPException(status_code=404, detail="Data not found")
    return data

@router.put("/{id_data}", response_model=schemas.Data)
def update_data(
    id_data: int,
    payload: schemas.DataUpdate,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    data = crud.data.get(db, id=id_data)
    if not data:
        raise HTTPException(status_code=404, detail="Data not found")
            
    if payload.id_produk is not None and payload.id_produk != data.id_produk:
        produk = db.query(models.Produk).filter(models.Produk.id_produk == payload.id_produk).first()
        if not produk:
            raise HTTPException(status_code=404, detail="Product not found")
            
    return crud.data.update(db, db_obj=data, obj_in=payload)

@router.delete("/{id_data}", response_model=schemas.Data)
def delete_data(
    id_data: int,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    data = crud.data.get(db, id=id_data)
    if not data:
        raise HTTPException(status_code=404, detail="Data not found")
    return crud.data.remove(db, id=id_data)
