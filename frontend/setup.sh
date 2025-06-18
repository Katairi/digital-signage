#!/bin/bash

# Script de configuration pour Digital Signage

echo "🚀 Configuration de Digital Signage..."

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker d'abord."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez installer Docker Compose d'abord."
    exit 1
fi

echo "✅ Docker et Docker Compose sont installés"

# Créer les répertoires nécessaires
echo "📁 Création des répertoires..."
mkdir -p data/media
mkdir -p backend/app/media/{LYON,BALBIGNY,PANISSIERES}/{Accueil,Atelier}

# Copier les fichiers d'environnement
if [ ! -f backend/.env ]; then
    echo "📝 Configuration du backend..."
    cat > backend/.env << EOF
DATABASE_URL=postgresql://postgres:postgres@db:5432/signage_db
SECRET_KEY=your-super-secret-key-change-me-$(openssl rand -hex 32)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
EOF
fi

if [ ! -f frontend/.env ]; then
    echo "📝 Configuration du frontend..."
    cat > frontend/.env << EOF
REACT_APP_API_URL=http://localhost:3040
EOF
fi

# Construire et démarrer les conteneurs
echo "🐳 Construction des images Docker..."
docker-compose build

echo "🚀 Démarrage des services..."
docker-compose up -d

# Attendre que la base de données soit prête
echo "⏳ Attente du démarrage de la base de données..."
sleep 10

# Créer un superadmin par défaut
echo "👤 Création du super administrateur par défaut..."
docker-compose exec backend python -c "
from app.core.database import SessionLocal
from app.models.user import User
from app.services.auth import get_password_hash

db = SessionLocal()
existing = db.query(User).filter(User.email == 'admin@example.com').first()
if not existing:
    admin = User(
        email='admin@example.com',
        hashed_password=get_password_hash('password'),
        role='superadmin'
    )
    db.add(admin)
    db.commit()
    print('✅ Super admin créé : admin@example.com / password')
else:
    print('ℹ️  Super admin existe déjà')
db.close()
"

echo ""
echo "✅ Installation terminée !"
echo ""
echo "📌 URLs d'accès :"
echo "   - Frontend : http://localhost:3000"
echo "   - Backend API : http://localhost:3040"
echo "   - Documentation API : http://localhost:3040/docs"
echo ""
echo "🔐 Identifiants par défaut :"
echo "   - Email : admin@example.com"
echo "   - Mot de passe : password"
echo ""
echo "⚠️  IMPORTANT : Changez le mot de passe par défaut !"
echo ""
echo "📖 Commandes utiles :"
echo "   - Voir les logs : docker-compose logs -f"
echo "   - Arrêter : docker-compose down"
echo "   - Redémarrer : docker-compose restart"