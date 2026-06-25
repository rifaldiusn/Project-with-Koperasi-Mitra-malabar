import os
import sys

# Add the project root to the python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import engine
from sqlalchemy import text

try:
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE Customer ADD COLUMN link_gmaps TEXT;"))
        conn.commit()
    print("Successfully added link_gmaps to Customer table")
except Exception as e:
    print(f"Error modifying database: {e}")
