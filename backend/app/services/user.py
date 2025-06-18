# app/services/user.py
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.services.auth import get_password_hash
from typing import List, Optional

def create_user(db: Session, user: UserCreate) -> User:
    """Créer un nouvel utilisateur"""
    hashed_password = get_password_hash(user.password)
    
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        role=user.role,
        site_id=user.site_id
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Récupérer un utilisateur par son email"""
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """Récupérer un utilisateur par son ID"""
    return db.query(User).filter(User.id == user_id).first()

def get_all_users(db: Session) -> List[User]:
    """Récupérer tous les utilisateurs"""
    return db.query(User).all()

def update_user(db: Session, user_id: int, user_update: UserUpdate) -> Optional[User]:
    """Mettre à jour un utilisateur"""
    user = get_user_by_id(db, user_id)
    if not user:
        return None
    
    update_data = user_update.dict(exclude_unset=True)
    
    # Si un nouveau mot de passe est fourni, le hasher
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data["password"])
        del update_data["password"]
    
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    return user

def delete_user(db: Session, user_id: int) -> bool:
    """Supprimer un utilisateur"""
    user = get_user_by_id(db, user_id)
    if not user:
        return False
    
    db.delete(user)
    db.commit()
    return True