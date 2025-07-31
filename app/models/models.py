import enum
from sqlalchemy import Enum, ForeignKey, Numeric, Table, Column, Integer, String, Boolean, DateTime, Float,TEXT
from sqlalchemy.sql import func
from sqlalchemy import MetaData
metadata = MetaData()

class UserRoleEnum(str, enum.Enum):
    admin = "admin"
    waiter = "waiter"
    kitchen = "kitchen"
class OrderStatusEnum(str, enum.Enum):
    open = "open"
    sent = "sent"
    completed = "completed"
    paid = "paid"
class PaymentTypeEnum(str, enum.Enum):
    cash = "cash"
    card = "card"
    other = "other"
users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(100)),
    Column("email", String(100), unique=True),
    Column("password_hash", TEXT),
     Column("role", Enum(UserRoleEnum, name="user_role_enum"), nullable=False),
    Column("is_active", Boolean, default=True)
)
tables = Table (
    "tables",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("number", Integer, unique=True),
    Column("is_occupied", Boolean, default=False)
    
)
menu_categories = Table(
    "menu_categories", 
    metadata,
    Column("id", Integer, primary_key=True),   
    Column("name", String(100), unique=True)
)
menu_items = Table(
    "menu_items",   
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(100)),   
    Column("category_id", Integer, ForeignKey("menu_categories.id")),
    Column("price", Float),
    Column("description", String(255), nullable=True), 
    Column("is_available", Boolean, default=True),
    
)
item_modifiers = Table(
    "item_modifiers",   
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(100))
)
menu_item_modifiers = Table( 
    "menu_item_modifiers",
    metadata,   
    Column("menu_item_id", Integer, ForeignKey("menu_items.id", ondelete="CASCADE"),primary_key=True), 
    Column("modifier_id", Integer, ForeignKey("item_modifiers.id", ondelete="CASCADE"),primary_key=True),
    Column("price", Float, default=0.0)
)

orders = Table(
    "orders",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("table_id", Integer, ForeignKey("tables.id")),
    Column("user_id", Integer, ForeignKey("users.id")),
    Column('created_at',  DateTime(timezone=True),server_default=func.now(),),
    Column('updated_at',  DateTime(timezone=True), server_default=func.now(), onupdate=func.now()),
    Column('is_paid', Boolean, default=False),
    Column('status',Enum(OrderStatusEnum, name="order_status_enum"), default=OrderStatusEnum.open, nullable=False)
)
order_items = Table(
    "order_items",  
    metadata,
    Column("id", Integer, primary_key=True),
    Column("order_id", Integer, ForeignKey("orders.id")),
    Column("menu_item_id", Integer, ForeignKey("menu_items.id")),
    Column("quantity", Integer, default=1),
    Column("price", Numeric(10,2), nullable=False),
    Column("comment", String(255), nullable=True),
)
order_item_modifiers = Table(
    "order_item_modifiers", 
    metadata,  
    Column("order_item_id", Integer, ForeignKey("order_items.id", ondelete="CASCADE"), primary_key=True),
    Column("modifier_id", Integer, ForeignKey("item_modifiers.id", ondelete="CASCADE"), primary_key=True),
)
payments = Table(
    "payments", 
    metadata,
    Column("id", Integer, primary_key=True),
    Column("order_id", Integer, ForeignKey("orders.id")),
    Column("paid_amount", Numeric(10,2), nullable=False),
    Column("payment_type",Enum(PaymentTypeEnum, name="payment_type_enum"), nullable=False),
    Column("paid_at", DateTime(timezone=True), server_default=func.now())
)
