from fastapi import APIRouter 
from app.database import database
from app.models.models import payments
from app.schemas.schemas import PaymentIn , PaymentOut 
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

