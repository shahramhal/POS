from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from database import database
from models.models import users
from schemas.schemas import UserIn, UserOut
from sqlalchemy.exc import IntegrityError, DataError
from utils.security import hash_password
router = APIRouter()
@router.post("/create", response_model=UserOut)
async def create_user(user: UserIn):
    hashed_password = hash_password(user.password_hash)
    query = users.insert().values(**user.dict(exclude={"password_hash"}), password_hash=hashed_password)
    
    try:
        user_id = await database.execute(query)
        return {**user.dict(exclude={"password_hash"}), "id": user_id, "password_hash": None}
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
    update_data = user.dict(exclude_unset=True)
    if "password_hash" in update_data:
        update_data["password_hash"] = hash_password(update_data["password_hash"])
    query = users.update().where(users.c.id == user_id).values(**update_data)
    try:
        result = await database.execute(query)
        if result:
            return {**update_data, "id": user_id}
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
