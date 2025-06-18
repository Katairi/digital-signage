# =============================================================================
# DOCKERFILE UNIQUE POUR LE PROJET DIGITAL SIGNAGE
# =============================================================================
# Ce Dockerfile utilise un multi-stage build pour :
# 1. Construire le frontend React dans un conteneur Node.js
# 2. Intégrer le build du frontend dans le backend Python FastAPI
# Résultat : Un seul conteneur qui sert le frontend ET l'API backend
# =============================================================================

# =============================================================================
# STAGE 1 : BUILD DU FRONTEND REACT
# =============================================================================
FROM node:18-alpine AS frontend-build

# Définir le répertoire de travail pour le frontend
WORKDIR /app/frontend

# Copier les fichiers de dépendances Node.js (package.json et package-lock.json)
# On copie d'abord ces fichiers pour optimiser le cache Docker
COPY frontend/package.json frontend/package-lock.json ./

# Installer les dépendances Node.js
# npm ci est plus rapide et plus sûr que npm install pour la production
RUN npm ci --only=production

# Copier tout le code source du frontend
COPY frontend/ .

# Définir la variable d'environnement pour l'URL de l'API
# Comme le frontend et backend sont maintenant sur le même domaine,
# on peut utiliser des chemins relatifs
ENV REACT_APP_API_URL=/api
ARG REACT_APP_API_URL=/api

# Construire l'application React pour la production
# Cela génère les fichiers optimisés dans le dossier /app/frontend/build
RUN npm run build

# =============================================================================
# STAGE 2 : BACKEND PYTHON AVEC FRONTEND INTÉGRÉ
# =============================================================================
FROM python:3.11-slim

# Définir le répertoire de travail pour le backend
WORKDIR /app

# Mettre à jour les paquets système et installer les dépendances nécessaires
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copier le fichier des dépendances Python
COPY backend/requirements.txt .

# Installer les dépendances Python
# --no-cache-dir évite de stocker le cache pip dans l'image
RUN pip install --no-cache-dir -r requirements.txt

# Copier tout le code source du backend
COPY backend/ .

# 🎯 ÉTAPE CLÉ : Copier le build du frontend React dans le dossier static
# Le backend FastAPI (main.py) est configuré pour servir ces fichiers statiques
# via : app.mount("/static", StaticFiles(directory="static", html=True))
COPY --from=frontend-build /app/frontend/build ./static

# Créer un utilisateur non-root pour la sécurité (optionnel mais recommandé)
RUN useradd --create-home --shell /bin/bash app
RUN chown -R app:app /app
USER app

# Exposer le port 8000 (port par défaut d'Uvicorn)
EXPOSE 8000

# 🚀 Commande de démarrage du serveur FastAPI
# --host 0.0.0.0 : écoute sur toutes les interfaces réseau
# --port 8000 : port d'écoute
# app.main:app : module Python et instance FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# =============================================================================
# RÉSULTAT FINAL :
# =============================================================================
# ✅ Frontend React buildé et intégré dans le backend
# ✅ Un seul conteneur qui sert :
#    - Le frontend React sur http://domaine.com/
#    - L'API FastAPI sur http://domaine.com/api/
# ✅ Optimisé pour la production avec des couches Docker mises en cache
# ✅ Sécurisé avec un utilisateur non-root
# =============================================================================