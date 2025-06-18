# app/api/endpoints/device.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.device import DeviceCreate, DeviceRead, DeviceUpdate, DeviceAction
from app.api.deps import get_db, require_admin_or_superadmin, get_current_user
from app.services.device import (
    create_device, get_device_by_name, get_device_by_id,
    get_devices_by_site, get_all_devices, update_device,
    set_device_action, get_device_statistics
)
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=DeviceRead)
def register_device(
    device: DeviceCreate, 
    db: Session = Depends(get_db), 
    current_user=Depends(require_admin_or_superadmin)
):
    existing = get_device_by_name(db, device.name)
    if existing:
        raise HTTPException(status_code=400, detail="Device déjà enregistré.")
    return create_device(db, device)

@router.get("/", response_model=List[DeviceRead])
def list_devices(
    site_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste tous les devices ou ceux d'un site spécifique"""
    if current_user.role == "admin" and current_user.site_id:
        # Admin de site ne voit que ses devices
        return get_devices_by_site(db, current_user.site_id)
    elif site_id:
        return get_devices_by_site(db, site_id)
    else:
        return get_all_devices(db)

@router.get("/statistics")
def get_statistics(
    site_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retourne des statistiques sur les devices"""
    if current_user.role == "admin" and current_user.site_id:
        site_id = current_user.site_id
    return get_device_statistics(db, site_id)

@router.get("/{device_id}", response_model=DeviceRead)
def get_device(
    device_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    device = get_device_by_id(db, device_id)
    if not device:
        raise HTTPException(status_code=404, detail="Device non trouvé")
    
    # Vérifier les permissions
    if current_user.role == "admin" and current_user.site_id != device.site_id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    return device

@router.put("/{device_id}", response_model=DeviceRead)
def update_device_config(
    device_id: int,
    device_update: DeviceUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin_or_superadmin)
):
    device = update_device(db, device_id, device_update)
    if not device:
        raise HTTPException(status_code=404, detail="Device non trouvé")
    return device

@router.post("/{device_id}/action")
def send_device_action(
    device_id: int,
    action: DeviceAction,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin_or_superadmin)
):
    """Envoie une action à exécuter au device"""
    device = set_device_action(db, device_id, action.action, action.params)
    if not device:
        raise HTTPException(status_code=404, detail="Device non trouvé")
    
    return {"status": "Action enregistrée", "device": device.name, "action": action.action}

@router.delete("/{device_id}")
def delete_device(
    device_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin_or_superadmin)
):
    device = get_device_by_id(db, device_id)
    if not device:
        raise HTTPException(status_code=404, detail="Device non trouvé")
    
    db.delete(device)
    db.commit()
    return {"status": "Device supprimé"}