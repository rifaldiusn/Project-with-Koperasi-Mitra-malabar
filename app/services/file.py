import os
import uuid
import shutil
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from app import schemas, models
from app.services import crud

from dotenv import load_dotenv
load_dotenv()

from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload

def get_drive_service():
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    refresh_token = os.getenv("GOOGLE_REFRESH_TOKEN")

    if not all([client_id, client_secret, refresh_token]):
        raise HTTPException(status_code=500, detail="GDrive OAuth credentials not configured")

    creds = Credentials(
        token=None,  
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=client_id,
        client_secret=client_secret,
        scopes=["https://www.googleapis.com/auth/drive.file"]
    )
    creds.refresh(Request())

    return build('drive', 'v3', credentials=creds)

def save_and_create_file(db: Session, file: UploadFile, folder_id: str = None) -> models.File:
    service = get_drive_service()
    
    file_metadata = {'name': file.filename}

    target_folder_id = folder_id or os.getenv("GDRIVE_FOLDER_ID")
    if target_folder_id:
        file_metadata['parents'] = [target_folder_id]
    
    media = MediaIoBaseUpload(file.file, mimetype=file.content_type, resumable=True)
    
    try:
        uploaded_file = service.files().create(
            body=file_metadata, 
            media_body=media, 
            fields='id, webViewLink, size',
            supportsAllDrives=True
        ).execute()
        
        service.permissions().create(
            fileId=uploaded_file.get('id'), 
            body={'type': 'anyone', 'role': 'reader'},
            supportsAllDrives=True
        ).execute()
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload to GDrive: {str(e)}")
    
    # Create File record
    file_in = schemas.FileCreate(
        nama=file.filename,
        jenis=file.content_type,
        ukuran=int(uploaded_file.get("size", getattr(file, "size", 0) or 0)),
        path=uploaded_file.get("webViewLink")
    )
    db_file = crud.file.create(db, obj_in=file_in)
    return db_file

def extract_file_id_from_url(url: str) -> str:
    import re
    match = re.search(r'/d/([a-zA-Z0-9_-]+)', url)
    if match:
        return match.group(1)
    match = re.search(r'id=([a-zA-Z0-9_-]+)', url)
    if match:
        return match.group(1)
    return None

def delete_file_record(db: Session, file_id: int) -> bool:
    """
    Deletes the file from GDrive and its record from the database.
    """
    file_obj = crud.file.get(db, id=file_id)
    if not file_obj:
        return False
        
    try:
        if file_obj.path and "google.com" in file_obj.path:
            gdrive_file_id = extract_file_id_from_url(file_obj.path)
            if gdrive_file_id:
                service = get_drive_service()
                service.files().delete(fileId=gdrive_file_id, supportsAllDrives=True).execute()
    except Exception as e:
        print(f"Warning: Failed to delete file from GDrive: {str(e)}")
        
    crud.file.remove(db, id=file_id)
    return True

