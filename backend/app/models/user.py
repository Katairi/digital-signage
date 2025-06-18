# app/models/user.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base  # Même Base que site.py

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False, default="admin")  # admin, superadmin
    site_id = Column(Integer, ForeignKey("sites.id"), nullable=True)

    site = relationship("Site")