from datetime import datetime
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from jose import JWTError

from app.db.session import SessionLocal
from app.models.akun import Akun
from app.models.log import Log
from app.core.security import decode_access_token


def _apply_role_scope(q, current_user: Akun):
    if current_user.role == 1:
        return q
    if current_user.role == 2:
        return q.filter(Log.role == 2)
    if current_user.role == 3:
        return q.filter(Log.role == 3)
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="No access to logs",
    )


def write_log(
    *,
    method: str,
    path: str,
    status_code: int,
    id_akun: Optional[int] = None,
    role: Optional[int] = None,
    ip_address: Optional[str] = None,
) -> None:
    db = SessionLocal()
    try:
        entry = Log(
            id_akun=id_akun,
            role=role,
            method=method,
            path=path,
            status_code=status_code,
            ip_address=ip_address,
        )
        db.add(entry)
        db.commit()
    except Exception as exc:
        db.rollback()
        print(f"Failed to write audit log: {exc}")
    finally:
        db.close()


def resolve_user_from_token(authorization: Optional[str]) -> tuple[Optional[int], Optional[int]]:
    if not authorization or not authorization.lower().startswith("bearer "):
        return None, None

    token = authorization[7:]
    db = SessionLocal()
    try:
        user_id = decode_access_token(token)
        user = db.query(Akun).filter(Akun.id_akun == int(user_id)).first()
        if not user:
            return None, None
        return user.id_akun, user.role
    except (JWTError, ValueError, TypeError):
        return None, None
    finally:
        db.close()


def query_logs_scoped(
    db: Session,
    current_user: Akun,
    *,
    skip: int = 0,
    limit: int = 100,
    method: Optional[str] = None,
    id_akun: Optional[int] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
) -> list[Log]:
    q = _apply_role_scope(db.query(Log), current_user)

    if method is not None:
        q = q.filter(Log.method == method.upper())
    if id_akun is not None:
        q = q.filter(Log.id_akun == id_akun)
    if date_from is not None:
        q = q.filter(Log.created_at >= date_from)
    if date_to is not None:
        q = q.filter(Log.created_at <= date_to)

    return q.order_by(Log.created_at.desc()).offset(skip).limit(limit).all()


def get_log_scoped(db: Session, current_user: Akun, id_log: int) -> Log:
    log = db.query(Log).filter(Log.id_log == id_log).first()
    if not log:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Log not found")

    if current_user.role == 1:
        return log
    if current_user.role == 2 and log.role == 2:
        return log
    if current_user.role == 3 and log.role == 3:
        return log

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="No access to this log",
    )
