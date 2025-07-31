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
@router.get("/{user_id}", response_model=UserOut)
async def get_user_by_id(user_id: int):
    query = users.select().where(users.c.id == user_id)
    try:
        record = await database.fetch_one(query)
        if record:
            return {**dict(record), "password_hash": None}  # Remove or mask password
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
        )
@router.put("/{user_id}/update", response_model=UserOut)
async def update_user(user_id: int, user: UserIn):
    query = users.update().where(users.c.id == user_id).values(**user.dict())
    try:
        result = await database.execute(query)
        if result:
            return {**user.dict(), "id": user_id}
        else:
            raise HTTPException(status_code=404, detail="User not found")
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
@router.delete("/{user_id}/delete")
async def delete_user(user_id: int):
    query = users.delete().where(users.c.id == user_id)
    try:
        result = await database.execute(query)
        if result:
            return JSONResponse(
                status_code=204,
                content=None
            )
        else:
            raise HTTPException(status_code=404, detail="User not found")
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
