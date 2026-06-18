from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.services.deps import get_db, require_sales
from app.services import crud
from app import schemas, models

router = APIRouter()

@router.post("/", response_model=schemas.Tahapan)
def create_tahapan(
    payload: schemas.TahapanCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    # Verify Akun exists for the provided username
    akun = db.query(models.Akun).filter(models.Akun.username == payload.username).first()
    if not akun:
        raise HTTPException(status_code=404, detail="Akun with the specified username not found")

    # Verify Campaign exists for the provided id_campaign
    campaign = crud.campaign.get(db, id=payload.id_campaign)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    # Prepare data for insertion
    data = payload.model_dump(exclude={"username"})
    data["id_akun"] = akun.id_akun

    return crud.tahapan.create(db, obj_in=data)

@router.get("/", response_model=list[schemas.Tahapan])
def list_tahapan(
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    return crud.tahapan.get_multi(db)

@router.get("/{id_tahapan}", response_model=schemas.Tahapan)
def get_tahapan(
    id_tahapan: int,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    tahapan = crud.tahapan.get(db, id=id_tahapan)
    if not tahapan:
        raise HTTPException(status_code=404, detail="Tahapan not found")
    return tahapan

@router.put("/{id_tahapan}", response_model=schemas.Tahapan)
def update_tahapan(
    id_tahapan: int,
    payload: schemas.TahapanUpdate,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    tahapan = crud.tahapan.get(db, id=id_tahapan)
    if not tahapan:
        raise HTTPException(status_code=404, detail="Tahapan not found")

    update_data = payload.model_dump(exclude_unset=True)

    # If username is provided, resolve and update id_akun
    if "username" in update_data:
        username = update_data.pop("username")
        if username is not None:
            akun = db.query(models.Akun).filter(models.Akun.username == username).first()
            if not akun:
                raise HTTPException(status_code=404, detail="Akun with the specified username not found")
            update_data["id_akun"] = akun.id_akun
        else:
            update_data["id_akun"] = None

    # If id_campaign is provided, verify it exists
    if "id_campaign" in update_data and update_data["id_campaign"] is not None:
        campaign = crud.campaign.get(db, id=update_data["id_campaign"])
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")

    return crud.tahapan.update(db, db_obj=tahapan, obj_in=update_data)

@router.delete("/{id_tahapan}", response_model=schemas.Tahapan)
def delete_tahapan(
    id_tahapan: int,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    tahapan = crud.tahapan.get(db, id=id_tahapan)
    if not tahapan:
        raise HTTPException(status_code=404, detail="Tahapan not found")
    return crud.tahapan.remove(db, id=id_tahapan)
