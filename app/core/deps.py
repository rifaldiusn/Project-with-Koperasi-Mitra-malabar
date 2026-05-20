from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.akun import Akun
from app.core.security import decode_access_token
from jose import JWTError

bearer_scheme = HTTPBearer()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    try:
        user_id = decode_access_token(token)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = db.query(Akun).filter(Akun.id_akun == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

def require_super_admin(current_user: Akun = Depends(get_current_user)):
    if current_user.role != 1:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only super admin")
    return current_user

def require_sales(current_user: Akun = Depends(get_current_user)):
    if current_user.role not in (1, 2):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only sales")
    return current_user

def require_marketing(current_user: Akun = Depends(get_current_user)):
    if current_user.role not in (1, 3):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only marketing")
    return current_user