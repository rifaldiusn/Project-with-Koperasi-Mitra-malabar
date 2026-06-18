from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.services.deps import get_db, require_marketing
from app.services import crud
from app import schemas

router = APIRouter()

@router.post("/", response_model=schemas.KPI)
def create_kpi(
    payload: schemas.KPICreate,
    db: Session = Depends(get_db),
    _user=Depends(require_marketing),
):
    if payload.id_campaign is not None:
        campaign = crud.campaign.get(db, id=payload.id_campaign)
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
    
    return crud.kpi.create(db, obj_in=payload)

@router.get("/", response_model=list[schemas.KPI])
def list_kpi(
    db: Session = Depends(get_db),
    _user=Depends(require_marketing),
):
    return crud.kpi.get_multi(db)

@router.get("/{id_kpi}", response_model=schemas.KPI)
def get_kpi(
    id_kpi: int,
    db: Session = Depends(get_db),
    _user=Depends(require_marketing),
):
    kpi = crud.kpi.get(db, id=id_kpi)
    if not kpi:
        raise HTTPException(status_code=404, detail="KPI not found")
    return kpi

@router.put("/{id_kpi}", response_model=schemas.KPI)
def update_kpi(
    id_kpi: int,
    payload: schemas.KPIUpdate,
    db: Session = Depends(get_db),
    _user=Depends(require_marketing),
):
    kpi = crud.kpi.get(db, id=id_kpi)
    if not kpi:
        raise HTTPException(status_code=404, detail="KPI not found")
        
    if payload.id_campaign is not None:
        campaign = crud.campaign.get(db, id=payload.id_campaign)
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
            
    return crud.kpi.update(db, db_obj=kpi, obj_in=payload)

@router.delete("/{id_kpi}", response_model=schemas.KPI)
def delete_kpi(
    id_kpi: int,
    db: Session = Depends(get_db),
    _user=Depends(require_marketing),
):
    kpi = crud.kpi.get(db, id=id_kpi)
    if not kpi:
        raise HTTPException(status_code=404, detail="KPI not found")
    return crud.kpi.remove(db, id=id_kpi)
