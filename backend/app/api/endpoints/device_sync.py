# app/api/endpoints/device_sync.py
from fastapi import APIRouter, HTTPException, Query, Depends, Request
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.services.device import get_device_by_name, update_device_status
from app.schemas.device import DeviceStatus
from typing import Optional
import os

router = APIRouter()

MEDIA_ROOT = "/app/media"

@router.get("/sync")
def sync_device(
    site: str = Query(...),
    location: str = Query(...),
    db: Session = Depends(get_db)
):
    """Endpoint appelé régulièrement par les Raspberry Pi pour récupérer leur configuration"""
    device_name = f"{site}-{location}"
    device = get_device_by_name(db, device_name)

    if not device:
        raise HTTPException(status_code=404, detail="Device non enregistré.")
    
    if not device.enabled:
        return {
            "device": device_name,
            "enabled": False,
            "message": "Device désactivé"
        }

    # Récupère le chemin vers les médias
    media_path = os.path.join(MEDIA_ROOT, site, location)
    playlist_path = os.path.join(media_path, "playlist.txt")

    playlist_files = []
    if os.path.exists(playlist_path):
        with open(playlist_path, "r") as f:
            playlist_files = [line.strip() for line in f.readlines() if line.strip()]

    # Retourne la configuration et les actions en attente
    return {
        "device": device_name,
        "enabled": device.enabled,
        "playlist": playlist_files,
        "volume": device.volume,
        "screen_on": device.screen_on,
        "schedule": device.schedule,
        "pending_actions": device.pending_actions or {}
    }

@router.post("/heartbeat")
async def device_heartbeat(
    site: str = Query(...),
    location: str = Query(...),
    status: DeviceStatus = ...,
    request: Request = None,
    db: Session = Depends(get_db)
):
    """Heartbeat envoyé par les Raspberry Pi pour signaler leur état"""
    device_name = f"{site}-{location}"
    device = get_device_by_name(db, device_name)

    if not device:
        raise HTTPException(status_code=404, detail="Device non enregistré.")
    
    # Récupère l'IP du client
    if not status.ip_address and request:
        status.ip_address = request.client.host

    # Met à jour le statut
    update_device_status(db, device, status)

    return {
        "status": "OK",
        "device": device_name,
        "timestamp": device.last_seen
    }

@router.get("/download/{site}/{location}/{filename}")
async def download_media(
    site: str,
    location: str,
    filename: str,
    db: Session = Depends(get_db)
):
    """Télécharge un fichier média spécifique"""
    device_name = f"{site}-{location}"
    device = get_device_by_name(db, device_name)

    if not device or not device.enabled:
        raise HTTPException(status_code=403, detail="Accès non autorisé")

    file_path = os.path.join(MEDIA_ROOT, site, location, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Fichier non trouvé")

    from fastapi.responses import FileResponse
    return FileResponse(file_path)