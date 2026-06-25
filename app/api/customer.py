from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.services.deps import get_db, require_sales
from app.services import crud
from app import schemas

from typing import Optional
from sqlalchemy import or_
from app import models

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

@router.get("/search", response_model=list[schemas.Customer])
def search_customer(
    q: str,
    db: Session = Depends(get_db),
    _user=Depends(require_sales),
):
    query = f"%{q}%"
    customers = db.query(models.Customer).filter(
        or_(
            models.Customer.nama.ilike(query),
            models.Customer.telp.ilike(query),
            models.Customer.email.ilike(query)
        )
    ).all()
    return customers

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