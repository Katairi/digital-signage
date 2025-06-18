#app/services/playlist.py
import os
from typing import List

MEDIA_ROOT = "/app/media"

def generate_playlist(site_name: str) -> str:
    site_path = os.path.join(MEDIA_ROOT, site_name)
    if not os.path.exists(site_path):
        raise FileNotFoundError(f"Le dossier du site {site_name} n'existe pas.")

    # Liste les fichiers valides
    valid_extensions = ('.mp4', '.mov', '.jpg', '.jpeg', '.png')
    media_files = sorted([
        f for f in os.listdir(site_path)
        if f.lower().endswith(valid_extensions)
    ])

    playlist_path = os.path.join(site_path, "playlist.txt")
    with open(playlist_path, "w") as f:
        for file in media_files:
            f.write(f"{file}\n")

    return playlist_path
