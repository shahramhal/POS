from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordRequestForm
from sqlalchemy.sql import select
from database import database
from models.models import users
from utils.security import verify_password
from utils.jwt import create_access_token, decode_access_token


router = APIRouter()
bearer_scheme = HTTPBearer()

@router.post("/login", summary="Create access token for user")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    query = select(users).where(users.c.email == form_data.username)
    user = await database.fetch_one(query)

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=400,
            detail="Invalid pin"
        )

    token_data = {"sub": str(user.id), "role": user.role}
    token = create_access_token(token_data)
    message = "Login successful" if user.is_active else "User is inactive, please contact support"
    return {"access_token": token, "token_type": "bearer", "message": message, "user_id": user.id, "role": user.role}

@router.get("/me", summary="Get current user details")
async def get_me(token_credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    try:
        token = token_credentials.credentials
        payload = decode_access_token(token)
        user_id = int(payload.get("sub"))
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token: no subject")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token or expired token")

    query = select(users).where(users.c.id == user_id)
    user = await database.fetch_one(query)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "is_active": user.is_active
    }
