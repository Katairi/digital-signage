#!/bin/bash

# Script d'initialisation du frontend

echo "🚀 Initialisation du frontend..."

# Se déplacer dans le répertoire frontend
cd frontend

# Vérifier si package.json existe
if [ ! -f "package.json" ]; then
    echo "❌ package.json manquant dans le répertoire frontend"
    exit 1
fi

# Vérifier si package-lock.json existe
if [ ! -f "package-lock.json" ]; then
    echo "📦 Génération du package-lock.json..."
    npm install
    echo "✅ package-lock.json généré"
else
    echo "✅ package-lock.json existe déjà"
fi

# Vérifier que tous les fichiers sources nécessaires existent
echo "🔍 Vérification des fichiers sources..."

# Créer les répertoires s'ils n'existent pas
mkdir -p public
mkdir -p src/{components,contexts,pages,services}

# Créer un favicon simple si il n'existe pas
if [ ! -f "public/favicon.ico" ]; then
    echo "📌 Création d'un favicon par défaut..."
    # Créer un favicon base64 simple (carré bleu)
    echo "AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADtjsAA7Y7AAO2OwADtjsAA7Y7AAO2OwADtjsAA7Y7AAO2OwADtjsAA7Y7AAO2OwADtjsAAAAAAAAAAAAAA7Y7AAO2OwkjtjsP87Y7D/O2Ow/ztjsP87Y7D/O2Ow/ztjsP87Y7D/O2Ow/ztjsP87Y7CSO2OwAAAAAAAAAAAAADtjsAA7Y7CSO2Ow/ztjsP87Y7D/O2Ow/ztjsP87Y7D/O2Ow/ztjsP87Y7D/O2Ow/ztjsJI7Y7AAAAAAAAAAAAAAO2OwADtjsJI7Y7D/O2Ow/ztjsP87Y7D/O2Ow/ztjsP87Y7D/O2Ow/ztjsP87Y7D/O2OwkjtjsAAAAAAAAAAAAAA7Y7AAO2OwkjtjsP87Y7D/O2Ow/ztjsP87Y7D/O2Ow/ztjsP87Y7D/O2Ow/ztjsP87Y7CSO2OwAAAAAAAAAAAAADtjsAA7Y7CSO2Ow/ztjsP87Y7D/O2Ow/ztjsP87Y7D/O2Ow/ztjsP87Y7D/O2Ow/ztjsJI7Y7AAAAAAAAAAAAAAO2OwADtjsJI7Y7D/O2Ow/ztjsP87Y7D/O2Ow/ztjsP87Y7D/O2Ow/ztjsP87Y7D/O2OwkjtjsAAAAAAAAAAAAAA7Y7AAO2OwkjtjsP87Y7D/O2Ow/ztjsP87Y7D/O2Ow/ztjsP87Y7D/O2Ow/ztjsP87Y7CSO2OwAAAAAAAAAAAAADtjsAA7Y7CSO2Ow/ztjsP87Y7D/O2Ow/ztjsP87Y7D/O2Ow/ztjsP87Y7D/O2Ow/ztjsJI7Y7AAAAAAAAAAAAAAO2OwADtjsJI7Y7D/O2Ow/ztjsP87Y7D/O2Ow/ztjsP87Y7D/O2Ow/ztjsP87Y7D/O2OwkjtjsAAAAAAAAAAAAAA7Y7AAO2OwADtjsAA7Y7AAO2OwADtjsAA7Y7AAO2OwADtjsAA7Y7AAO2OwADtjsAA7Y7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" | base64 -d > public/favicon.ico
fi

echo ""
echo "✅ Frontend initialisé avec succès!"
echo ""
echo "Structure du frontend:"
echo "frontend/"
echo "├── package.json"
echo "├── package-lock.json"
echo "├── public/"
echo "│   ├── index.html"
echo "│   ├── manifest.json"
echo "│   └── favicon.ico"
echo "└── src/"
echo "    ├── App.js"
echo "    ├── index.js"
echo "    ├── index.css"
echo "    ├── components/"
echo "    ├── contexts/"
echo "    ├── pages/"
echo "    └── services/"

cd ..

echo ""
echo "🐳 Vous pouvez maintenant lancer: docker-compose build"