# app/api/endpoints/user.py 
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.services.user import create_user, get_user_by_email, get_all_users, update_user, delete_user
from app.api.deps import get_db, require_superadmin, get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=UserRead)
def create_new_user(
    user: UserCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(require_superadmin)
):
    """Créer un nouvel utilisateur (seul le superadmin peut le faire)"""
    existing_user = get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Un utilisateur avec cet email existe déjà")
    
    return create_user(db, user)

@router.get("/", response_model=List[UserRead])
def list_users(
    db: Session = Depends(get_db), 
    current_user: User = Depends(require_superadmin)
):
    """Lister tous les utilisateurs (seul le superadmin peut le faire)"""
    return get_all_users(db)

@router.get("/{user_id}", response_model=UserRead)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_superadmin)
):
    """Récupérer un utilisateur par son ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return user

@router.put("/{user_id}", response_model=UserRead)
def update_user_info(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_superadmin)
):
    """Modifier un utilisateur (seul le superadmin peut le faire)"""
    user = update_user(db, user_id, user_update)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return user

@router.delete("/{user_id}")
def delete_user_account(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_superadmin)
):
    """Supprimer un utilisateur (seul le superadmin peut le faire)"""
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Vous ne pouvez pas supprimer votre propre compte")
    
    success = delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    return {"message": "Utilisateur supprimé avec succès"}