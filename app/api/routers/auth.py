from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordRequestForm
from sqlalchemy.sql import select
from app.database import database
from app.models.models import users
from app.utils.security import verify_password
from app.utils.jwt import create_access_token, decode_access_token

# 1. Define the router and the security scheme
router = APIRouter()
bearer_scheme = HTTPBearer()

# 2. Your /login endpoint (this was already correct)
@router.post("/login", summary="Create access token for user")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Logs in a user and returns an access token.
    """
    query = select(users).where(users.c.email == form_data.username)
    user = await database.fetch_one(query)

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=400,
            detail="Invalid username or password"
        )

    token_data = {"sub": str(user.id), "role": user.role}
    token = create_access_token(token_data)
    return {"access_token": token, "token_type": "bearer"}


# 3. Your corrected /me endpoint
@router.get("/me", summary="Get current user details")
async def get_me(token_credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    """
    Returns the details of the currently authenticated user.
    """
    try:
        # FIX #1: Get the actual token string from the credentials object
        token = token_credentials.credentials
        payload = decode_access_token(token)
        user_id = int(payload.get("sub"))
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token: no subject")
    except Exception:
        # Catch any error during token decoding
        raise HTTPException(status_code=401, detail="Invalid token or expired token")

    # Fetch user from the database
    query = select(users).where(users.c.id == user_id)
    user = await database.fetch_one(query)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # FIX #2: Return useful user data instead of the token
    return {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "is_active": user.is_active
        
    }