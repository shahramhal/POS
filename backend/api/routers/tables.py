from fastapi import APIRouter
from database import database
from models.models import tables
from schemas.schemas import TableIn, TableOut
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
        
@router.get("/{table_id}", response_model=TableOut)
async def get_table_by_id(table_id:int):
    query = tables.select().where(tables.c.id==table_id)
    try:
        record = await database.fetch_one(query)
        if record is None:
            return JSONResponse(
                status_code=404,
                content={"detail": "Table not found"}
            )
        return dict(record)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
        )
@router.put("/{table_id}/update", response_model=TableOut)
async def update_table(table_id: int, table: TableIn):
    query = tables.update().where(tables.c.id == table_id).values(**table.dict())
    try:
        await database.execute(query)
        return {**table.dict(), "id": table_id}
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
@router.delete("/{table_id}/delete")
async def delete_table(table_id: int):
    query = tables.delete().where(tables.c.id == table_id)
    try:
        await database.execute(query)
        return JSONResponse(
            status_code=204,
            content={"detail": "Table deleted successfully"}
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

  