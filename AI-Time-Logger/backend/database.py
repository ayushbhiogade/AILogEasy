import os
from dotenv import load_dotenv
from sqlmodel import create_engine, SQLModel, Session
from contextlib import contextmanager

# Load environment variables from .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable not set")

# The connect_args are recommended for SQLite, but not typically needed for PostgreSQL.
# We'll keep it simple for Postgres.
engine = create_engine(DATABASE_URL, echo=True) # echo=True logs SQL queries, useful for debugging

def create_db_and_tables():
    # This function will be called once at startup to create tables
    # Import models here to ensure they are registered with SQLModel metadata
    from . import models # Changed to relative import
    SQLModel.metadata.create_all(engine)

# Dependency to get DB session in path operations
def get_session():
    with Session(engine) as session:
        yield session

# Alternative context manager for sessions (can be useful in background tasks etc.)
@contextmanager
def session_scope():
    """Provide a transactional scope around a series of operations."""
    session = Session(engine)
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close() 