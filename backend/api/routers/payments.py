from fastapi import APIRouter 
from database import database
from models.models import payments
from schemas.schemas import PaymentIn , PaymentOut 
from sqlalchemy.exc import IntegrityError, DataError
from fastapi.responses import JSONResponse


router=APIRouter()

@router.get('/', response_model=list[PaymentOut])
async def get_all_payments():
    query = payments.select()
    try:
        result = await database.fetch_all(query)
        return [dict(row) for row in result]
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
        )
    
    

@router.post('/create',response_model=PaymentIn)
async def create_payment(payment: PaymentIn):
    query=payments.insert().values(**payment.dict())
    try:
        # Execute the query and get the payment ID
        payment_id=await database.execute(query)
        return {**payment.dict(), "id": payment_id}
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
@router.get("/{payment_id}", response_model=PaymentOut)
async def get_payment_by_id(payment_id: int):
    query = payments.select().where(payments.c.id == payment_id)
    try:
        record = await database.fetch_one(query)
        if record is None:
            return JSONResponse(
                status_code=404,
                content={"detail": "Payment not found"}
            )
        return dict(record)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
        )
@router.put("/{payment_id}/update", response_model=PaymentOut)
async def update_payment(payment_id: int, payment: PaymentIn):
    query = payments.update().where(payments.c.id == payment_id).values(**payment.dict())
    try:
        await database.execute(query)
        return {**payment.dict(), "id": payment_id}
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
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
        )
@router.delete("/{payment_id}/delete")
async def delete_payment(payment_id: int):
    query = payments.delete().where(payments.c.id == payment_id)
    try:
        await database.execute(query)
        return JSONResponse(
            status_code=204,
            content={"detail": "Payment deleted successfully"}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
        )
        

