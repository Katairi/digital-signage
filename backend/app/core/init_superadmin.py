# app/core/init_superadmin.py
import os
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.user import User
from app.services.auth import get_password_hash

def create_default_superadmin():
    """
    Crée le compte superadmin par défaut s'il n'existe pas déjà.
    Utilise les variables d'environnement pour les identifiants.
    """
    db: Session = SessionLocal()
    try:
        # Récupérer les identifiants depuis les variables d'environnement
        superadmin_email = os.getenv("SUPERADMIN_EMAIL")
        superadmin_password = os.getenv("SUPERADMIN_PASSWORD")
        
        # Vérification des variables d'environnement
        if not superadmin_email or not superadmin_password:
            print("❌ ERREUR: Les variables SUPERADMIN_EMAIL et SUPERADMIN_PASSWORD doivent être définies dans le fichier .env")
            print("📝 Exemple dans .env:")
            print("   SUPERADMIN_EMAIL=admin@votre-domaine.com")
            print("   SUPERADMIN_PASSWORD=VotreMotDePasseSecurise123!")
            return None
        
        # Vérifier si le superadmin existe déjà
        existing_superadmin = db.query(User).filter(
            User.email == superadmin_email,
            User.role == "superadmin"
        ).first()
        
        if existing_superadmin:
            print(f"✅ Superadmin existe déjà avec l'email: {superadmin_email}")
            return existing_superadmin
        
        # Vérifier s'il existe déjà un autre superadmin
        any_superadmin = db.query(User).filter(User.role == "superadmin").first()
        if any_superadmin:
            print(f"✅ Un superadmin existe déjà avec l'email: {any_superadmin.email}")
            return any_superadmin
        
        # Validation basique du mot de passe
        if len(superadmin_password) < 8:
            print("❌ ERREUR: Le mot de passe du superadmin doit contenir au moins 8 caractères")
            return None
        
        # Créer le nouveau superadmin
        hashed_password = get_password_hash(superadmin_password)
        superadmin = User(
            email=superadmin_email,
            hashed_password=hashed_password,
            role="superadmin",
            site_id=None  # Le superadmin n'est associé à aucun site spécifique
        )
        
        db.add(superadmin)
        db.commit()
        db.refresh(superadmin)
        
        print(f"🎉 Superadmin créé avec succès !")
        print(f"📧 Email: {superadmin_email}")
        print(f"🔐 Mot de passe: [CONFIDENTIEL - défini via variable d'environnement]")
        print(f"⚠️  IMPORTANT: Changez ce mot de passe après votre première connexion !")
        
        return superadmin
        
    except Exception as e:
        db.rollback()
        print(f"❌ Erreur lors de la création du superadmin: {e}")
        raise e
    finally:
        db.close()

def verify_superadmin_exists():
    """
    Vérifie qu'au moins un superadmin existe dans la base de données.
    Retourne True si un superadmin existe, False sinon.
    """
    db: Session = SessionLocal()
    try:
        superadmin = db.query(User).filter(User.role == "superadmin").first()
        return superadmin is not None
    except Exception as e:
        print(f"❌ Erreur lors de la vérification du superadmin: {e}")
        return False
    finally:
        db.close()

def get_superadmin_info():
    """
    Retourne les informations du superadmin (sans le mot de passe).
    Utile pour l'affichage de debug ou la documentation.
    """
    db: Session = SessionLocal()
    try:
        superadmin = db.query(User).filter(User.role == "superadmin").first()
        if superadmin:
            return {
                "email": superadmin.email,
                "role": superadmin.role,
                "exists": True
            }
        return {"exists": False}
    except Exception as e:
        print(f"❌ Erreur lors de la récupération des infos superadmin: {e}")
        return {"exists": False, "error": str(e)}
    finally:
        db.close()

if __name__ == "__main__":
    create_default_superadmin()