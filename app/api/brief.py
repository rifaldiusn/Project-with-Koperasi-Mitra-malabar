from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.services.deps import get_db, require_marketing
from app.services import crud
from app import schemas

router = APIRouter()

@router.post("/", response_model=schemas.Brief)
def create_brief(
    payload: schemas.BriefCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_marketing),
):
    if payload.id_campaign is not None:
        campaign = crud.campaign.get(db, id=payload.id_campaign)
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
    
    return crud.brief.create(db, obj_in=payload)

@router.get("/", response_model=list[schemas.Brief])
def list_brief(
    db: Session = Depends(get_db),
    _user=Depends(require_marketing),
):
    return crud.brief.get_multi(db)

@router.get("/{id_brief}", response_model=schemas.Brief)
def get_brief(
    id_brief: int,
    db: Session = Depends(get_db),
    _user=Depends(require_marketing),
):
    brief = crud.brief.get(db, id=id_brief)
    if not brief:
        raise HTTPException(status_code=404, detail="Brief not found")
    return brief

@router.put("/{id_brief}", response_model=schemas.Brief)
def update_brief(
    id_brief: int,
    payload: schemas.BriefUpdate,
    db: Session = Depends(get_db),
    _user=Depends(require_marketing),
):
    brief = crud.brief.get(db, id=id_brief)
    if not brief:
        raise HTTPException(status_code=404, detail="Brief not found")
        
    if payload.id_campaign is not None:
        campaign = crud.campaign.get(db, id=payload.id_campaign)
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
            
    return crud.brief.update(db, db_obj=brief, obj_in=payload)

@router.delete("/{id_brief}", response_model=schemas.Brief)
def delete_brief(
    id_brief: int,
    db: Session = Depends(get_db),
    _user=Depends(require_marketing),
):
    brief = crud.brief.get(db, id=id_brief)
    if not brief:
        raise HTTPException(status_code=404, detail="Brief not found")
    return crud.brief.remove(db, id=id_brief)
