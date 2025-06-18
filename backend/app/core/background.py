# app/core/background.py
import asyncio
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.device import Device
from datetime import datetime, timedelta

async def monitor_devices():
    """Surveillance des devices pour détecter ceux qui sont hors ligne"""
    while True:
        try:
            db: Session = SessionLocal()
            
            # Marquer comme hors ligne les devices qui n'ont pas donné signe de vie depuis 5 minutes
            offline_threshold = datetime.utcnow() - timedelta(minutes=5)
            
            # Vérifier si la table existe (pour éviter l'erreur au démarrage)
            try:
                offline_devices = db.query(Device).filter(
                    Device.last_seen < offline_threshold,
                    Device.is_online == True
                ).all()
                
                for device in offline_devices:
                    device.is_online = False
                    device.is_playing = False
                    print(f"Device {device.name} marqué comme hors ligne")
                
                db.commit()
                
            except Exception as e:
                # Si la table n'existe pas encore, ignorer silencieusement
                if "does not exist" in str(e):
                    print("Tables pas encore créées, attente...")
                else:
                    print(f"Erreur dans la surveillance des devices: {e}")
                db.rollback()
            finally:
                db.close()
                
        except Exception as e:
            print(f"Erreur dans monitor_devices: {e}")
        
        # Attendre 30 secondes avant la prochaine vérification
        await asyncio.sleep(30)