from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class UserIn(BaseModel):
    name: str
    email: str
    password_hash: Optional[str] = None #temporary # until we implement password hashing
    role: str
    is_active: bool = True
   
class UserOut(UserIn):
    id: int 
class MenuItemIn(BaseModel):
    name: str
    price: float
    description: Optional[str] = None 
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
class ItemModifierIn(BaseModel):
    name: str
class ItemModifierOut(ItemModifierIn):
    id: int
class MenuItemModifierIn(BaseModel):
    menu_item_id: int
    modifier_id: int
    price: float = 0.0
class MenuItemModifierOut(MenuItemModifierIn):
    menu_item_id: int
    modifier_id: int
    price: float = 0.0
class OrderIn(BaseModel):
    table_id: int
    user_id: int
    is_paid: bool = False
    status: str = "open"  
class OrderOut(OrderIn):
    id: int

class OrderItemIn(BaseModel):
    order_id: int
    menu_item_id: int
    quantity: int = 1
    price: float
    comment: Optional[str] = None
class OrderItemOut(OrderItemIn):
    id: int
    
    
class TableIn(BaseModel):
    number: int
    is_occupied: bool = True
class TableOut(TableIn):
    id: int
    # created_at: str
    # updated_at: str
    # is_paid: bool = False
    
class PaymentIn(BaseModel):
    payment_type: str
    order_id: int
    paid_amount: float
    
class PaymentOut(PaymentIn):
    id: int
    paid_at: datetime
class OrderItemModifierIn(BaseModel):   
    order_item_id: int
    modifier_id: int    
class OrderItemModifierOut(OrderItemModifierIn):
    order_item_id: int
    modifier_id: int    
    
