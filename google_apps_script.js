/**
 * GOOGLE APPS SCRIPT - GRAMMAR PLUS B1 DATABASE BACKEND
 * ID Spreadsheet: 1rTpLFo_QD6-XhcQE43CAZZc3WbI0gkiCXIjhSvg_CPc
 * Khusus Siswa Tingkat XI dan XII (Kurikulum Merdeka Fase F)
 * 
 * CARA MEMASANG (HANYA 1 MENIT):
 * 1. Buka spreadsheet: https://docs.google.com/spreadsheets/d/1rTpLFo_QD6-XhcQE43CAZZc3WbI0gkiCXIjhSvg_CPc
 * 2. Klik menu 'Extensions' (Ekstensi) -> 'Apps Script'.
 * 3. Hapus semua kode default di editor, lalu paste seluruh isi file ini.
 * 4. Klik ikon Save (Disket).
 * 5. Klik tombol biru 'Deploy' (Terapkan) -> 'New deployment' (Penerapan baru).
 *    Jenis: Web app -> Execute as: Me -> Who has access: Anyone -> Deploy.
 * 6. Berikan izin akses (Authorize access).
 * 7. Salin Web App URL yang berakhiran '/exec'.
 * 8. Tempelkan URL tersebut ke website Anda pada menu 'Database Google Sheet'. Selesai!
 */

const SPREADSHEET_ID = "1rTpLFo_QD6-XhcQE43CAZZc3WbI0gkiCXIjhSvg_CPc";

function getSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID !== "") {
    try {
      return SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (e) {
      console.warn("openById gagal, mencoba getActiveSpreadsheet:", e);
    }
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Pastikan Sheet Siswa, Nilai, dan Pengaturan telah dibuat dengan header baku
 */
function ensureSheetsExist(ss) {
  // 1. Sheet Siswa
  let sheetSiswa = ss.getSheetByName("Siswa");
  if (!sheetSiswa) {
    sheetSiswa = ss.insertSheet("Siswa");
    sheetSiswa.appendRow([
      "Timestamp", "Username", "Password", "Nama Lengkap",
      "Tingkat", "Fase", "Rombel", "Nomor Presensi", "Tanggal Lahir", "Role"
    ]);
    sheetSiswa.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#EFF6FF");
    sheetSiswa.setFrozenRows(1);
  }

  // 2. Sheet Nilai
  let sheetNilai = ss.getSheetByName("Nilai");
  if (!sheetNilai) {
    sheetNilai = ss.insertSheet("Nilai");
    sheetNilai.appendRow([
      "Timestamp", "Username", "Nama Lengkap", "Tingkat", "Rombel",
      "Unit ID", "Latihan ID", "Judul Latihan", "Skor", "Total Soal",
      "Persentase", "Status"
    ]);
    sheetNilai.getRange(1, 1, 1, 12).setFontWeight("bold").setBackground("#F0FDF4");
    sheetNilai.setFrozenRows(1);
  }

  // 3. Sheet Pengaturan
  let sheetSetting = ss.getSheetByName("Pengaturan");
  if (!sheetSetting) {
    sheetSetting = ss.insertSheet("Pengaturan");
    sheetSetting.appendRow(["Kunci", "Nilai", "Keterangan"]);
    sheetSetting.appendRow(["KKM", "75", "Batas kelulusan minimum per latihan (%)"]);
    sheetSetting.appendRow(["ALLOWED_LEVELS", "XI,XII", "Tingkat yang diizinkan mendaftar"]);
    sheetSetting.appendRow(["FASE", "F", "Fase Kurikulum Merdeka"]);
    sheetSetting.appendRow(["PIN_GURU", "GURU123", "PIN akses Portal Guru"]);
    sheetSetting.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#FEF3C7");
    sheetSetting.setFrozenRows(1);
  }
}

/**
 * Handle GET Requests (ping, getStudents, getScores, register, submitScore)
 */
function doGet(e) {
  const p = (e && e.parameter) ? e.parameter : {};
  const action = p.action || "ping";
  const callback = p.callback || "";
  return handleAction(action, p, callback);
}

/**
 * Handle POST Requests
 */
function doPost(e) {
  let body = {};
  try {
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }
  } catch (ex) {
    body = (e && e.parameter) ? e.parameter : {};
  }
  if (!body || Object.keys(body).length === 0) {
    body = (e && e.parameter) ? e.parameter : {};
  }

  const action = body.action || (e && e.parameter && e.parameter.action) || "";
  const callback = (e && e.parameter && e.parameter.callback) || "";
  return handleAction(action, body, callback);
}

/**
 * Pusat Handler Aksi Database
 */
function handleAction(action, body, callback) {
  try {
    const ss = getSpreadsheet();
    if (!ss) {
      return jsonResponse({ status: "error", message: "Spreadsheet tidak dapat diakses" }, callback);
    }

    ensureSheetsExist(ss);

    // 0. PING CEK KONEKSI
    if (action === "ping") {
      return jsonResponse({
        status: "success",
        message: "Google Apps Script Grammar Plus B1 (Tingkat XI & XII) Aktif!",
        course: "Grammar Plus B1",
        spreadsheetId: SPREADSHEET_ID,
        time: new Date().toISOString()
      }, callback);
    }

    // 1. GET STUDENTS
    if (action === "getStudents") {
      const ws = ss.getSheetByName("Siswa");
      const data = ws.getDataRange().getValues();
      if (data.length <= 1) return jsonResponse({ status: "success", students: [] }, callback);

      const students = [];
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row[1]) {
          students.push({
            timestamp: row[0],
            username: String(row[1]).trim(),
            password: String(row[2]).trim(),
            nama: String(row[3]).trim(),
            tingkat: String(row[4]).trim(),
            fase: String(row[5]).trim(),
            rombel: String(row[6]).trim(),
            presensi: String(row[7]).trim(),
            tanggalLahir: String(row[8]).trim(),
            role: String(row[9] || "Siswa").trim()
          });
        }
      }
      return jsonResponse({ status: "success", students: students }, callback);
    }

    // 2. GET SCORES
    if (action === "getScores") {
      const ws = ss.getSheetByName("Nilai");
      const data = ws.getDataRange().getValues();
      if (data.length <= 1) return jsonResponse({ status: "success", scores: [] }, callback);

      const scores = [];
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row[1]) {
          scores.push({
            timestamp: row[0],
            username: String(row[1]).trim(),
            nama: String(row[2]).trim(),
            tingkat: String(row[3]).trim(),
            rombel: String(row[4]).trim(),
            unitId: row[5],
            exerciseId: String(row[6]).trim(),
            exerciseTitle: String(row[7]).trim(),
            skor: row[8],
            totalSoal: row[9],
            persentase: String(row[10]).trim(),
            status: String(row[11]).trim()
          });
        }
      }
      return jsonResponse({ status: "success", scores: scores }, callback);
    }

    // 3. REGISTER STUDENT (KHUSUS XI DAN XII)
    if (action === "register") {
      const ws = ss.getSheetByName("Siswa");
      const tingkat = String(body.tingkat || "").trim().toUpperCase();
      
      // Validasi ketat hanya kelas XI dan XII
      if (tingkat !== "XI" && tingkat !== "XII") {
        return jsonResponse({
          status: "error",
          message: "Pendaftaran Grammar Plus B1 hanya berlaku untuk siswa Tingkat XI dan XII (Fase F)!"
        }, callback);
      }

      const username = String(body.username || "").trim();
      const nama = String(body.nama || "").trim().toUpperCase();
      const fase = String(body.fase || "F").trim().toUpperCase();
      const tanggalLahir = String(body.tanggalLahir || "").trim();
      
      // Format password default ke DDMMYYYY jika belum diubah
      function formatToDDMMYYYY(tgl) {
        if (!tgl) return "";
        var str = String(tgl).trim();
        if (str.indexOf("-") !== -1) {
          var parts = str.split("-");
          if (parts.length === 3) {
            var y = ("0000" + parts[0]).slice(-4);
            var m = ("00" + parts[1]).slice(-2);
            var d = ("00" + parts[2]).slice(-2);
            return d + m + y;
          }
        }
        return str.replace(/[^0-9]/g, "");
      }

      const password = String(body.password || formatToDDMMYYYY(tanggalLahir)).trim();
      const role = String(body.role || "Siswa").trim();
      const timestamp = body.timestamp || new Date().toLocaleString("id-ID");

      if (!username || !nama) {
        return jsonResponse({ status: "error", message: "Data pendaftaran tidak lengkap" }, callback);
      }

      // Cek apakah username sudah ada
      const data = ws.getDataRange().getValues();
      let exists = false;
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][1]).trim().toUpperCase() === username.toUpperCase()) {
          exists = true;
          break;
        }
      }

      if (!exists) {
        ws.appendRow([
          timestamp, username, password, nama,
          tingkat, fase, rombel, presensi, tanggalLahir, role
        ]);
      }

      return jsonResponse({
        status: "success",
        message: exists ? "Akun sudah terdaftar sebelumnya" : "Registrasi murid berhasil disimpan",
        student: { username, nama, tingkat, fase, rombel, presensi, tanggalLahir, role }
      }, callback);
    }

    // 4. SUBMIT SCORE
    if (action === "submitScore") {
      const ws = ss.getSheetByName("Nilai");
      const timestamp = body.timestamp || new Date().toLocaleString("id-ID");
      const username = String(body.username || "").trim();
      const nama = String(body.nama || "").trim().toUpperCase();
      const tingkat = String(body.tingkat || "").trim().toUpperCase();
      const rombel = String(body.rombel || "").trim();
      const unitId = body.unitId || "";
      const exerciseId = String(body.exerciseId || "").trim();
      const exerciseTitle = String(body.exerciseTitle || "").trim();
      const skor = body.skor !== undefined ? body.skor : 0;
      const totalSoal = body.totalSoal !== undefined ? body.totalSoal : 0;
      const persentase = String(body.persentase || "0%").trim();
      const status = String(body.status || "BELUM LULUS").trim();

      ws.appendRow([
        timestamp, username, nama, tingkat, rombel,
        unitId, exerciseId, exerciseTitle, skor, totalSoal,
        persentase, status
      ]);

      return jsonResponse({
        status: "success",
        message: "Nilai berhasil dicatat ke Spreadsheet",
        score: { username, unitId, exerciseId, skor, totalSoal, persentase, status }
      }, callback);
    }

    return jsonResponse({ status: "error", message: "Aksi tidak dikenal: " + action }, callback);

  } catch (error) {
    return jsonResponse({ status: "error", message: error.toString() }, callback);
  }
}

/**
 * Format Response JSON & JSONP
 */
function jsonResponse(data, callback) {
  let outputText = JSON.stringify(data);
  let mimeType = ContentService.MimeType.JSON;

  if (callback && callback !== "") {
    outputText = callback + "(" + outputText + ");";
    mimeType = ContentService.MimeType.JAVASCRIPT;
  }

  return ContentService.createTextOutput(outputText).setMimeType(mimeType);
}
