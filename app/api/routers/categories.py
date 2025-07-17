from fastapi import APIRouter
from app.database import database
from app.models.models import menu_categories
from app.schemas.schemas import MenuCategoryIn, MenuCategoryOut
router = APIRouter()
@router.post("/categories", response_model=MenuCategoryOut)
async def create_category(category: MenuCategoryIn):
    query = menu_categories.insert().values(**category.dict())
    category_id = await database.execute(query)
    return {**category.dict(), "id": category_id}
@router.get("/categories", response_model=list[MenuCategoryOut])
async def get_all_categories():
    query = menu_categories.select()
    return await database.fetch_all(query)