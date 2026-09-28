"""
Database Configuration for SQLite / PostgreSQL using SQLAlchemy 2.0.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB_PATH = os.path.join(BASE_DIR, "recommendation_system.db")

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def init_tables():
    from backend.database import models
    Base.metadata.create_all(bind=engine)

def get_db():
    init_tables()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
