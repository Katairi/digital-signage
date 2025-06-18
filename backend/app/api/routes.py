#app/api/routes.py
from fastapi import APIRouter
from app.api.endpoints import auth, site, user, media, device, device_sync

router = APIRouter()
router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(site.router, prefix="/sites", tags=["sites"])
router.include_router(user.router, prefix="/users", tags=["users"])
router.include_router(media.router, prefix="/media", tags=["media"])
router.include_router(device.router, prefix="/devices", tags=["devices"])
router.include_router(device_sync.router, prefix="/devices", tags=["sync"])