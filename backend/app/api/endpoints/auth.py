# app/api/endpoints/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserRead
from app.services.auth import verify_password, create_access_token, get_password_hash
from app.api.deps import get_db, get_current_user
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    """Authentification de l'utilisateur"""
    print(f"🔐 Tentative de connexion pour: {data.email}")  # Debug
    
    # Rechercher l'utilisateur par email
    user = db.query(User).filter(User.email == data.email).first()
    
    if not user:
        print(f"❌ Utilisateur non trouvé: {data.email}")  # Debug
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Identifiants incorrects"
        )
    
    print(f"✅ Utilisateur trouvé: {user.email}, rôle: {user.role}")  # Debug
    
    # Vérifier le mot de passe
    if not verify_password(data.password, user.hashed_password):
        print(f"❌ Mot de passe incorrect pour: {data.email}")  # Debug
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Identifiants incorrects"
        )
    
    print(f"✅ Mot de passe correct pour: {data.email}")  # Debug
    
    # Créer le token JWT avec toutes les informations nécessaires
    token_data = {
        "sub": user.email,  # Subject (email de l'utilisateur)
        "role": user.role,  # Rôle de l'utilisateur
        "site_id": user.site_id  # ID du site (peut être None pour les superadmins)
    }
    
    print(f"🎫 Création du token avec les données: {token_data}")  # Debug
    
    try:
        token = create_access_token(token_data)
        print(f"✅ Token créé avec succès")  # Debug
        
        return {
            "access_token": token, 
            "token_type": "bearer",
            "user": {
                "email": user.email,
                "role": user.role,
                "site_id": user.site_id
            }
        }
    except Exception as e:
        print(f"❌ Erreur lors de la création du token: {e}")  # Debug
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la création du token"
        )

@router.post("/change-password")
def change_password(
    data: ChangePasswordRequest, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Permet à un utilisateur de changer son mot de passe"""
    print(f"🔑 Changement de mot de passe pour: {current_user.email}")  # Debug
    
    if not verify_password(data.current_password, current_user.hashed_password):
        print(f"❌ Mot de passe actuel incorrect pour: {current_user.email}")  # Debug
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Mot de passe actuel incorrect"
        )
    
    # Valider le nouveau mot de passe
    if len(data.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le nouveau mot de passe doit contenir au moins 8 caractères"
        )
    
    current_user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    
    print(f"✅ Mot de passe changé avec succès pour: {current_user.email}")  # Debug
    
    return {"message": "Mot de passe modifié avec succès"}

@router.get("/me", response_model=UserRead)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Retourne les informations de l'utilisateur connecté"""
    return current_user

@router.get("/debug/users")
def debug_list_users(db: Session = Depends(get_db)):
    """Route de debug pour lister tous les utilisateurs (À SUPPRIMER EN PRODUCTION)"""
    users = db.query(User).all()
    return [
        {
            "email": user.email,
            "role": user.role,
            "site_id": user.site_id,
            "has_password": bool(user.hashed_password)
        } 
        for user in users
    ]