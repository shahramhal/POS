import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("postgres_url", "postgresql+asyncpg://postgres:123@localhost/POS")
