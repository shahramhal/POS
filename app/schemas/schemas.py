from pydantic import BaseModel
from typing import Optional

class MenuItemIn(BaseModel):
    name: str
    price: float
    # description: Optional[str] = None if we want to add description later
    category_id: int
    is_available: bool = True

class MenuItemOut(MenuItemIn):
    id: int

    # class Config:
    #     orm_mode = True
class MenuCategoryIn(BaseModel):
    name: str
class MenuCategoryOut(MenuCategoryIn):
    id: int

    # class Config: