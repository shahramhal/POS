from sqlalchemy import ForeignKey, Table, Column, Integer, String, Boolean, DateTime, Float
from sqlalchemy.sql import func
from sqlalchemy import MetaData
metadata = MetaData()

users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(100)),
    Column("role", String(100), unique=True),
)
tables = Table (
    "tables",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(100), unique=True),
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
    # Column("description", String(255), nullable=True),  ???? should we add description? 
    Column("is_available", Boolean, default=True)
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
)
order_items = Table(
    "order_items",  
    metadata,
    Column("id", Integer, primary_key=True),
    Column("order_id", Integer, ForeignKey("orders.id")),
    Column("menu_item_id", Integer, ForeignKey("menu_items.id")),
    Column("quantity", Integer, default=1),
)
