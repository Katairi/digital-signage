# app/models/device.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base  # Même Base que les autres

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, ForeignKey("sites.id"), nullable=False)
    location = Column(String, nullable=False)
    name = Column(String, unique=True, nullable=False)
    
    # État et monitoring
    last_seen = Column(DateTime, default=datetime.utcnow)
    is_online = Column(Boolean, default=False)
    is_playing = Column(Boolean, default=False)
    current_media = Column(String, nullable=True)
    
    # Informations système
    ip_address = Column(String, nullable=True)
    mac_address = Column(String, nullable=True)
    system_info = Column(JSON, nullable=True)  # CPU, RAM, stockage, etc.
    
    # Configuration
    enabled = Column(Boolean, default=True)
    volume = Column(Integer, default=50)  # 0-100
    screen_on = Column(Boolean, default=True)
    schedule = Column(JSON, nullable=True)  # Programmation on/off
    
    # Actions en attente
    pending_actions = Column(JSON, nullable=True)  # {"reboot": true, "update": true, etc.}
    
    site = relationship("Site")