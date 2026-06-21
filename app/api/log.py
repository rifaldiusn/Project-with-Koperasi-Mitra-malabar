from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.services.deps import get_db, require_log_viewer
from app.services import audit
from app import schemas

router = APIRouter()


@router.get("/", response_model=list[schemas.Log])
def list_log(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    method: Optional[str] = Query(None),
    id_akun: Optional[int] = Query(None),
    date_from: Optional[datetime] = Query(None),
    date_to: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(require_log_viewer),
):
    return audit.query_logs_scoped(
        db,
        current_user,
        skip=skip,
        limit=limit,
        method=method,
        id_akun=id_akun,
        date_from=date_from,
        date_to=date_to,
    )


@router.get("/{id_log}", response_model=schemas.Log)
def get_log(
    id_log: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_log_viewer),
):
    return audit.get_log_scoped(db, current_user, id_log)
