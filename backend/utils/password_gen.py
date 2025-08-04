import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from app.utils.security import hash_password

hashed = hash_password("Komron06")
print(hashed)
