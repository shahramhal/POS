from fastapi import FastAPI # Import FastAPI framework
from database import database
from fastapi.middleware.cors import CORSMiddleware
from api.routers import menu, categories, orders, tables,users,payments, order_items, auth

app = FastAPI()

origins = [
    "http://localhost:5173",  # The address of your React frontend
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows specific origins to make requests
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

app.include_router(menu.router, prefix="/menu", tags=["Menu"])
app.include_router(categories.router, prefix="/menu/categories", tags=["Categories"])
app.include_router(orders.router, prefix="/orders", tags=["Orders"])
app.include_router(tables.router, prefix="/tables", tags=["Tables"])
app.include_router(order_items.router, prefix="/order_items", tags=["Order Items"])
app.include_router(users.router, prefix="/users",tags=["User"])
app.include_router(payments.router, prefix="/payment", tags=["Payment"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])


app.get("/")
async def root():
    return {"message": "Welcome to the POS API"}