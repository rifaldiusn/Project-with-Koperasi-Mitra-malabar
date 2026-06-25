from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import Optional
import os

from app.services.deps import get_db, require_sales
from app.services import crud
from app import schemas, models
from app.services.file import save_and_create_file, delete_file_record

router = APIRouter()

@router.post("/", response_model=schemas.Kunjungan)
def create_kunjungan(
    nama: str = Form(...),
    catatan: Optional[str] = Form(None),
    longitude: str = Form(...),
    latitude: str = Form(...),
    id_customer: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    customer = crud.customer.get(db, id=id_customer)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    folder_id = os.getenv("GDRIVE_FOLDER_ID_KUNJUNGAN")
    db_file = save_and_create_file(db, file, folder_id)

    kunjungan_in = schemas.KunjunganCreate(
        nama=nama,
        catatan=catatan,
        longitude=longitude,
        latitude=latitude,
        id_file=db_file.id_file,
        id_customer=id_customer
    )
    kunjungan = crud.kunjungan.create(db, obj_in=kunjungan_in)
    
    return kunjungan

@router.get("/", response_model=list[schemas.Kunjungan])
def list_kunjungan(
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    return crud.kunjungan.get_multi(db)

from sqlalchemy import func, extract

@router.get("/chart/data")
def get_kunjungan_chart_data(year: int, start_month: int = 1, end_month: int = 12, db: Session = Depends(get_db)):
    res = db.query(
        extract('month', models.Kunjungan.tanggal).label('bulan'),
        func.count(models.Kunjungan.id_kunjungan).label("total_kunjungan")
    ).filter(
        extract('year', models.Kunjungan.tanggal) == year,
        extract('month', models.Kunjungan.tanggal) >= start_month,
        extract('month', models.Kunjungan.tanggal) <= end_month
    ).group_by('bulan').order_by('bulan').all()
    
    return [{"bulan": int(r.bulan), "total_kunjungan": int(r.total_kunjungan or 0)} for r in res]

from sqlalchemy import or_
from datetime import date

@router.get("/search", response_model=list[schemas.Kunjungan])
def search_kunjungan(
    q: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    query = db.query(models.Kunjungan).outerjoin(models.Customer)
    
    if q:
        search_term = f"%{q}%"
        query = query.filter(
            or_(
                models.Kunjungan.nama.ilike(search_term),
                models.Customer.nama.ilike(search_term)
            )
        )
        
    if start_date:
        query = query.filter(models.Kunjungan.tanggal >= start_date)
        
    if end_date:
        query = query.filter(models.Kunjungan.tanggal <= end_date)
        
    return query.all()

@router.get("/{id_kunjungan}", response_model=schemas.Kunjungan)
def get_kunjungan(
    id_kunjungan: int,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    kunjungan = crud.kunjungan.get(db, id=id_kunjungan)
    if not kunjungan:
        raise HTTPException(status_code=404, detail="Kunjungan not found")
    return kunjungan

@router.put("/{id_kunjungan}", response_model=schemas.Kunjungan)
def update_kunjungan(
    id_kunjungan: int,
    nama: Optional[str] = Form(None),
    catatan: Optional[str] = Form(None),
    longitude: Optional[str] = Form(None),
    latitude: Optional[str] = Form(None),
    id_customer: Optional[int] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    kunjungan = crud.kunjungan.get(db, id=id_kunjungan)
    if not kunjungan:
        raise HTTPException(status_code=404, detail="Kunjungan not found")

    update_data = {}
    if nama is not None:
        update_data["nama"] = nama
    if catatan is not None:
        update_data["catatan"] = catatan
    if longitude is not None:
        update_data["longitude"] = longitude
    if latitude is not None:
        update_data["latitude"] = latitude
    if id_customer is not None:
        customer = crud.customer.get(db, id=id_customer)
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        update_data["id_customer"] = id_customer

    old_file_id = None
    if file is not None:
        folder_id = os.getenv("GDRIVE_FOLDER_ID_KUNJUNGAN")
        db_file = save_and_create_file(db, file, folder_id)
        
        old_file_id = kunjungan.id_file
        update_data["id_file"] = db_file.id_file

    updated_kunjungan = crud.kunjungan.update(db, db_obj=kunjungan, obj_in=update_data)

    if old_file_id is not None:
        delete_file_record(db, old_file_id)

    return updated_kunjungan

@router.delete("/{id_kunjungan}", response_model=schemas.Kunjungan)
def delete_kunjungan(
    id_kunjungan: int,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    kunjungan = crud.kunjungan.get(db, id=id_kunjungan)
    if not kunjungan:
        raise HTTPException(status_code=404, detail="Kunjungan not found")

    old_file_id = kunjungan.id_file

    removed_kunjungan = crud.kunjungan.remove(db, id=id_kunjungan)

    if old_file_id is not None:
        delete_file_record(db, old_file_id)

    return removed_kunjungan

