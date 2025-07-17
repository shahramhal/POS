from fastapi import FastAPI
from app.database import database
from app.api.routers import menu, categories

app = FastAPI()

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

app.include_router(menu.router, prefix="/menu", tags=["Menu"])
app.include_router(categories.router, prefix="/categories", tags=["Categories"])
