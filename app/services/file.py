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
    
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    filepath = os.path.join(uploads_dir, unique_filename).replace("\\", "/")
    
    try:
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    file_size = os.path.getsize(filepath)
    
    # Create File record
    file_in = schemas.FileCreate(
        nama=file.filename,
        jenis=file.content_type,
        ukuran=file_size,
        path=filepath
    )
    db_file = crud.file.create(db, obj_in=file_in)
    return db_file


def delete_file_record(db: Session, file_id: int) -> bool:
    """
    Deletes the physical file and its record from the database.
    """
    file_obj = crud.file.get(db, id=file_id)
    if not file_obj:
        return False
        
    try:
        if file_obj.path and os.path.exists(file_obj.path):
            os.remove(file_obj.path)
    except Exception:
        pass
        
    crud.file.remove(db, id=file_id)
    return True
