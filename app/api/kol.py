from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.services.deps import get_db, require_marketing
from app.services import crud
from app import schemas

router = APIRouter()

@router.post("/", response_model=schemas.KOL)
def create_kol(
    payload: schemas.KOLCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_marketing),
):
    return crud.kol.create(db, obj_in=payload)

@router.get("/", response_model=list[schemas.KOL])
def list_kol(
    db: Session = Depends(get_db),
    _user=Depends(require_marketing),
):
    return crud.kol.get_multi(db)

@router.get("/{id_kol}", response_model=schemas.KOL)
def get_kol(
    id_kol: int,
    db: Session = Depends(get_db),
    _user=Depends(require_marketing),
):
    kol = crud.kol.get(db, id=id_kol)
    if not kol:
        raise HTTPException(status_code=404, detail="KOL not found")
    return kol

@router.put("/{id_kol}", response_model=schemas.KOL)
def update_kol(
    id_kol: int,
    payload: schemas.KOLUpdate,
    db: Session = Depends(get_db),
    _user=Depends(require_marketing),
):
    kol = crud.kol.get(db, id=id_kol)
    if not kol:
        raise HTTPException(status_code=404, detail="KOL not found")
    return crud.kol.update(db, db_obj=kol, obj_in=payload)

@router.delete("/{id_kol}", response_model=schemas.KOL)
def delete_kol(
    id_kol: int,
    db: Session = Depends(get_db),
    _user=Depends(require_marketing),
):
    kol = crud.kol.get(db, id=id_kol)
    if not kol:
        raise HTTPException(status_code=404, detail="KOL not found")
    return crud.kol.remove(db, id=id_kol)
