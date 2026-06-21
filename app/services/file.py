import os
import uuid
import shutil
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from app import schemas, models
from app.services import crud

def save_and_create_file(db: Session, file: UploadFile) -> models.File:
    """
    Saves a physical file to the uploads directory and creates a File record in the database.
    """
    uploads_dir = "uploads"
    os.makedirs(uploads_dir, exist_ok=True)
    
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
