from pydantic import BaseModel, ConfigDict
from typing import Optional

class TokenBase(BaseModel):
    token: Optional[str] = None
    id_akun: Optional[int] = None

class TokenCreate(TokenBase):
    pass

class Token(TokenBase):
    id_token: int

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LoginRequest(BaseModel):
    username: str
    password: str
    role: int 