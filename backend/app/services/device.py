# app/services/device.py
from sqlalchemy.orm import Session
from app.models.device import Device
from app.schemas.device import DeviceCreate, DeviceUpdate, DeviceStatus
from typing import List, Optional, Dict, Any
from datetime import datetime

def create_device(db: Session, device: DeviceCreate) -> Device:
    """Créer un nouveau device"""
    db_device = Device(
        site_id=device.site_id,
        location=device.location,
        name=device.name,
        enabled=device.enabled,
        volume=device.volume,
        screen_on=device.screen_on
    )
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device

def get_device_by_id(db: Session, device_id: int) -> Optional[Device]:
    """Récupérer un device par son ID"""
    return db.query(Device).filter(Device.id == device_id).first()

def get_device_by_name(db: Session, name: str) -> Optional[Device]:
    """Récupérer un device par son nom"""
    return db.query(Device).filter(Device.name == name).first()

def get_devices_by_site(db: Session, site_id: int) -> List[Device]:
    """Récupérer tous les devices d'un site"""
    return db.query(Device).filter(Device.site_id == site_id).all()

def get_all_devices(db: Session) -> List[Device]:
    """Récupérer tous les devices"""
    return db.query(Device).all()

def update_device(db: Session, device_id: int, device_update: DeviceUpdate) -> Optional[Device]:
    """Mettre à jour un device"""
    device = get_device_by_id(db, device_id)
    if not device:
        return None
    
    update_data = device_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(device, field, value)
    
    db.commit()
    db.refresh(device)
    return device

def update_device_status(db: Session, device: Device, status: DeviceStatus):
    """Mettre à jour le statut d'un device"""
    device.is_online = status.is_online
    device.is_playing = status.is_playing
    device.current_media = status.current_media
    device.last_seen = datetime.utcnow()
    
    if status.ip_address:
        device.ip_address = status.ip_address
    if status.mac_address:
        device.mac_address = status.mac_address
    if status.system_info:
        device.system_info = status.system_info
    
    db.commit()

def set_device_action(db: Session, device_id: int, action: str, params: Optional[Dict[str, Any]] = None) -> Optional[Device]:
    """Définir une action à exécuter sur un device"""
    device = get_device_by_id(db, device_id)
    if not device:
        return None
    
    if not device.pending_actions:
        device.pending_actions = {}
    
    device.pending_actions[action] = params or True
    db.commit()
    db.refresh(device)
    return device

def get_device_statistics(db: Session, site_id: Optional[int] = None) -> Dict[str, int]:
    """Récupérer les statistiques des devices"""
    query = db.query(Device)
    if site_id:
        query = query.filter(Device.site_id == site_id)
    
    devices = query.all()
    
    return {
        "total": len(devices),
        "online": len([d for d in devices if d.is_online]),
        "offline": len([d for d in devices if not d.is_online]),
        "playing": len([d for d in devices if d.is_playing])
    }