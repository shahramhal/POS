from fastapi import APIRouter
from database import database
from models.models import menu_categories
from schemas.schemas import MenuCategoryIn, MenuCategoryOut
from sqlalchemy.exc import IntegrityError, DataError
from fastapi.responses import JSONResponse
router = APIRouter()
@router.post("/create", response_model=MenuCategoryOut)
async def create_category(category: MenuCategoryIn):
    query = menu_categories.insert().values(**category.dict())
    try:
        
        category_id = await database.execute(query)
        return {**category.dict(), "id": category_id}
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
        
@router.get("/", response_model=list[MenuCategoryOut])
async def get_all_categories():
    query = menu_categories.select()
    try:
        records = await database.fetch_all(query)
        return [dict(record) for record in records]
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
        )
@router.get("/{category_id}", response_model=MenuCategoryOut)
async def get_category_by_id(category_id:int):
    query= menu_categories.select().where(menu_categories.c.id==category_id)
    try:
        record =await database.fetch_one(query)
        if record is None:
            return JSONResponse(
                status_code=404,
                content={"detail": "Category not found"}
            )
            
        return dict(record)
       
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
        )
@router.put("/{category_id}/update", response_model=MenuCategoryOut)
async def update_category(category_id:int, category: MenuCategoryIn):
    query = menu_categories.update().where(menu_categories.c.id == category_id).values(**category.dict())
    try:
        await database.execute(query)
        return {**category.dict(), "id": category_id}
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
@router.delete("/{category_id}/delete")
async def delete_category(category_id: int):
    query = menu_categories.delete().where(menu_categories.c.id == category_id)
    try:
        await database.execute(query)
        return JSONResponse(
            status_code=204,
            content={"detail": "Category deleted successfully"}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
        )
    

