from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from jose import JWTError
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.services.deps import get_db
from app.models.akun import Akun
from app.models.token import Token
from app.schemas.token import TokenResponse, LoginRequest, RefreshRequest
from app.core.security import verify_password, create_access_token, create_refresh_token, decode_refresh_token

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()

@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
def login(request: Request, payload: LoginRequest, db: Session = Depends(get_db)):
    akun = db.query(Akun).filter(Akun.username == payload.username).first()
    if not akun or not verify_password(payload.password, akun.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    
    access_token = create_access_token(subject=str(akun.id_akun))

    db.query(Token).filter(Token.id_akun == akun.id_akun).delete()
    refresh_token = create_refresh_token(subject=str(akun.id_akun))
    db_token = Token(token=refresh_token, id_akun=akun.id_akun)
    db.add(db_token)
    db.commit()
    
    return TokenResponse(
        access_token=access_token, 
        refresh_token=refresh_token, 
        role=akun.role
    )

@router.post("/refresh", response_model=TokenResponse)
@limiter.limit("15/minute")
def refresh(request: Request, payload: RefreshRequest, db: Session = Depends(get_db)):
    try:
        decode_refresh_token(payload.refresh_token)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Expired or invalid refresh token",
        )

    db_token = db.query(Token).filter(Token.token == payload.refresh_token).first()
    if not db_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token not found or revoked",
        )
        
    new_access_token = create_access_token(subject=str(db_token.id_akun))

    new_refresh_token = create_refresh_token(subject=str(db_token.id_akun))
    db_token.token = new_refresh_token
    db.commit()
    
    akun = db.query(Akun).filter(Akun.id_akun == db_token.id_akun).first()
    role = akun.role if akun else 0
    
    return TokenResponse(
        access_token=new_access_token, 
        refresh_token=new_refresh_token, 
        role=role
    )

@router.post("/logout")
@limiter.limit("10/minute")
def logout(request: Request, payload: RefreshRequest, db: Session = Depends(get_db)):
    deleted = db.query(Token).filter(Token.token == payload.refresh_token).delete()
    db.commit()
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Token not found or already logged out",
        )
    return {"detail": "Successfully logged out"}