# app/models/site.py
from sqlalchemy import Column, Integer, String
from app.core.database import Base 

class Site(Base):
    __tablename__ = "sites"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    address = Column(String, nullable=False)