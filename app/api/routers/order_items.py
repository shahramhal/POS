from fastapi import APIRouter
from app.database import database
from app.models.models import order_items
from app.schemas.schemas import OrderItemIn, OrderItemOut
from sqlalchemy.exc import IntegrityError, DataError
from fastapi.responses import JSONResponse
#
router = APIRouter()
@router.post("/create", response_model=OrderItemOut)
async def create_orders(order_item: OrderItemIn):
    query = order_items.insert().values(**order_item.dict())
    try:
        order_id = await database.execute(query)
        return {**order_item.dict(), "id": order_id}
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
        
@router.get("/", response_model=list[OrderItemOut])
async def get_all_orders():
    query = order_items.select()
    try:
        records = await database.fetch_all(query)
        return [dict(record) for record in records]
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
        )
