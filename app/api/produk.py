from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.services.deps import get_db, require_sales
from app.services import crud, excel_import
from app import models, schemas

router = APIRouter()

@router.post("/", response_model=schemas.Produk)
def create_produk(
    payload: schemas.ProdukCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    existing = db.query(models.Produk).filter(models.Produk.kode == payload.kode).first()
    if existing:
        raise HTTPException(status_code=400, detail="Product code already exists")
    
    return crud.produk.create(db, obj_in=payload)

@router.get("/", response_model=list[schemas.Produk])
def list_produk(
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    return crud.produk.get_multi(db)

@router.get("/{id_produk}", response_model=schemas.Produk)
def get_produk(
    id_produk: int,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    produk = crud.produk.get(db, id=id_produk)
    if not produk:
        raise HTTPException(status_code=404, detail="Product not found")
    return produk

@router.put("/{id_produk}", response_model=schemas.Produk)
def update_produk(
    id_produk: int,
    payload: schemas.ProdukUpdate,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    produk = crud.produk.get(db, id=id_produk)
    if not produk:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if payload.kode is not None and payload.kode != produk.kode:
        existing = db.query(models.Produk).filter(models.Produk.kode == payload.kode).first()
        if existing:
            raise HTTPException(status_code=400, detail="Product code already exists")
            
    return crud.produk.update(db, db_obj=produk, obj_in=payload)

@router.delete("/{id_produk}", response_model=schemas.Produk)
def delete_produk(
    id_produk: int,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    produk = crud.produk.get(db, id=id_produk)
    if not produk:
        raise HTTPException(status_code=404, detail="Product not found")
    return crud.produk.remove(db, id=id_produk)


@router.post("/import-excel")
def import_excel(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    """
    Import data Produk dan Variasi dari file Excel.
    Format Excel sesuai file: parentskudetail.20260604_20260604.xlsx
    Kolom yang dibutuhkan: Kode Produk, Produk, Status Produk Saat Ini, Kode Variasi, Nama Variasi, Status Variasi Saat Ini
    """
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="File harus berformat .xlsx atau .xls")
    
    df = excel_import.read_excel_file(file)
    results = excel_import.import_from_excel(db, df)
    
    return results
