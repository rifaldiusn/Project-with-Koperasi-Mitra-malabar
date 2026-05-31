from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.services.deps import get_db, require_marketing, require_super_admin
from app.services import crud
from app import schemas

router = APIRouter()

@router.post("/", response_model=schemas.Campaign)
def create_campaign(
    payload: schemas.CampaignCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_marketing),
):
    data = payload.model_dump()
    data["id_akun"] = current_user.id_akun
    return crud.campaign.create(db, obj_in=data)

@router.get("/", response_model=list[schemas.Campaign])
def list_campaign(
    db: Session = Depends(get_db),
    _user=Depends(require_marketing),
):
    return crud.campaign.get_multi(db)

@router.get("/{id_campaign}", response_model=schemas.Campaign)
def get_campaign(
    id_campaign: int,
    db: Session = Depends(get_db),
    _user=Depends(require_marketing),
):
    campaign = crud.campaign.get(db, id=id_campaign)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

@router.put("/{id_campaign}", response_model=schemas.Campaign)
def update_campaign(
    id_campaign: int,
    payload: schemas.CampaignUpdate,
    db: Session = Depends(get_db),
    _user=Depends(require_marketing),
):
    campaign = crud.campaign.get(db, id=id_campaign)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return crud.campaign.update(db, db_obj=campaign, obj_in=payload)

@router.delete("/{id_campaign}", response_model=schemas.Campaign)
def delete_campaign(
    id_campaign: int,
    db: Session = Depends(get_db),
    _user=Depends(require_super_admin),
):
    campaign = crud.campaign.get(db, id=id_campaign)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return crud.campaign.remove(db, id=id_campaign)
