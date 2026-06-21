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

from sqlalchemy import func, extract

@router.get("/chart/data")
def get_penjualan_chart_data(year: int, start_month: int = 1, end_month: int = 12, db: Session = Depends(get_db)):
    # ponytail: ultra minimal group by month with range
    res = db.query(
        extract('month', models.Penjualan.periode).label('bulan'),
        func.sum(models.Penjualan.nominal).label('total_nominal')
    ).filter(
        extract('year', models.Penjualan.periode) == year,
        extract('month', models.Penjualan.periode) >= start_month,
        extract('month', models.Penjualan.periode) <= end_month
    ).group_by('bulan').order_by('bulan').all()
    
    return [{"bulan": int(r.bulan), "total_nominal": int(r.total_nominal or 0)} for r in res]

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
