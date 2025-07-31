from fastapi import APIRouter
from app.database import database
from app.models.models import orders
from app.schemas.schemas import  OrderIn, OrderOut
from sqlalchemy.exc import IntegrityError, DataError
from fastapi.responses import JSONResponse  

router = APIRouter()
@router.post("/create", response_model=OrderOut)
async def create_orders (order: OrderIn):
    query = orders.insert().values(**order.dict())
    try:
        
        order_id = await database.execute(query)
        return {**order.dict(), "id": order_id}
    except IntegrityError:
        return JSONResponse(
            status_code=400,
            content={"detail": "Integrity error: likely duplicate or invalid field"}
        )
    except DataError:
        return JSONResponse(
            status_code=400,
            content={"detail": "Invalid data format or length"}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
        )
    
@router.get("/", response_model=list[OrderOut])
async def get_all_orders():
    query = orders.select()
    try:
        records = await database.fetch_all(query)
        return [dict(record) for record in records]
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
        )
        
