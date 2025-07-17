from fastapi import APIRouter
from app.database import database 
from app.models.models import  menu_items
from app.schemas.schemas import MenuItemIn, MenuItemOut


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

@router.post("/menu", response_model=MenuItemOut)
async def create_menu_item(item: MenuItemIn):
    query = menu_items.insert().values(**item.dict())
    item_id = await database.execute(query)
    return {**item.dict(), "id": item_id}
@router.get("/", response_model=list[MenuItemOut])
async def get_all_menu_items():
    query = menu_items.select()
    return await database.fetch_all(query)
