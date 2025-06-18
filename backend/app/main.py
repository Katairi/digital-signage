# =============================================================================
# DIGITAL SIGNAGE API - MAIN APPLICATION
# =============================================================================
# Application FastAPI principale pour la gestion des écrans Raspberry Pi
# Intègre le frontend React et expose l'API backend
# =============================================================================

import os
import asyncio
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.exceptions import HTTPException

# Imports de l'application
from app.core.config import settings, print_config_summary
from app.core.database import Base, engine
from app.core.background import monitor_devices
from app.core.init_superadmin import create_default_superadmin
from app.api.routes import router as api_router

# Import des modèles pour qu'ils soient reconnus par SQLAlchemy
from app.models.site import Site
from app.models.user import User
from app.models.device import Device

# =============================================================================
# CONFIGURATION DE L'APPLICATION FASTAPI
# =============================================================================

app = FastAPI(
    title="Digital Signage API",
    description="Backend pour la gestion dynamique des écrans Raspberry Pi",
    version="1.0.0",
    docs_url="/api/docs",  # Documentation Swagger accessible via /api/docs
    redoc_url="/api/redoc",  # Documentation ReDoc accessible via /api/redoc
)

# =============================================================================
# CONFIGURATION DES MIDDLEWARES
# =============================================================================

# Middleware CORS pour autoriser les requêtes cross-origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # À restreindre en production avec votre domaine
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================================================
# ROUTES DE L'API (DOIT ÊTRE AVANT LES FICHIERS STATIQUES)
# =============================================================================

# Toutes les routes API sont préfixées par /api
# Exemple : GET /api/sites, POST /api/auth/login, etc.
app.include_router(api_router, prefix="/api")

# =============================================================================
# CONFIGURATION DES ROUTES STATIQUES
# =============================================================================

# Servir les fichiers média uploadés (images, vidéos, etc.)
# Les médias seront accessibles via /media/
if os.path.exists("media"):
    app.mount("/media", StaticFiles(directory="media"), name="media")
    print("✅ Dossier média monté sur /media")

# =============================================================================
# GESTION SPA (SINGLE PAGE APPLICATION) - REACT ROUTER
# =============================================================================

# Custom StaticFiles pour gérer le fallback HTML5 History API
class SPAStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        try:
            return await super().get_response(path, scope)
        except HTTPException as ex:
            if ex.status_code == 404:
                # Si le fichier n'existe pas, retourner index.html (pour React Router)
                return await super().get_response("index.html", scope)
            else:
                raise ex

# Servir le frontend React avec support SPA
if os.path.exists("static"):
    app.mount("/", SPAStaticFiles(directory="static", html=True), name="frontend")
    print("✅ Frontend React monté avec support SPA")
else:
    print("⚠️  Dossier 'static' non trouvé - Frontend non disponible")

# =============================================================================
# ROUTE DE HEALTH CHECK
# =============================================================================

@app.get("/health")
async def health_check():
    """Point de contrôle pour vérifier que l'API fonctionne"""
    return {
        "status": "healthy",
        "service": "Digital Signage API",
        "version": "1.0.0"
    }

# =============================================================================
# GESTION DES ERREURS 404 POUR LES ROUTES NON-API
# =============================================================================

@app.exception_handler(404)
async def custom_404_handler(request: Request, exc: HTTPException):
    """Gestionnaire personnalisé pour les erreurs 404"""
    path = request.url.path
    
    # Si c'est une route API, retourner l'erreur JSON normale
    if path.startswith("/api/"):
        return {"detail": "Not Found"}
    
    # Pour toutes les autres routes, servir index.html (React Router)
    if os.path.exists("static/index.html"):
        return FileResponse("static/index.html")
    else:
        return {"detail": "Frontend not available"}

# =============================================================================
# ÉVÉNEMENTS DE CYCLE DE VIE DE L'APPLICATION
# =============================================================================

@app.on_event("startup")
async def startup_event():
    """Actions à effectuer au démarrage de l'application"""
    print("🚀 Démarrage de Digital Signage API...")
    
    # Afficher la configuration
    print_config_summary()
    
    # Créer toutes les tables de base de données
    print("📊 Création des tables de base de données...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Tables créées avec succès")
    except Exception as e:
        print(f"❌ Erreur lors de la création des tables : {e}")
    
    # Créer le superadmin par défaut s'il n'existe pas
    print("👤 Vérification du superadmin par défaut...")
    try:
        create_default_superadmin()
        print("✅ Superadmin configuré")
    except Exception as e:
        print(f"❌ Erreur lors de la création du superadmin : {e}")
    
    # Lancer le monitoring des devices en arrière-plan
    print("📡 Démarrage du monitoring des devices...")
    try:
        asyncio.create_task(monitor_devices())
        print("✅ Monitoring des devices démarré")
    except Exception as e:
        print(f"❌ Erreur lors du démarrage du monitoring : {e}")
    
    print("🎉 Digital Signage API démarré avec succès !")
    print(f"📋 Documentation API : https://signage.pntserv.fr/api/docs")

@app.on_event("shutdown")
async def shutdown_event():
    """Actions à effectuer à l'arrêt de l'application"""
    print("🛑 Arrêt de Digital Signage API...")
    print("✅ Application arrêtée proprement")

# =============================================================================
# POINTS D'ACCÈS DE L'APPLICATION
# =============================================================================
# 🌐 Frontend React    : https://signage.pntserv.fr/
# 🔧 API Backend      : https://signage.pntserv.fr/api/
# 📚 Documentation    : https://signage.pntserv.fr/api/docs
# 📂 Fichiers média   : https://signage.pntserv.fr/media/
# 🏥 Health Check     : https://signage.pntserv.fr/health
# =============================================================================