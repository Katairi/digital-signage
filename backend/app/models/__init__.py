# app/models/__init__.py
# Importer tous les modèles pour qu'ils soient reconnus par SQLAlchemy
from app.models.site import Site
from app.models.user import User  
from app.models.device import Device

# S'assurer que tous les modèles sont enregistrés
__all__ = ["Site", "User", "Device"]