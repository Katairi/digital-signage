# app/services/media.py
import os
import shutil
from fastapi import UploadFile
from typing import List

MEDIA_ROOT = "/app/media"

def save_file(file: UploadFile, site_name: str, replace: bool = False) -> str:
    """Sauvegarder un fichier média"""
    site_dir = os.path.join(MEDIA_ROOT, site_name)
    os.makedirs(site_dir, exist_ok=True)
    
    file_path = os.path.join(site_dir, file.filename)
    
    if os.path.exists(file_path) and not replace:
        raise FileExistsError("File already exists")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return file_path

def list_files(site_name: str) -> List[str]:
    """Lister les fichiers d'un site"""
    site_dir = os.path.join(MEDIA_ROOT, site_name)
    if not os.path.exists(site_dir):
        return []
    
    files = []
    for filename in os.listdir(site_dir):
        file_path = os.path.join(site_dir, filename)
        if os.path.isfile(file_path):
            files.append(filename)
    
    return files

def delete_file(site_name: str, filename: str):
    """Supprimer un fichier"""
    file_path = os.path.join(MEDIA_ROOT, site_name, filename)
    if os.path.exists(file_path):
        os.remove(file_path)