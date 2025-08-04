from fastapi import APIRouter
from database import database
from models.models import orders
from schemas.schemas import  OrderIn, OrderOut
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
@router.get("/{order_id}", response_model=OrderOut)
async def get_order_by_id(order_id: int):
    query = orders.select().where(orders.c.id == order_id)
    try:
        record = await database.fetch_one(query)
        if record:
            return dict(record)
        else:
            return JSONResponse(
                status_code=404,
                content={"detail": "Order not found"}
            )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
        )
@router.put("/{order_id}/update", response_model=OrderOut)
async def update_order(order_id: int, order: OrderIn):
    query = orders.update().where(orders.c.id == order_id).values(**order.dict())
    try:
        result = await database.execute(query)
        if result:
            return {**order.dict(), "id": order_id}
        else:
            return JSONResponse(
                status_code=404,
                content={"detail": "Order not found"}
            )
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
    
@router.delete("/{order_id}/delete")
async def delete_order(order_id: int):
    query = orders.delete().where(orders.c.id == order_id)
    try:
        result = await database.execute(query)
        if result:
            return JSONResponse(
                status_code=204,
                content={"detail": "Order deleted successfully"}
            )
        else:
            return JSONResponse(
                status_code=404,
                content={"detail": "Order not found"}
            )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
        )

        
