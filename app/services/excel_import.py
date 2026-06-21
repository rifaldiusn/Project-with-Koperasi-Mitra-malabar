import pandas as pd
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app import models, schemas
from app.services import crud


def read_excel_file(file: UploadFile) -> pd.DataFrame:
    """
    Membaca file Excel dan mengembalikan DataFrame pandas.
    """
    try:
        df = pd.read_excel(file.file)
        return df
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Gagal membaca file Excel: {str(e)}")


def import_from_excel(db: Session, df: pd.DataFrame) -> Dict[str, Any]:
    """
    Import data Produk dan Variasi dari DataFrame ke database.
    Berdasarkan struktur file Excel asli: parentskudetail.20260604_20260604.xlsx
    """
    results = {
        "produk": {
            "total": 0,
            "success": 0,
            "failed": 0,
            "errors": []
        },
        "variasi": {
            "total": 0,
            "success": 0,
            "failed": 0,
            "errors": []
        }
    }

    # Group by Kode Produk untuk mendapatkan Produk unik
    produk_groups = df.groupby("Kode Produk", dropna=False)
    results["produk"]["total"] = len(produk_groups)

    # Mapping untuk id_produk berdasarkan kode
    kode_to_id_produk = {}

    # Process Produk terlebih dahulu
    for kode_produk, group in produk_groups:
        try:
            if pd.isna(kode_produk) or str(kode_produk).strip() == "":
                continue

            kode_produk = str(kode_produk).strip()
            # Ambil baris pertama untuk data Produk
            first_row = group.iloc[0]
            
            nama_produk = str(first_row.get("Produk", "")).strip() if pd.notna(first_row.get("Produk")) else None
            status_produk = str(first_row.get("Status Produk Saat Ini", "")).strip() if pd.notna(first_row.get("Status Produk Saat Ini")) else None

            # Cek apakah produk sudah ada
            existing_produk = db.query(models.Produk).filter(models.Produk.kode == kode_produk).first()
            
            if existing_produk:
                # Update existing produk
                produk_update = schemas.ProdukUpdate(
                    nama=nama_produk if nama_produk else existing_produk.nama,
                    status=status_produk if status_produk else existing_produk.status
                )
                updated_produk = crud.produk.update(db, db_obj=existing_produk, obj_in=produk_update)
                kode_to_id_produk[kode_produk] = updated_produk.id_produk
            else:
                # Create new produk
                produk_create = schemas.ProdukCreate(
                    kode=kode_produk,
                    nama=nama_produk,
                    status=status_produk
                )
                new_produk = crud.produk.create(db, obj_in=produk_create)
                kode_to_id_produk[kode_produk] = new_produk.id_produk
            
            results["produk"]["success"] += 1
        except Exception as e:
            results["produk"]["failed"] += 1
            results["produk"]["errors"].append({
                "kode_produk": kode_produk if 'kode_produk' in locals() else "Unknown",
                "error": str(e)
            })

    # Process Variasi
    results["variasi"]["total"] = len(df)
    for index, row in df.iterrows():
        try:
            # Ambil Kode Variasi (gunakan kolom pertama "Kode Variasi")
            kode_variasi = str(row.get("Kode Variasi", "")).strip() if pd.notna(row.get("Kode Variasi")) else None
            kode_produk = str(row.get("Kode Produk", "")).strip() if pd.notna(row.get("Kode Produk")) else None
            
            if not kode_variasi or kode_variasi == "":
                continue

            nama_variasi = str(row.get("Nama Variasi", "")).strip() if pd.notna(row.get("Nama Variasi")) else None
            status_variasi_str = str(row.get("Status Variasi Saat Ini", "")).strip() if pd.notna(row.get("Status Variasi Saat Ini")) else None
            
            # Konversi status ke integer (contoh: "Normal" → 1, "Dihapus" → 0)
            status_variasi = None
            if status_variasi_str:
                if status_variasi_str.lower() in ["normal", "aktif"]:
                    status_variasi = 1
                elif status_variasi_str.lower() in ["dihapus", "nonaktif"]:
                    status_variasi = 0

            # Dapatkan id_produk
            id_produk = kode_to_id_produk.get(kode_produk) if kode_produk else None

            # Cek apakah variasi sudah ada
            existing_variasi = db.query(models.Variasi).filter(models.Variasi.kode == kode_variasi).first()
            
            if existing_variasi:
                # Update existing variasi
                variasi_update = schemas.VariasiUpdate(
                    nama=nama_variasi if nama_variasi else existing_variasi.nama,
                    status=status_variasi if status_variasi is not None else existing_variasi.status,
                    id_produk=id_produk if id_produk is not None else existing_variasi.id_produk
                )
                crud.variasi.update(db, db_obj=existing_variasi, obj_in=variasi_update)
            else:
                # Create new variasi
                variasi_create = schemas.VariasiCreate(
                    kode=kode_variasi,
                    nama=nama_variasi,
                    status=status_variasi,
                    id_produk=id_produk
                )
                crud.variasi.create(db, obj_in=variasi_create)
            
            results["variasi"]["success"] += 1
        except Exception as e:
            results["variasi"]["failed"] += 1
            results["variasi"]["errors"].append({
                "baris": index + 2,
                "error": str(e)
            })

    return results
