from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
import os
import uuid
import shutil
from typing import Optional

from app.core.deps import get_db, require_sales
from app.core import crud
from app import schemas, models

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
    # Verify customer exists
    customer = crud.customer.get(db, id=id_customer)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Save physical file securely
    uploads_dir = "uploads"
    os.makedirs(uploads_dir, exist_ok=True)
    
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    filepath = os.path.join(uploads_dir, unique_filename).replace("\\", "/")
    
    try:
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    file_size = os.path.getsize(filepath)
    
    # Create File record
    file_in = schemas.FileCreate(
        nama=file.filename,
        jenis=file.content_type,
        ukuran=file_size,
        path=filepath
    )
    db_file = crud.file.create(db, obj_in=file_in)

    # Create Kunjungan record linked to File
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
        uploads_dir = "uploads"
        os.makedirs(uploads_dir, exist_ok=True)
        
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        filepath = os.path.join(uploads_dir, unique_filename).replace("\\", "/")
        
        try:
            with open(filepath, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

        file_size = os.path.getsize(filepath)
        
        file_in = schemas.FileCreate(
            nama=file.filename,
            jenis=file.content_type,
            ukuran=file_size,
            path=filepath
        )
        db_file = crud.file.create(db, obj_in=file_in)
        
        old_file_id = kunjungan.id_file
        update_data["id_file"] = db_file.id_file

    updated_kunjungan = crud.kunjungan.update(db, db_obj=kunjungan, obj_in=update_data)

    if old_file_id is not None:
        old_file = crud.file.get(db, id=old_file_id)
        if old_file:
            try:
                if old_file.path and os.path.exists(old_file.path):
                    os.remove(old_file.path)
            except Exception:
                pass
            crud.file.remove(db, id=old_file_id)

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
        old_file = crud.file.get(db, id=old_file_id)
        if old_file:
            try:
                if old_file.path and os.path.exists(old_file.path):
                    os.remove(old_file.path)
            except Exception:
                pass
            crud.file.remove(db, id=old_file_id)

    return removed_kunjungan

