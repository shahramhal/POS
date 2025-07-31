from fastapi import APIRouter, Depends , HTTPException
from app.database import database 
from app.models.models import  menu_items
from app.schemas.schemas import MenuItemIn, MenuItemOut
from sqlalchemy.exc import IntegrityError, DataError
from fastapi.responses import JSONResponse
# from dependencies import require_role

router = APIRouter()


# @app.get("/")
# async def root():
#     return {"message": "Welcome to the POS API"}
# metadata.create_all(bind=engine)

# @app.on_event("startup")
# async def startup():
#     await database.connect()

# @app.on_event("shutdown")
# async def shutdown():
#     await database.disconnect()

@router.post("/create", response_model=MenuItemOut)
async def create_menu_item(item: MenuItemIn):
    query = menu_items.insert().values(**item.dict())
    try:
        
        item_id = await database.execute(query)
        return {**item.dict(), "id": item_id}
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
@router.get("/", response_model=list[MenuItemOut])
async def get_all_menu_items():
    query = menu_items.select()
    try:
        records = await database.fetch_all(query)
        return [dict(record) for record in records]
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
        )

@router.get("/{item_id}", response_model=MenuItemOut)
async def get_menu_item(item_id: int):
    query=menu_items.selecy().where(menu_items.c.id == item_id)
    try :
        records=await database.fetch_one(query)
        if records is None:
            raise HTTPException(status_code=404, detail="Menu item not found")
        return dict(records)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
        )
@router.put("/{item_id}", response_model=MenuItemOut)
async def update_menu_items (item_id: int, item:MenuItemIn):
    query = menu_items.update().where(menu_items.c.id ==item_id).values(**item.dict) 
    try :
        await database.execute(query)
        return {**item.dict(), "id": item_id}
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
@router.delete("/{item_id}")
async def delete_menu_item(item_id: int):
    query= menu_items.delete().where(menu_items.c.id==item_id)
    try:
        await database.execute(query)
        return JSONResponse(
            status_code=204,
            content={"detail": "Menu item deleted successfully"}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
        )
        
        
        

