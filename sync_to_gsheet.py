"""
SYNCHRONIZER SPREADSHEET OFFLINE / COMMAND LINE
Grammar Plus B1 - Google Spreadsheet Database Syncer
ID Spreadsheet: 1rTpLFo_QD6-XhcQE43CAZZc3WbI0gkiCXIjhSvg_CPc
Khusus Siswa Tingkat XI dan XII (Fase F)
"""

import os
import sys
import json
import urllib.request

SPREADSHEET_ID = '1rTpLFo_QD6-XhcQE43CAZZc3WbI0gkiCXIjhSvg_CPc'
DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbxEVnJvbx5hXnOuQKtT134tjuD8wtWVIw5ukHXjbcn1X7lOGitlw4YPqWoVOSggRo-p/exec'
SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]

def get_client_credentials():
    creds_file = os.path.join(os.path.dirname(__file__), 'credentials.json')
    if not os.path.exists(creds_file):
        creds_file = r'C:\widio-titip\oracle\dash-arb\credentials.json'
    if os.path.exists(creds_file):
        try:
            import gspread
            from google.oauth2.service_account import Credentials
            creds = Credentials.from_service_account_file(creds_file, scopes=SCOPES)
            return gspread.authorize(creds)
        except Exception as e:
            print(f"Catatan: Gagal otentikasi via credentials.json ({e}). Beralih ke Web App...")
    return None

def fetch_json(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode('utf-8'))

def view_data_via_gas():
    print(f"Mengambil data langsung via Google Apps Script Web App...")
    
    # 1. Siswa
    try:
        res_siswa = fetch_json(f"{DEFAULT_GAS_URL}?action=getStudents")
        siswa_records = res_siswa.get('students', [])
        print(f"\n[DAFTAR SISWA KELAS XI & XII TERDAFTAR] ({len(siswa_records)} Murid):")
        if not siswa_records:
            print("  (Belum ada murid yang mendaftar di sheet Siswa)")
        for idx, s in enumerate(siswa_records, 1):
            nama = s.get('nama') or '-'
            tingkat = s.get('tingkat') or '-'
            rombel = s.get('rombel') or '-'
            presensi = s.get('presensi') or '-'
            print(f"  {idx}. {s.get('username')} | {nama} | Kelas {tingkat}-{rombel} (Presensi {presensi})")
    except Exception as e:
        print(f"Gagal mengambil data siswa: {e}")

    # 2. Nilai
    try:
        res_nilai = fetch_json(f"{DEFAULT_GAS_URL}?action=getScores")
        nilai_records = res_nilai.get('scores', [])
        print(f"\n[REKAP NILAI LATIHAN B1] ({len(nilai_records)} Pengerjaan):")
        if not nilai_records:
            print("  (Belum ada rekapan nilai di sheet Nilai)")
        for idx, n in enumerate(nilai_records[-15:], 1):
            ts = n.get('timestamp') or '-'
            u = n.get('username') or '-'
            uid = n.get('unitId') or '-'
            skor = n.get('skor', 0)
            total = n.get('totalSoal', 0)
            persen = n.get('persentase', '0%')
            status = n.get('status', '-')
            print(f"  {idx}. {ts} | {u} | Unit {uid} | Skor: {skor}/{total} ({persen}) | Status: {status}")
    except Exception as e:
        print(f"Gagal mengambil rekap nilai: {e}")

def view_data():
    client = get_client_credentials()
    if client:
        try:
            sh = client.open_by_key(SPREADSHEET_ID)
            print(f"\n=== SPREADSHEET: {sh.title} (via Google Service Account) ===")
            
            ws_siswa = sh.worksheet("Siswa")
            siswa_records = ws_siswa.get_all_records()
            print(f"\n[DAFTAR SISWA KELAS XI & XII TERDAFTAR] ({len(siswa_records)} Murid):")
            for idx, s in enumerate(siswa_records, 1):
                print(f"  {idx}. {s.get('Username')} | {s.get('Nama Lengkap')} | Kelas {s.get('Tingkat')}-{s.get('Rombel')} (Presensi {s.get('Nomor Presensi')})")

            ws_nilai = sh.worksheet("Nilai")
            nilai_records = ws_nilai.get_all_records()
            print(f"\n[REKAP NILAI LATIHAN B1] ({len(nilai_records)} Pengerjaan):")
            for idx, n in enumerate(nilai_records[-15:], 1):
                print(f"  {idx}. {n.get('Timestamp')} | {n.get('Username')} | Unit {n.get('Unit ID')} | Skor: {n.get('Skor')}/{n.get('Total Soal')} ({n.get('Persentase')}) | Status: {n.get('Status')}")
            return
        except Exception as e:
            print(f"Koneksi gspread gagal: {e}. Beralih ke Web App...")

    # Fallback via Web App
    view_data_via_gas()

if __name__ == '__main__':
    print("Memeriksa data di Google Spreadsheet Grammar Plus B1...")
    view_data()
