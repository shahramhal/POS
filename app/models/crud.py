from app.models.models import users 
from app.database import database, metadata, engine
from app.schemas.schemas import UserIn, UserOut

async def create_user(user: UserIn):
    query = users.insert().values(name=user.name, email=user.email)
    last_record_id = await database.execute(query)
    return UserOut(id=last_record_id, name=user.name, email=user.email)

async def get_users():
    query = users.select()
    return await database.fetch_all(query)  