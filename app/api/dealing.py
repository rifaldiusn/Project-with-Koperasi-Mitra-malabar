from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile
from sqlalchemy.orm import Session
from typing import Optional

from app.services.deps import get_db, require_sales
from app.services import crud
from app import schemas, models
from app.services.file import save_and_create_file, delete_file_record

router = APIRouter()

@router.post("/", response_model=schemas.Dealing)
def create_dealing(
    budget_produk: int = Form(...),
    kode_voucher: Optional[str] = Form(None),
    lampiran: Optional[str] = Form(None),
    id_campaign: int = Form(...),
    id_kol: int = Form(...),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    # Verify Campaign exists
    campaign = crud.campaign.get(db, id=id_campaign)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    # Verify KOL exists
    kol = crud.kol.get(db, id=id_kol)
    if not kol:
        raise HTTPException(status_code=404, detail="KOL not found")

    # Save physical file if provided
    db_file = None
    if file is not None:
        db_file = save_and_create_file(db, file)

    dealing_in = schemas.DealingCreate(
        budget_produk=budget_produk,
        kode_voucher=kode_voucher,
        lampiran=lampiran,
        id_campaign=id_campaign,
        id_file=db_file.id_file if db_file else None,
        id_kol=id_kol
    )
    return crud.dealing.create(db, obj_in=dealing_in)

@router.get("/", response_model=list[schemas.Dealing])
def list_dealing(
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    return crud.dealing.get_multi(db)

@router.get("/{id_dealing}", response_model=schemas.Dealing)
def get_dealing(
    id_dealing: int,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    dealing = crud.dealing.get(db, id=id_dealing)
    if not dealing:
        raise HTTPException(status_code=404, detail="Dealing not found")
    return dealing

@router.put("/{id_dealing}", response_model=schemas.Dealing)
def update_dealing(
    id_dealing: int,
    budget_produk: Optional[int] = Form(None),
    kode_voucher: Optional[str] = Form(None),
    lampiran: Optional[str] = Form(None),
    id_campaign: Optional[int] = Form(None),
    id_kol: Optional[int] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    dealing = crud.dealing.get(db, id=id_dealing)
    if not dealing:
        raise HTTPException(status_code=404, detail="Dealing not found")

    update_data = {}
    if budget_produk is not None:
        update_data["budget_produk"] = budget_produk
    if kode_voucher is not None:
        update_data["kode_voucher"] = kode_voucher
    if lampiran is not None:
        update_data["lampiran"] = lampiran

    if id_campaign is not None:
        campaign = crud.campaign.get(db, id=id_campaign)
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
        update_data["id_campaign"] = id_campaign

    if id_kol is not None:
        kol = crud.kol.get(db, id=id_kol)
        if not kol:
            raise HTTPException(status_code=404, detail="KOL not found")
        update_data["id_kol"] = id_kol

    old_file_id = None
    if file is not None:
        # Save physical file and create File record
        db_file = save_and_create_file(db, file)
        old_file_id = dealing.id_file
        update_data["id_file"] = db_file.id_file

    updated_dealing = crud.dealing.update(db, db_obj=dealing, obj_in=update_data)

    if old_file_id is not None:
        delete_file_record(db, old_file_id)

    return updated_dealing

@router.delete("/{id_dealing}", response_model=schemas.Dealing)
def delete_dealing(
    id_dealing: int,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    dealing = crud.dealing.get(db, id=id_dealing)
    if not dealing:
        raise HTTPException(status_code=404, detail="Dealing not found")

    old_file_id = dealing.id_file

    removed_dealing = crud.dealing.remove(db, id=id_dealing)

    if old_file_id is not None:
        delete_file_record(db, old_file_id)

    return removed_dealing
