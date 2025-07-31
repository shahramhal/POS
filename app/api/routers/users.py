from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.database import database
from app.models.models import users
from app.schemas.schemas import UserIn, UserOut
from sqlalchemy.exc import IntegrityError, DataError
router = APIRouter()
@router.post("/create", response_model=UserOut)
async def create_user(user: UserIn):
    query = users.insert().values(**user.dict())
    
    try :
        user_id= await database.execute(query)
        return {**user.dict(), "id": user_id}
    except IntegrityError as e:
         return JSONResponse(
            status_code=400,
            content={"detail": "Integrity error: likely duplicate or invalid field", "error": str(e.orig)}
        )
    except DataError as e:
        return JSONResponse(
            status_code=400,
            content={"detail": "Invalid data format or length", "error": str(e.orig)}
        )

    
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
            )

@router.get("/", response_model=list[UserOut])
async def get_all_users():
    query = users.select()
    try:
        records = await database.fetch_all(query)
        return [
            {**dict(record), "password_hash": None} for record in records  # Remove or mask password
        ]
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
        )
    