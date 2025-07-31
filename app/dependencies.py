# dependencies.py
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from utils.jwt import decode_access_token
from app.database import database
from app.models.models import users
from sqlalchemy import select

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = decode_access_token(token)
        user_id = int(payload.get("sub"))
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

    query = select(users).where(users.c.id == user_id)
    user = await database.fetch_one(query)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

def require_role(role: str):
    async def _require_role(user: dict = Depends(get_current_user)):
        if user.role != role:
            raise HTTPException(status_code=403, detail="Not authorized")
        return user
    return _require_role
