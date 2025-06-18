# app/schemas/device.py
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class DeviceBase(BaseModel):
    site_id: int
    location: str
    name: str
    enabled: bool = True
    volume: int = 50
    screen_on: bool = True

class DeviceCreate(DeviceBase):
    pass

class DeviceUpdate(BaseModel):
    site_id: Optional[int] = None
    location: Optional[str] = None
    enabled: Optional[bool] = None
    volume: Optional[int] = None
    screen_on: Optional[bool] = None
    schedule: Optional[Dict[str, Any]] = None

class DeviceStatus(BaseModel):
    is_online: bool = True
    is_playing: bool = False
    current_media: Optional[str] = None
    ip_address: Optional[str] = None
    mac_address: Optional[str] = None
    system_info: Optional[Dict[str, Any]] = None

class DeviceAction(BaseModel):
    action: str
    params: Optional[Dict[str, Any]] = None

class DeviceRead(DeviceBase):
    id: int
    last_seen: Optional[datetime] = None
    is_online: bool = False
    is_playing: bool = False
    current_media: Optional[str] = None
    ip_address: Optional[str] = None
    mac_address: Optional[str] = None
    system_info: Optional[Dict[str, Any]] = None
    schedule: Optional[Dict[str, Any]] = None
    pending_actions: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True