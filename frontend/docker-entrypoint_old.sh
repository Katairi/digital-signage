#!/bin/sh
set -e

echo "🚀 Démarrage du frontend Digital Signage..."

# Remplacer les variables d'environnement dans le build React
if [ ! -z "$REACT_APP_API_URL" ]; then
  echo "📡 Configuration de l'URL API: $REACT_APP_API_URL"
  
  # Remplacer dans tous les fichiers JS du build
  find /usr/share/nginx/html -name "*.js" -exec sed -i "s|http://localhost:3040|$REACT_APP_API_URL|g" {} \;
  find /usr/share/nginx/html -name "*.js" -exec sed -i "s|http://192.168.1.200:3040|$REACT_APP_API_URL|g" {} \;
  
  echo "✅ Configuration de l'API terminée"
else
  echo "⚠️  Variable REACT_APP_API_URL non définie, utilisation de la valeur par défaut"
fi

echo "🌐 Démarrage de Nginx..."

# Démarrer nginx en mode foreground
exec nginx -g "daemon off;"