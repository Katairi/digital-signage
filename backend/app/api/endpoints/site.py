# app/api/endpoints/site.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.site import SiteCreate, SiteRead, SiteUpdate
from app.services.site import (
    create_site, get_site_by_id, get_site_by_name, 
    get_all_sites, update_site, delete_site
)
from app.api.deps import get_db, require_superadmin, get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=SiteRead)
def create_new_site(
    site: SiteCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(require_superadmin)
):
    """Créer un nouveau site (seul le superadmin peut le faire)"""
    existing_site = get_site_by_name(db, site.name)
    if existing_site:
        raise HTTPException(status_code=400, detail="Un site avec ce nom existe déjà")
    
    return create_site(db, site)

@router.get("/", response_model=List[SiteRead])
def list_sites(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Lister tous les sites (accessible à tous les utilisateurs connectés)"""
    return get_all_sites(db)

@router.get("/{site_id}", response_model=SiteRead)
def get_site(
    site_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer un site par son ID"""
    site = get_site_by_id(db, site_id)
    if not site:
        raise HTTPException(status_code=404, detail="Site non trouvé")
    return site

@router.put("/{site_id}", response_model=SiteRead)
def update_site_info(
    site_id: int,
    site_update: SiteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_superadmin)
):
    """Modifier un site (seul le superadmin peut le faire)"""
    site = update_site(db, site_id, site_update)
    if not site:
        raise HTTPException(status_code=404, detail="Site non trouvé")
    return site

@router.delete("/{site_id}")
def delete_site_endpoint(
    site_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_superadmin)
):
    """Supprimer un site (seul le superadmin peut le faire)"""
    success = delete_site(db, site_id)
    if not success:
        raise HTTPException(status_code=404, detail="Site non trouvé")
    
    return {"message": "Site supprimé avec succès"}