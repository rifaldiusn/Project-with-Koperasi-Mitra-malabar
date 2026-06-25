from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services.deps import get_db, require_sales
from app.services import crud
from app import schemas

router = APIRouter()
@router.post("/", response_model=schemas.Target)
def create_target(payload: schemas.TargetCreate, db: Session = Depends(get_db), current_user=Depends(require_sales)):
    data = payload.model_dump()
    data["id_akun"] = current_user.id_akun
    return crud.target.create(db, obj_in=data)

@router.get("/", response_model=list[schemas.Target])
def list_target(db: Session = Depends(get_db), _user=Depends(require_sales)):
    return crud.target.get_multi(db)

@router.get("/{id_target}", response_model=schemas.Target)
def get_target(id_target: int, db: Session = Depends(get_db), _user=Depends(require_sales)):
    target = crud.target.get(db, id=id_target)
    if not target: raise HTTPException(404, "Target not found")
    return target

@router.put("/{id_target}", response_model=schemas.Target)
def update_target(id_target: int, payload: schemas.TargetUpdate, db: Session = Depends(get_db), _user=Depends(require_sales)):
    target = crud.target.get(db, id=id_target)
    if not target: raise HTTPException(404, "Target not found")
    return crud.target.update(db, db_obj=target, obj_in=payload)

@router.delete("/{id_target}", response_model=schemas.Target)
def delete_target(id_target: int, db: Session = Depends(get_db), _user=Depends(require_sales)):
    target = crud.target.get(db, id=id_target)
    if not target: raise HTTPException(404, "Target not found")
    return crud.target.remove(db, id=id_target)
