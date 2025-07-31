from fastapi import APIRouter
from app.database import database
from app.models.models import tables
from app.schemas.schemas import TableIn, TableOut
from sqlalchemy.exc import IntegrityError, DataError
from fastapi.responses import JSONResponse


router = APIRouter()
@router.post("/create", response_model=TableOut)
async def create_tables (table: TableIn):
    query = tables.insert().values(**table.dict())
    try :
        
        table_id = await database.execute(query)
        return {**table.dict(), "id": table_id}
    except IntegrityError as e:
        return JSONResponse(
            status_code=400,
            content={"detail": "Integrity error: likely duplicate or invalid field"}
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
@router.get("/", response_model=list[TableOut])
async def get_all_tables():
    query = tables.select()
    try :
        records=await database.fetch_all(query)
        return ([dict(record) for record in records])
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
        )
        
   