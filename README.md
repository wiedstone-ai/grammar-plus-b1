# GRAMMAR PLUS B1 - WEB LEARNING PORTAL & EXERCISE SYSTEM
**Berdasarkan Buku:** *Grammar Plus B1 - Panduan dan Latihan Tata Bahasa Inggris* (Sarah Jane Lewis, Kesaint Blanc Publishing)  
**Tingkat Pembelajaran:** Khusus Siswa **Tingkat XI dan XII (Kurikulum Merdeka Fase F)**  
**Database Spreadsheet:** [https://docs.google.com/spreadsheets/d/1rTpLFo_QD6-XhcQE43CAZZc3WbI0gkiCXIjhSvg_CPc](https://docs.google.com/spreadsheets/d/1rTpLFo_QD6-XhcQE43CAZZc3WbI0gkiCXIjhSvg_CPc)  
**Web App API (Aktif & Otomatis):** `https://script.google.com/macros/s/AKfycbxEVnJvbx5hXnOuQKtT134tjuD8wtWVIw5ukHXjbcn1X7lOGitlw4YPqWoVOSggRo-p/exec`  
**Desain:** Strict Light Background (Putih Bersih Kontras Tinggi, Elegan, Modern).

---

## 🌟 Fitur Utama Sistem

1. **Sistematika Pembelajaran 40 Unit (CEFR B1 / PET)**:
   - Disusun persis mengikuti urutan silabus buku *Grammar Plus B1* dari Unit 1 sampai Unit 40.
   - **3 Unit Awal Lengkap (Unit 1, 2, 3)**:
     - **Unit 1: to be: Jawaban singkat; There is / There are** (9 latihan lengkap, soal isian, pilihan ganda, naskah audio TR 2, dan 4 soal bergambar kontekstual).
     - **Unit 2: a / an; Bentuk jamak; Kata tunjuk** (9 latihan lengkap, aturan a/an, bentuk jamak reguler & ireguler, kata tunjuk *this/that/these/those*, audio TR 3, TR 4, TR 5).
     - **Unit 3: the (The Definite Article)** (6 latihan lengkap, aturan penggunaan *the*, pengecualian, audio TR 6, wacana renang bergambar).
   - **Unit 4 sampai Unit 40**: Telah disiapkan seluruh strukturnya mencakup judul Indonesia, judul Inggris, kategori tata bahasa, halaman buku, dan latihan penjajakan awal.
   - **Lampiran A**: Kamus interaktif *Irregular Verbs* (Bentuk Dasar, Past Simple V2, Past Participle V3, dan Arti Bahasa Indonesia).
   - **Lampiran B**: Alfabet Fonetis Internasional (*IPA*) dan Tanda Baca Baku Bahasa Inggris.
   - **Naskah Rekaman Audio (Audio Scripts)**: Transkrip lengkap audio latihan dari buku.

2. **Aturan Baku Registrasi Siswa (Khusus Kelas XI & XII)**:
   - Kolom isian wajib:
     - **Tingkat**: Pilihan khusus `XI` atau `XII` *(Tingkat X tidak diizinkan mendaftar)*.
     - **Fase**: `F` (Kurikulum Merdeka Tingkat Lanjut).
     - **Rombel**: Isian angka `1` sampai `12`.
     - **Nomor Presensi**: Isian angka `1` sampai `37`.
     - **Nama Lengkap**: Otomatis dikonversi ke huruf kapital.
     - **Tanggal Lahir**: Dipilih melalui kalender.
   - **Kata Sandi Otomatis (Format DDMMYYYY)**:
     - Kata sandi login dibuat otomatis dari tanggal lahir berformat **`DDMMYYYY`** (misal lahir `14 Oktober 2007` -> kata sandi: **`14102007`**).
   - **Formula Pembuatan Username**:
     - 3 huruf depan nama lengkap disambung format tanggal lahir `DDMMYYYY`.
     - *Contoh*: Siswa bernama `BUDI SANTOSO` lahir tanggal `14 Oktober 2007` akan memperoleh username `BUD14102007`.
     - *Penanganan Duplikasi*: Jika ada nama dan tanggal lahir yang sama, sistem otomatis menambahkan akhiran huruf alfabet `A`, `B`, `C`, dan seterusnya (misal: `BUD14102007A`).

3. **Akses Latihan Terproteksi & Penilaian Otomatis**:
   - Latihan dan evaluasi hanya dapat diakses oleh murid yang telah mendaftar sendiri atau didaftarkan oleh guru.
   - Pengerjaan soal interaktif dilengkapi evaluasi seketika (*instant feedback*), petunjuk (*hint*), pembahasan komprehensif, dan batas KKM kelulusan 75%.

4. **Rekaman Capaian Siswa & Cetak Rapor PDF**:
   - Siswa memiliki halaman pribadi untuk melihat ringkasan statistik (jumlah latihan, rata-rata skor, status kelulusan).
   - Tombol **"Cetak / Unduh Capaian (PDF)"** menghasilkan format rapor resmi A4 siap cetak atau disimpan sebagai PDF.

5. **Portal Guru & Ekspor Excel**:
   - Akses aman guru (PIN default: `GURU123`).
   - Guru dapat melihat tabel seluruh murid terdaftar (Tingkat XI & XII).
   - Guru dapat mendaftarkan murid secara langsung.
   - Guru dapat memantau seluruh nilai latihan kelas.
   - Tombol **"Unduh Rekaman Hasil Latihan (Excel)"** mengekspor seluruh rekapan nilai dan murid ke file `.xlsx` menggunakan engine SheetJS.

---

## 📊 Integrasi Google Spreadsheet & Web App API (100% Otomatis)

Sistem telah dihubungkan langsung ke Web App API:  
`https://script.google.com/macros/s/AKfycbxEVnJvbx5hXnOuQKtT134tjuD8wtWVIw5ukHXjbcn1X7lOGitlw4YPqWoVOSggRo-p/exec`  
yang menulis dan membaca data secara real-time ke spreadsheet:  
[https://docs.google.com/spreadsheets/d/1rTpLFo_QD6-XhcQE43CAZZc3WbI0gkiCXIjhSvg_CPc](https://docs.google.com/spreadsheets/d/1rTpLFo_QD6-XhcQE43CAZZc3WbI0gkiCXIjhSvg_CPc)

Tiap kali murid mendaftar atau menyelesaikan latihan, data langsung tercatat di sheet `Siswa` dan sheet `Nilai` tanpa perlu setup tambahan.

Untuk memeriksa isi data spreadsheet langsung dari komputer tanpa membuka browser:
```powershell
python sync_to_gsheet.py
```

---

## 🚀 Panduan Mengunggah ke GitHub & Mengaktifkan GitHub Pages

1. Inisialisasi repositori Git dan unggah:
```bash
git init
git add .
git commit -m "Inisialisasi Grammar Plus B1 (Tingkat XI & XII)"
git branch -M main
git remote add origin https://github.com/USERNAME-ANDA/grammar-plus-b1.git
git push -u origin main
```
2. Di GitHub repositori: Buka **Settings** &rarr; **Pages**.
3. Pada **Build and deployment**, pilih **GitHub Actions** atau **Deploy from a branch (main / root)**.
4. Website akan aktif secara otomatis pada URL GitHub Pages Anda.

---

## 🛠️ Berkas Portabel Mandiri (Standalone)
Jika ingin membuka aplikasi web secara langsung tanpa web server lokal:
Buka file `index_standalone.html` langsung di browser mana pun (Chrome, Edge, Firefox). Seluruh CSS, JavaScript, database, dan konfigurasi API sudah tertanam di dalam satu berkas tunggal.
