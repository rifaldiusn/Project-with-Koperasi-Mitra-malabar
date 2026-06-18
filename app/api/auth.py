from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.services.deps import get_db
from app.models.akun import Akun
from app.schemas.token import TokenResponse, LoginRequest
from app.core.security import verify_password, create_access_token

router = APIRouter()

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    akun = db.query(Akun).filter(Akun.username == payload.username).first()
    if not akun or not verify_password(payload.password, akun.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    if akun.role != payload.role:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid role",
        )
    token = create_access_token(subject=str(akun.id_akun))
    return TokenResponse(access_token=token, role=akun.role)