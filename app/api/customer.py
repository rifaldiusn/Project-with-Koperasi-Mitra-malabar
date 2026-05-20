from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_db, require_sales
from app.core import crud
from app import schemas

router = APIRouter()

@router.post("/", response_model=schemas.Customer)
def create_customer(
    payload: schemas.CustomerCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_sales),
):
    data = payload.model_dump()
    data["id_akun"] = current_user.id_akun
    return crud.customer.create(db, obj_in=data)

@router.get("/", response_model=list[schemas.Customer])
def list_customer(
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    return crud.customer.get_multi(db)

@router.get("/{id_customer}", response_model=schemas.Customer)
def get_customer(
    id_customer: int,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    customer = crud.customer.get(db, id=id_customer)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@router.put("/{id_customer}", response_model=schemas.Customer)
def update_customer(
    id_customer: int,
    payload: schemas.CustomerUpdate,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    customer = crud.customer.get(db, id=id_customer)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return crud.customer.update(db, db_obj=customer, obj_in=payload)

@router.delete("/{id_customer}", response_model=schemas.Customer)
def delete_customer(
    id_customer: int,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    customer = crud.customer.get(db, id=id_customer)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return crud.customer.remove(db, id=id_customer)