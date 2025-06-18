#app/api/endpoints/media.py
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, require_admin_or_superadmin
from app.services import media
from app.schemas.media import MediaList
from typing import List

router = APIRouter()

@router.post("/upload", summary="Uploader un fichier média")
async def upload_file(
    site_name: str = Form(...),
    replace: bool = Form(False),
    file: UploadFile = File(...),
    current_user=Depends(require_admin_or_superadmin),
):
    try:
        path = media.save_file(file, site_name, replace=replace)
        return {"status": "success", "file_path": path}
    except FileExistsError:
        raise HTTPException(status_code=409, detail="Fichier déjà existant")

@router.get("/list", response_model=MediaList, summary="Lister les fichiers")
def list_media(site_name: str, current_user=Depends(require_admin_or_superadmin)):
    files = media.list_files(site_name)
    return {"files": [{"filename": f, "site_name": site_name} for f in files]}

@router.delete("/delete", summary="Supprimer un fichier")
def delete_file(site_name: str, filename: str, current_user=Depends(require_admin_or_superadmin)):
    media.delete_file(site_name, filename)
    return {"status": "deleted", "file": filename}
