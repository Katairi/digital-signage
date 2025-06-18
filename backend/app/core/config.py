# app/core/config.py
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Configuration de l'application Digital Signage"""
    
    # Variables obligatoires
    database_url: str
    secret_key: str
    
    # Variables avec valeurs par défaut
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    
    # Variables du superadmin
    superadmin_email: Optional[str] = None
    superadmin_password: Optional[str] = None
    
    # Variables optionnelles
    domain: Optional[str] = None
    base_url: Optional[str] = None
    debug: bool = False
    serve_frontend: bool = True
    log_level: str = "INFO"
    
    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
        "extra": "ignore"
    }

settings = Settings()

def print_config_summary():
    """Affiche un résumé de la configuration au démarrage"""
    print("🔧 Configuration de l'application:")
    print(f"   🌐 Domaine: {settings.domain or 'Non défini'}")
    print(f"   🗄️  Base de données: Configurée")
    print(f"   🔐 JWT: {settings.algorithm}, expire dans {settings.access_token_expire_minutes}min")
    print(f"   📜 Log level: {settings.log_level}")
    
    if settings.superadmin_email:
        print(f"   👤 Superadmin: {settings.superadmin_email}")
    
    if settings.debug:
        print("   ⚠️  Mode DEBUG activé")
    else:
        print("   🚀 Mode PRODUCTION")