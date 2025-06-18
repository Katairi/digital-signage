# app/services/site.py
from sqlalchemy.orm import Session
from app.models.site import Site
from app.schemas.site import SiteCreate, SiteUpdate
from typing import List, Optional

def create_site(db: Session, site: SiteCreate) -> Site:
    """Créer un nouveau site"""
    db_site = Site(
        name=site.name,
        address=site.address
    )
    db.add(db_site)
    db.commit()
    db.refresh(db_site)
    return db_site

def get_site_by_id(db: Session, site_id: int) -> Optional[Site]:
    """Récupérer un site par son ID"""
    return db.query(Site).filter(Site.id == site_id).first()

def get_site_by_name(db: Session, name: str) -> Optional[Site]:
    """Récupérer un site par son nom"""
    return db.query(Site).filter(Site.name == name).first()

def get_all_sites(db: Session) -> List[Site]:
    """Récupérer tous les sites"""
    return db.query(Site).all()

def update_site(db: Session, site_id: int, site_update: SiteUpdate) -> Optional[Site]:
    """Mettre à jour un site"""
    site = get_site_by_id(db, site_id)
    if not site:
        return None
    
    update_data = site_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(site, field, value)
    
    db.commit()
    db.refresh(site)
    return site

def delete_site(db: Session, site_id: int) -> bool:
    """Supprimer un site"""
    site = get_site_by_id(db, site_id)
    if not site:
        return False
    
    db.delete(site)
    db.commit()
    return True