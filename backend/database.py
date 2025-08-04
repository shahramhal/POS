from sqlalchemy import create_engine
from databases import Database
from config import DATABASE_URL
from models import models  

database = Database(DATABASE_URL)


engine = create_engine(DATABASE_URL.replace('+asyncpg', '')) 
models.metadata.create_all(bind=engine)
