/**
 * GRAMMAR PLUS B1 - APPLICATION LOGIC & DATABASE ENGINE
 * Sesuai kurikulum Bahasa Inggris Grammar Plus B1 (Sarah Jane Lewis)
 * Khusus Tingkat XI dan XII (Kurikulum Merdeka Fase F)
 * Database: Google Spreadsheet via Google Apps Script & LocalStorage
 */

// Konfigurasi Standar
const APP_CONFIG = {
  appName: "Grammar Plus B1 - Learning Portal",
  courseLevel: "B1",
  allowedLevels: ["XI", "XII"], // Hanya Tingkat XI dan XII yang berhak mendaftar
  defaultFase: "F",
  spreadsheetUrl: "https://docs.google.com/spreadsheets/d/1rTpLFo_QD6-XhcQE43CAZZc3WbI0gkiCXIjhSvg_CPc",
  spreadsheetId: "1rTpLFo_QD6-XhcQE43CAZZc3WbI0gkiCXIjhSvg_CPc",
  minPassingScore: 75, // KKM 75%
  defaultTeacherPin: "GURU123",
  defaultScriptUrl: "https://script.google.com/macros/s/AKfycbxEVnJvbx5hXnOuQKtT134tjuD8wtWVIw5ukHXjbcn1X7lOGitlw4YPqWoVOSggRo-p/exec"
};

// State Aplikasi
const AppState = {
  currentUser: null,       // { username, nama, tingkat, fase, rombel, presensi, tanggalLahir, role }
  selectedUnit: null,
  selectedExercise: null,
  gasUrl: "",
  isOnline: true,
  students: [],
  scores: []
};

// Helper untuk mengambil seluruh unit secara aman
function getGrammarUnits() {
  if (typeof window !== "undefined" && window.ExercisesStore && typeof window.ExercisesStore.getAllUnits === "function") {
    const su = window.ExercisesStore.getAllUnits();
    if (su && su.length > 0) return su;
  }
  if (typeof ExercisesStore !== "undefined" && typeof ExercisesStore.getAllUnits === "function") {
    const su = ExercisesStore.getAllUnits();
    if (su && su.length > 0) return su;
  }
  if (typeof window !== "undefined" && Array.isArray(window.GRAMMAR_UNITS) && window.GRAMMAR_UNITS.length > 0) {
    return window.GRAMMAR_UNITS;
  }
  if (typeof GRAMMAR_UNITS !== "undefined" && Array.isArray(GRAMMAR_UNITS) && GRAMMAR_UNITS.length > 0) {
    return GRAMMAR_UNITS;
  }
  return [];
}

// ==========================================
// 1. INISIALISASI SAAT HALAMAN DIMUAT
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  if (typeof ExercisesStore !== "undefined" && typeof ExercisesStore.init === "function") {
    ExercisesStore.init();
  }
  initStorage();
  initNavigation();
  initAuthUI();
  initUnitBrowser();
  initAppendices();
  initSettingsUI();
  
  // Render awal
  checkActiveSession();
  renderUnitGrid();

  // Retry render jika data units masih proses parse
  setTimeout(() => {
    const grid = document.getElementById("unit-grid-container");
    if (grid && (!grid.children || grid.children.length === 0)) {
      renderUnitGrid();
    }
  }, 250);
});

function initStorage() {
  // Load GAS URL dari localStorage atau gunakan URL default aktif
  const savedUrl = localStorage.getItem("grammar_b1_gas_url");
  if (!savedUrl || savedUrl === "" || savedUrl.includes("placeholder") || savedUrl.includes("AKfycbxTJDw0Y_H1XzJrfC3TSyJCjQQh0zfyY6MbSugMYOGKuXfqnAL9vsu4N2pFFf29s466")) {
    AppState.gasUrl = APP_CONFIG.defaultScriptUrl || "";
    localStorage.setItem("grammar_b1_gas_url", AppState.gasUrl);
  } else {
    AppState.gasUrl = savedUrl;
  }
  
  // Load local students & scores cache
  const savedStudents = localStorage.getItem("grammar_b1_students");
  if (savedStudents) {
    try { AppState.students = JSON.parse(savedStudents); } catch (e) { AppState.students = []; }
  } else {
    // Akun default Guru
    AppState.students = [
      {
        timestamp: new Date().toISOString(),
        username: "GURU",
        password: "GURU123",
        nama: "GURU BAHASA INGGRIS KELAS XI & XII",
        tingkat: "XI & XII",
        fase: "F",
        rombel: "1",
        presensi: "1",
        tanggalLahir: "1980-01-01",
        role: "Guru"
      }
    ];
    saveStudentsToStorage();
  }

  const savedScores = localStorage.getItem("grammar_b1_scores");
  if (savedScores) {
    try { AppState.scores = JSON.parse(savedScores); } catch (e) { AppState.scores = []; }
  }

  // Sinkronisasi otomatis data siswa dan nilai dari Google Spreadsheet jika URL tersedia
  if (AppState.gasUrl) {
    syncStudentsFromGAS();
    syncScoresFromGAS();
  }
}

function saveStudentsToStorage() {
  try {
    localStorage.setItem("grammar_b1_students", JSON.stringify(AppState.students));
  } catch (e) {
    console.warn("Storage quota exceeded", e);
  }
}

function saveScoresToStorage() {
  try {
    localStorage.setItem("grammar_b1_scores", JSON.stringify(AppState.scores));
  } catch (e) {
    console.warn("Storage quota exceeded", e);
  }
}

// ==========================================
// 2. NAVIGASI TAB UTAMA
// ==========================================
function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("data-target");
      switchTab(targetId);
    });
  });
}

function switchTab(targetId) {
  // Guard untuk latihan jika belum login
  if (targetId === "section-latihan" && !AppState.currentUser) {
    showToast("Silakan Masuk atau Daftarkan Diri terlebih dahulu untuk mengakses Latihan!", "danger");
    openModal("modal-login");
    return;
  }
  
  // Guard ketat untuk Guru Portal & Database Pengaturan (Siswa TIDAK BOLEH mengakses database)
  if (targetId === "section-guru" || targetId === "section-pengaturan") {
    if (!AppState.currentUser || AppState.currentUser.role !== "Guru") {
      openModal("modal-guru-auth");
      showToast("Akses Terbatas: Hanya Guru yang berhak mengakses portal dan database!", "warning");
      return;
    }
  }

  document.querySelectorAll(".tab-section").forEach(sec => sec.classList.remove("active"));
  document.querySelectorAll(".nav-link").forEach(lnk => lnk.classList.remove("active"));
  
  const targetSection = document.getElementById(targetId);
  const targetLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
  
  if (targetSection) targetSection.classList.add("active");
  if (targetLink) targetLink.classList.add("active");

  // Hook render data
  if (targetId === "section-materi") {
    renderUnitGrid();
  } else if (targetId === "section-latihan") {
    const sel = document.getElementById("exercise-unit-select");
    const currentUnitId = AppState.selectedUnit ? AppState.selectedUnit.id : (sel ? parseInt(sel.value, 10) || 1 : 1);
    loadUnitExercises(currentUnitId, false);
  } else if (targetId === "section-capaian") {
    renderStudentRecord();
  } else if (targetId === "section-guru") {
    renderTeacherDashboard();
  }
  
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==========================================
// 3. SISTEM AUTH & PENDAFTARAN SISWA (TINGKAT XI & XII)
// ==========================================
function initAuthUI() {
  // Form Registrasi Siswa
  const formRegister = document.getElementById("form-register");
  if (formRegister) {
    formRegister.addEventListener("submit", handleStudentRegister);
  }

  // Form Login
  const formLogin = document.getElementById("form-login");
  if (formLogin) {
    formLogin.addEventListener("submit", handleLogin);
  }

  // Form Guru Auth PIN
  const formGuruAuth = document.getElementById("form-guru-auth");
  if (formGuruAuth) {
    formGuruAuth.addEventListener("submit", handleGuruAuth);
  }
}

// Generator Format Kata Sandi DDMMYYYY dari Tanggal Lahir (YYYY-MM-DD -> DDMMYYYY)
function formatBirthdateToPassword(tgl) {
  if (!tgl) return "";
  const clean = String(tgl).trim();
  if (clean.includes("-")) {
    const parts = clean.split("-");
    if (parts.length === 3) {
      const year = parts[0].padStart(4, "0");
      const month = parts[1].padStart(2, "0");
      const day = parts[2].padStart(2, "0");
      return `${day}${month}${year}`;
    }
  }
  if (clean.includes("/")) {
    const parts = clean.split("/");
    if (parts.length === 3) {
      const day = parts[0].padStart(2, "0");
      const month = parts[1].padStart(2, "0");
      const year = parts[2].padStart(4, "0");
      return `${day}${month}${year}`;
    }
  }
  return clean.replace(/[^0-9]/g, "");
}

// Generator Username: 3 Huruf Depan Nama + DDMMYYYY + Sufiks jika Duplikat
function generateUsername(namaLengkap, tanggalLahir) {
  const cleanNama = namaLengkap.trim().toUpperCase().replace(/[^A-Z]/g, "");
  const prefix = (cleanNama.slice(0, 3) || "STU").padEnd(3, "X");
  
  // Format Tanggal: YYYY-MM-DD -> DDMMYYYY
  let datePart = formatBirthdateToPassword(tanggalLahir);
  if (!datePart || datePart.length < 8) {
    datePart = "01012008";
  }

  const baseUsername = `${prefix}${datePart}`;
  
  // Deteksi Duplikasi
  let candidate = baseUsername;
  let counter = 0;
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const isDuplicate = (usr) => {
    return AppState.students.some(s => s.username.toUpperCase() === usr.toUpperCase());
  };

  while (isDuplicate(candidate)) {
    if (counter < alphabet.length) {
      candidate = `${baseUsername}${alphabet[counter]}`;
      counter++;
    } else {
      candidate = `${baseUsername}${counter}`;
      counter++;
    }
  }

  return candidate;
}

function handleStudentRegister(e) {
  e.preventDefault();
  
  const tingkat = document.getElementById("reg-tingkat").value.trim().toUpperCase();
  const fase = document.getElementById("reg-fase").value.trim().toUpperCase();
  const rombel = parseInt(document.getElementById("reg-rombel").value.trim(), 10);
  const presensi = parseInt(document.getElementById("reg-presensi").value.trim(), 10);
  const nama = document.getElementById("reg-nama").value.trim().toUpperCase();
  const tanggalLahir = document.getElementById("reg-tgl-lahir").value.trim();

  // VALIDASI KETAT: HANYA TINGKAT XI DAN XII
  if (tingkat !== "XI" && tingkat !== "XII") {
    showToast("Pendaftaran Grammar Plus B1 hanya berlaku untuk siswa Tingkat XI dan XII (Fase F)!", "danger");
    return;
  }

  // Validasi Isian
  if (!tingkat || !fase || isNaN(rombel) || isNaN(presensi) || !nama || !tanggalLahir) {
    showToast("Semua kolom isian wajib diisi dengan lengkap dan benar!", "danger");
    return;
  }

  if (rombel < 1 || rombel > 12) {
    showToast("Nomor Rombel harus antara 1 sampai 12!", "warning");
    return;
  }

  if (presensi < 1 || presensi > 37) {
    showToast("Nomor Presensi harus antara 1 sampai 37!", "warning");
    return;
  }

  const username = generateUsername(nama, tanggalLahir);
  const password = formatBirthdateToPassword(tanggalLahir); // Password otomatis format DDMMYYYY

  const newStudent = {
    timestamp: new Date().toLocaleString("id-ID"),
    username: username,
    password: password, // Format DDMMYYYY (bukan YYYY-MM-DD)
    nama: nama,
    tingkat: tingkat,
    fase: fase,
    rombel: String(rombel),
    presensi: String(presensi),
    tanggalLahir: tanggalLahir,
    role: "Siswa",
    status: "Aktif",
    synced: false
  };

  AppState.students.push(newStudent);
  saveStudentsToStorage();

  // Kirim data registrasi ke Google Apps Script secara asynchronous
  syncStudentToGAS(newStudent);

  // Tampilkan Kartu Akun Berhasil
  closeModal("modal-register");
  showAccountCardModal(newStudent);

  // Auto-login
  loginUser(newStudent);
  showToast(`Selamat datang ${nama}! Akun Anda berhasil didaftarkan.`, "success");
}

function showAccountCardModal(student) {
  const cardBody = document.getElementById("account-card-body");
  if (!cardBody) return;

  cardBody.innerHTML = `
    <div class="account-card-badge">
      <div style="font-size: 0.85rem; font-weight: 700; color: #2563EB; text-transform: uppercase;">
        KARTU IDENTITAS SISWA - GRAMMAR PLUS B1
      </div>
      <div style="font-size: 1.4rem; font-weight: 800; color: #0F172A; margin: 0.25rem 0;">
        ${escapeHtml(student.nama)}
      </div>
      <div style="font-size: 0.9rem; color: #475569;">
        Kelas <strong>${escapeHtml(student.tingkat)} - Rombel ${escapeHtml(student.rombel)}</strong> | Fase ${escapeHtml(student.fase)} | Presensi #${escapeHtml(student.presensi)}
      </div>
      
      <div style="background-color: #FFFFFF; border: 2px dashed #93C5FD; border-radius: 8px; padding: 1rem; margin: 1.25rem 0; text-align: center;">
        <div style="font-size: 0.8rem; color: #64748B; font-weight: 600;">USERNAME ANDA:</div>
        <div style="font-size: 1.75rem; font-weight: 800; color: #1E40AF; letter-spacing: 1px; font-family: monospace;">
          ${escapeHtml(student.username)}
        </div>
        <div style="font-size: 0.8rem; color: #64748B; margin-top: 0.5rem;">KATA SANDI LOGIN:</div>
        <div style="font-size: 1.35rem; font-weight: 800; color: #0F172A; font-family: monospace; letter-spacing: 1px;">
          ${escapeHtml(student.password)}
        </div>
        <div style="font-size: 0.775rem; color: #64748B; margin-top: 0.25rem;">
          (Format DDMMYYYY dari tanggal lahir: ${escapeHtml(student.tanggalLahir)})
        </div>
      </div>

      <p style="font-size: 0.8rem; color: #64748B; text-align: center;">
        Harap simpan atau catat username dan kata sandi Anda untuk login di kemudian hari.
      </p>

      <div style="display: flex; gap: 0.5rem; justify-content: center; margin-top: 1rem;">
        <button class="btn btn-primary btn-sm" onclick="copyUsernameToClipboard('${escapeHtml(student.username)}')">
          Salin Username
        </button>
        <button class="btn btn-secondary btn-sm" onclick="closeModal('modal-account-card')">
          Tutup &amp; Mulai Belajar
        </button>
      </div>
    </div>
  `;

  openModal("modal-account-card");
}

async function handleLogin(e) {
  e.preventDefault();
  const usernameInput = document.getElementById("login-username").value.trim().toUpperCase();
  const rawPasswordInput = document.getElementById("login-password").value.trim();
  const normPasswordInput = formatBirthdateToPassword(rawPasswordInput) || rawPasswordInput.replace(/[^0-9a-zA-Z]/g, "");

  // 1. Cek Login Khusus Guru
  if ((usernameInput === "GURU" || usernameInput === "ADMIN") && (rawPasswordInput === APP_CONFIG.defaultTeacherPin || rawPasswordInput === "GURU123")) {
    const guruUser = {
      username: "GURU",
      nama: "GURU PEMBIMBING (KELAS XI & XII)",
      role: "Guru",
      tingkat: "XI & XII",
      fase: "F",
      rombel: "All",
      presensi: "0",
      tanggalLahir: "1980-01-01"
    };
    loginUser(guruUser);
    closeModal("modal-login");
    showToast("Berhasil Masuk sebagai Guru!", "success");
    return;
  }

  // Helper verifikasi kata sandi dengan toleransi pemotongan angka nol di awal oleh Spreadsheet
  const isMatch = (s) => {
    if (!s || !s.username || s.username.toUpperCase() !== usernameInput) return false;
    let sPass = String(s.password || "").trim();
    const sPassPadded = /^\d{7}$/.test(sPass) ? "0" + sPass : sPass;
    const rawPadded = /^\d{7}$/.test(rawPasswordInput) ? "0" + rawPasswordInput : rawPasswordInput;
    const normPadded = /^\d{7}$/.test(normPasswordInput) ? "0" + normPasswordInput : normPasswordInput;

    if (sPass === rawPasswordInput || sPassPadded === rawPadded || sPass === normPasswordInput || sPassPadded === normPadded) return true;
    if (formatBirthdateToPassword(s.tanggalLahir) === normPasswordInput || formatBirthdateToPassword(s.tanggalLahir) === normPadded) return true;
    if (s.tanggalLahir === rawPasswordInput) return true;
    return false;
  };

  // 2. Cek di memori lokal terlebih dahulu
  let found = AppState.students.find(isMatch);

  // 3. Jika belum ditemukan di perangkat lokal, periksa ke Google Spreadsheet secara online
  if (!found && AppState.gasUrl) {
    const submitBtn = document.querySelector("#form-login button[type='submit']");
    const originalText = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = "⏳ Memeriksa ke server...";
    }

    try {
      await syncStudentsFromGAS();
      found = AppState.students.find(isMatch);
    } catch (err) {
      console.warn("Gagal cek server saat login:", err);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  }

  if (found) {
    loginUser(found);
    closeModal("modal-login");
    showToast(`Selamat datang kembali, ${found.nama}!`, "success");
  } else {
    showToast("Username atau Kata Sandi salah! Kata sandi adalah tanggal lahir format DDMMYYYY (contoh: 14102007).", "danger");
  }
}

function handleGuruAuth(e) {
  e.preventDefault();
  const pin = document.getElementById("guru-pin-input").value.trim();
  if (pin === APP_CONFIG.defaultTeacherPin || pin === "GURU123") {
    const guruUser = {
      username: "GURU",
      nama: "GURU PEMBIMBING (KELAS XI & XII)",
      role: "Guru",
      tingkat: "XI & XII",
      fase: "F",
      rombel: "All",
      presensi: "0",
      tanggalLahir: "1980-01-01"
    };
    loginUser(guruUser);
    closeModal("modal-guru-auth");
    showToast("Akses Portal Guru Diberikan!", "success");
    switchTab("section-guru");
  } else {
    showToast("PIN Guru tidak valid! Default PIN: GURU123", "danger");
  }
}

function loginUser(user) {
  AppState.currentUser = user;
  localStorage.setItem("grammar_b1_active_user", JSON.stringify(user));
  updateAuthUI();

  // Refresh tampilan section latihan jika terkunci
  const lockBanner = document.querySelector(".lock-banner");
  const lockedContent = document.querySelector(".locked-content");
  if (lockBanner && lockedContent) {
    lockBanner.style.display = "none";
    lockedContent.style.display = "block";
  }
}

function handleLogout() {
  AppState.currentUser = null;
  localStorage.removeItem("grammar_b1_active_user");
  updateAuthUI();
  showToast("Anda telah keluar dari sistem.", "info");
  switchTab("section-materi");
}

function checkActiveSession() {
  const saved = localStorage.getItem("grammar_b1_active_user");
  if (saved) {
    try {
      AppState.currentUser = JSON.parse(saved);
      updateAuthUI();
    } catch (e) {
      AppState.currentUser = null;
    }
  } else {
    updateAuthUI();
  }
}

function updateAuthUI() {
  const authContainer = document.getElementById("header-auth-status");
  const navGuru = document.getElementById("nav-link-guru");
  const navSettings = document.getElementById("nav-link-settings");
  const dbBanner = document.getElementById("db-sync-banner");

  if (!authContainer) return;

  if (AppState.currentUser) {
    const user = AppState.currentUser;
    const isGuru = user.role === "Guru";

    authContainer.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div style="text-align: right; line-height: 1.2;">
          <div style="font-weight: 700; font-size: 0.85rem; color: #0F172A;">
            ${escapeHtml(user.nama)}
          </div>
          <div style="font-size: 0.75rem; color: #64748B;">
            ${isGuru ? '<span class="badge" style="background-color: #FEF3C7; color: #92400E;">GURU</span>' : `Kelas ${escapeHtml(user.tingkat)}-${escapeHtml(user.rombel)} (${escapeHtml(user.username)})`}
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="handleLogout()">Keluar</button>
      </div>
    `;

    // Tampilkan Menu Khusus Guru
    if (isGuru) {
      if (navGuru) navGuru.style.display = "inline-flex";
      if (navSettings) navSettings.style.display = "inline-flex";
      if (dbBanner) dbBanner.style.display = "block";
    } else {
      if (navGuru) navGuru.style.display = "none";
      if (navSettings) navSettings.style.display = "none";
      if (dbBanner) dbBanner.style.display = "none";
    }

    // Buka kunci latihan
    const lockBanner = document.querySelector(".lock-banner");
    const lockedContent = document.querySelector(".locked-content");
    if (lockBanner) lockBanner.style.display = "none";
    if (lockedContent) lockedContent.style.display = "block";

  } else {
    // Tamu Belum Login
    authContainer.innerHTML = `
      <button class="btn btn-secondary btn-sm" onclick="openModal('modal-login')">Masuk</button>
      <button class="btn btn-primary btn-sm" onclick="openModal('modal-register')">Daftar Murid Baru (XI/XII)</button>
    `;

    if (navGuru) navGuru.style.display = "none";
    if (navSettings) navSettings.style.display = "none";
    if (dbBanner) dbBanner.style.display = "none";

    // Kunci latihan
    const lockBanner = document.querySelector(".lock-banner");
    const lockedContent = document.querySelector(".locked-content");
    if (lockBanner) lockBanner.style.display = "block";
    if (lockedContent) lockedContent.style.display = "none";
  }
}

function copyUsernameToClipboard(usr) {
  navigator.clipboard.writeText(usr).then(() => {
    showToast("Username berhasil disalin ke clipboard!", "success");
  });
}

// ==========================================
// 4. BROWSER MATERI DAN UNIT (40 UNIT B1)
// ==========================================
function initUnitBrowser() {
  const searchInput = document.getElementById("search-unit-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderUnitGrid(e.target.value.toLowerCase());
    });
  }
}

function renderUnitGrid(filterKeyword = "") {
  const container = document.getElementById("unit-grid-container");
  if (!container) return;

  const allUnits = getGrammarUnits();
  if (!allUnits || allUnits.length === 0) {
    setTimeout(() => {
      const retryUnits = getGrammarUnits();
      if (retryUnits && retryUnits.length > 0) {
        renderUnitGrid(filterKeyword);
      }
    }, 150);
    return;
  }

  const filtered = allUnits.filter(u => {
    const text = `${u.id} ${u.title} ${u.english_title} ${u.category}`.toLowerCase();
    return text.includes(filterKeyword);
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 2.5rem;">
        <p style="color: #64748B; font-size: 1rem;">Materi tidak ditemukan dengan kata kunci "${escapeHtml(filterKeyword)}".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(unit => {
    const isComplete = unit.id <= 3;
    const badgeHtml = isComplete
      ? `<span class="badge badge-success">✓ Soal Lengkap &amp; Pembahasan</span>`
      : `<span class="badge badge-warning">⏳ Materi &amp; Penjajakan Awal</span>`;

    return `
      <div class="unit-card" onclick="openUnitDetail(${unit.id})">
        <div class="unit-card-header">
          <span class="unit-badge">UNIT ${unit.id}</span>
          <span class="unit-page">Hal. ${unit.page}</span>
        </div>
        <div class="unit-card-title">${escapeHtml(unit.title)}</div>
        <div class="unit-card-subtitle">${escapeHtml(unit.english_title)}</div>
        <div style="margin-top: 0.75rem;">${badgeHtml}</div>
        <div style="font-size: 0.775rem; color: #64748B; margin-top: 0.5rem;">
          Kategori: <strong>${escapeHtml(unit.category)}</strong>
        </div>
      </div>
    `;
  }).join("");
}

function openUnitDetail(unitId) {
  const units = getGrammarUnits();
  const unit = units.find(u => u.id === unitId);
  if (!unit) return;

  AppState.selectedUnit = unit;
  
  const container = document.getElementById("unit-detail-content");
  if (!container) return;

  // Render detail grammar
  const g = unit.grammar || {};
  let tablesHtml = "";
  if (g.tables && g.tables.length > 0) {
    tablesHtml = g.tables.map(tbl => `
      <div style="margin: 1.5rem 0;">
        <h4 style="font-size: 0.95rem; font-weight: 700; color: #1E293B; margin-bottom: 0.5rem;">${escapeHtml(tbl.title)}</h4>
        <div class="grammar-table-wrapper">
          <table class="table-grammar">
            <thead>
              <tr>
                ${tbl.headers.map(h => `<th>${escapeHtml(h)}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${tbl.rows.map(row => `
                <tr>
                  ${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `).join("");
  }

  let rulesHtml = "";
  if (g.rules && g.rules.length > 0) {
    rulesHtml = `
      <div class="rules-box">
        <h4 style="font-size: 0.95rem; font-weight: 700; color: #1E293B; margin-bottom: 0.5rem;">📋 Kaidah &amp; Aturan Penting:</h4>
        <ul style="padding-left: 1.25rem; font-size: 0.875rem; color: #334155; line-height: 1.7;">
          ${g.rules.map(r => `<li>${escapeHtml(r)}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="card" style="border-top: 4px solid var(--primary); margin-bottom: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem;">
        <div>
          <span class="unit-badge">UNIT ${unit.id} • HALAMAN ${unit.page}</span>
          <h2 style="font-size: 1.35rem; font-weight: 800; color: #0F172A; margin-top: 0.25rem;">
            ${escapeHtml(unit.title)}
          </h2>
          <p style="color: #475569; font-size: 0.9rem; font-style: italic;">
            ${escapeHtml(unit.english_title)}
          </p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-primary btn-sm" onclick="startExerciseForUnit(${unit.id})">
            📝 Kerjakan Latihan Unit Ini
          </button>
          <button class="btn btn-secondary btn-sm" onclick="closeUnitDetail()">
            ✖ Tutup
          </button>
        </div>
      </div>

      <div style="margin-top: 1.25rem; font-size: 0.925rem; color: #1E293B; line-height: 1.7;">
        <p>${escapeHtml(g.summary || "")}</p>
        ${tablesHtml}
        ${rulesHtml}
      </div>

      <div style="margin-top: 1.5rem; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 1rem;">
        <button class="btn btn-primary" onclick="startExerciseForUnit(${unit.id})">
          🚀 Buka &amp; Kerjakan Soal Latihan Unit ${unit.id}
        </button>
      </div>
    </div>
  `;

  document.getElementById("unit-grid-container").style.display = "none";
  document.getElementById("search-unit-input").style.display = "none";
  container.style.display = "block";
  window.scrollTo({ top: container.offsetTop - 80, behavior: "smooth" });
}

function closeUnitDetail() {
  document.getElementById("unit-grid-container").style.display = "grid";
  document.getElementById("search-unit-input").style.display = "block";
  document.getElementById("unit-detail-content").style.display = "none";
}

function startExerciseForUnit(unitId) {
  closeUnitDetail();
  if (!AppState.currentUser) {
    showToast("Silakan masuk atau daftarkan diri untuk mengerjakan latihan!", "danger");
    openModal("modal-login");
    return;
  }
  
  switchTab("section-latihan");
  const sel = document.getElementById("exercise-unit-select");
  if (sel) {
    sel.value = String(unitId);
  }
  loadUnitExercises(unitId);
}

// ==========================================
// 5. ENGINE LATIHAN INTERAKTIF & PENILAIAN
// ==========================================
function loadUnitExercises(unitId, shouldSwitchTab = true) {
  const units = getGrammarUnits();
  let unit = units.find(u => u.id === Number(unitId));
  if (!unit && units.length > 0) {
    unit = units[0];
  }
  if (!unit) {
    setTimeout(() => {
      const retryUnits = getGrammarUnits();
      if (retryUnits && retryUnits.length > 0) {
        loadUnitExercises(unitId, shouldSwitchTab);
      }
    }, 200);
    return;
  }

  AppState.selectedUnit = unit;

  // Cek apakah siswa sudah login
  if (!AppState.currentUser) {
    showToast("Latihan hanya dapat diakses oleh siswa yang telah mendaftarkan diri!", "danger");
    openModal("modal-login");
    return;
  }

  const container = document.getElementById("exercise-render-area");
  if (!container) return;

  const exercises = unit.exercises || [];
  if (exercises.length === 0) {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 2.5rem;">
        <h3>Soal Belum Tersedia</h3>
        <p style="color: #64748B;">Latihan untuk Unit ${unit.id} sedang dalam proses digitalisasi dan akan segera hadir.</p>
      </div>
    `;
    return;
  }

  // Render daftar latihan di unit tersebut
  let exNavHtml = `
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
      ${exercises.map((ex, idx) => `
        <button class="btn btn-secondary btn-sm" id="btn-ex-nav-${ex.id}" onclick="renderSingleExerciseById('${ex.id}')">
          Latihan ${idx + 1}
        </button>
      `).join("")}
    </div>
  `;

  container.innerHTML = `
    <div class="card" style="margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <span class="unit-badge">UNIT ${unit.id}</span>
          <h3 style="font-size: 1.15rem; font-weight: 800; color: #0F172A; margin-top: 0.25rem;">
            ${escapeHtml(unit.title)}
          </h3>
        </div>
        <div style="font-size: 0.85rem; color: #64748B;">
          Total Latihan: <strong>${exercises.length}</strong>
        </div>
      </div>
      <div style="margin-top: 1rem;">
        ${exNavHtml}
      </div>
    </div>
    <div id="single-exercise-container"></div>
  `;

  // Render latihan pertama secara default
  renderSingleExercise(exercises[0], unit);
}

function renderSingleExerciseById(exId) {
  if (!AppState.selectedUnit) return;
  const ex = (AppState.selectedUnit.exercises || []).find(e => e.id === exId);
  if (ex) {
    renderSingleExercise(ex, AppState.selectedUnit);
  }
}

function renderSingleExercise(ex, unit) {
  AppState.selectedExercise = ex;
  const container = document.getElementById("single-exercise-container");
  if (!container) return;

  // Update styling tombol nav latihan aktif
  (unit.exercises || []).forEach(e => {
    const btn = document.getElementById(`btn-ex-nav-${e.id}`);
    if (btn) {
      if (e.id === ex.id) {
        btn.className = "btn btn-primary btn-sm";
      } else {
        btn.className = "btn btn-secondary btn-sm";
      }
    }
  });

  // Audio Script Box jika ada
  let audioHtml = "";
  if (ex.audioTrack) {
    const scriptObj = (window.AUDIO_TRANSCRIPTS || []).find(a => a.track.includes(ex.audioTrack));
    audioHtml = `
      <div class="audio-box" style="margin-bottom: 1.25rem; background: #FEF3C7; border: 1px solid #FDE68A; padding: 0.85rem 1.25rem; border-radius: 8px;">
        <div style="font-weight: 700; color: #B45309; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;">
          <span>🎧 Naskah Rekaman Audio (${escapeHtml(ex.audioTrack)})</span>
        </div>
        ${scriptObj ? `<div style="font-size: 0.825rem; color: #78350F; margin-top: 0.5rem; white-space: pre-wrap; font-family: monospace;">${escapeHtml(scriptObj.content)}</div>` : ''}
      </div>
    `;
  }

  // Render Soal
  const questions = ex.questions || [];
  let questionsHtml = questions.map((q, qIdx) => {
    let inputControlHtml = "";
    
    // Gambar soal jika ada
    let imgHtml = "";
    if (q.image) {
      imgHtml = `
        <div style="margin: 0.75rem 0; text-align: center;">
          <img src="${escapeHtml(q.image)}" alt="Gambar Soal ${qIdx + 1}" style="max-width: 100%; max-height: 220px; border-radius: 8px; border: 1px solid #CBD5E1; box-shadow: var(--shadow-sm);">
        </div>
      `;
    }

    if (ex.type === "choice") {
      inputControlHtml = `
        <div class="choice-group" style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.75rem;">
          ${(q.options || []).map((opt, oIdx) => `
            <label class="choice-label" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; background: #F8FAFC; padding: 0.6rem 0.85rem; border: 1px solid #E2E8F0; border-radius: 6px; cursor: pointer;">
              <input type="radio" name="q_${ex.id}_${qIdx}" value="${escapeHtml(opt)}">
              <span>${escapeHtml(opt)}</span>
            </label>
          `).join("")}
        </div>
      `;
    } else {
      // Type 'fill', 'reorder', 'transform'
      inputControlHtml = `
        <div style="margin-top: 0.5rem;">
          <input type="text" id="input_q_${ex.id}_${qIdx}" class="form-control" placeholder="Ketik jawaban Anda di sini..." autocomplete="off">
        </div>
      `;
    }

    return `
      <div class="card question-card" id="card_q_${ex.id}_${qIdx}" style="margin-bottom: 1rem; border-left: 3px solid #94A3B8;">
        <div style="font-size: 0.8rem; color: #64748B; font-weight: 700; margin-bottom: 0.25rem;">
          SOAL NOMOR ${qIdx + 1}
        </div>
        <div style="font-size: 0.95rem; font-weight: 600; color: #1E293B;">
          ${escapeHtml(q.q)}
        </div>
        ${imgHtml}
        ${inputControlHtml}
        
        <!-- Feedback seketika setelah diperiksa -->
        <div class="feedback-area" id="fb_q_${ex.id}_${qIdx}" style="display: none; margin-top: 0.75rem; padding: 0.75rem; border-radius: 6px; font-size: 0.85rem;"></div>
      </div>
    `;
  }).join("");

  container.innerHTML = `
    <div class="card" style="margin-bottom: 1.5rem;">
      <div style="border-bottom: 1px solid #E2E8F0; padding-bottom: 0.75rem; margin-bottom: 1rem;">
        <span class="badge badge-primary">Latihan Aktif</span>
        <h3 style="font-size: 1.2rem; font-weight: 800; color: #0F172A; margin-top: 0.25rem;">
          ${escapeHtml(ex.title)}
        </h3>
        <p style="font-size: 0.875rem; color: #475569;">
          <strong>Petunjuk:</strong> ${escapeHtml(ex.instruction)}
        </p>
      </div>

      ${audioHtml}

      <form id="form-exercise-submission" onsubmit="handleGradeExercise(event, '${ex.id}')">
        ${questionsHtml}

        <div style="display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.5rem;">
          <button type="button" class="btn btn-secondary" onclick="resetCurrentExercise('${ex.id}')">
            🔄 Ulangi
          </button>
          <button type="submit" class="btn btn-primary" id="btn-submit-exercise">
            ✓ Periksa &amp; Kirim Jawaban
          </button>
        </div>
      </form>

      <!-- Hasil Nilai Total -->
      <div id="exercise-score-result" style="display: none; margin-top: 1.5rem;"></div>
    </div>
  `;
}

// Helper normalisasi string jawaban
// Helper normalisasi string jawaban dengan dukungan singkatan baku bahasa Inggris
// ==========================================
// PEMBERIAN NILAI FLEKSIBEL & LENIENT (LEBIH LONGGAR)
// ==========================================

// Daftar kata kunci tata bahasa kritis (tidak boleh salah eja / salah bentuk grammar)
const CRITICAL_GRAMMAR_WORDS = new Set([
  "not", "no", "never",
  "am", "is", "are", "was", "were", "been", "being",
  "do", "does", "did", "done",
  "have", "has", "had",
  "will", "would", "shall", "should", "can", "could", "must", "might", "may",
  "to"
]);

// Hitung Levenshtein Distance untuk toleransi typo minor
function levenshteinDistance(s1, s2) {
  if (s1 === s2) return 0;
  if (!s1) return s2 ? s2.length : 0;
  if (!s2) return s1.length;
  
  const m = s1.length;
  const n = s2.length;
  let prevRow = [];
  let currRow = [];
  for (let j = 0; j <= n; j++) prevRow[j] = j;

  for (let i = 1; i <= m; i++) {
    currRow[0] = i;
    const c1 = s1.charCodeAt(i - 1);
    for (let j = 1; j <= n; j++) {
      const cost = c1 === s2.charCodeAt(j - 1) ? 0 : 1;
      currRow[j] = Math.min(
        currRow[j - 1] + 1,
        prevRow[j] + 1,
        prevRow[j - 1] + cost
      );
    }
    for (let j = 0; j <= n; j++) prevRow[j] = currRow[j];
  }
  return prevRow[n];
}

function normalizeAnswer(str) {
  if (!str && str !== "-") return "";
  let res = String(str)
    .trim()
    .toLowerCase();

  // 1. Normalisasi semua jenis kutip/apostrof ke apostrof standar '
  res = res.replace(/[‘’`´]/g, "'");

  // 2. Normalisasi singkatan baku bahasa Inggris (kontraksi)
  res = res
    .replace(/\bcan\'?t\b/g, "cannot")
    .replace(/\bcan\s+not\b/g, "cannot")
    .replace(/\bwon\'?t\b/g, "will not")
    .replace(/\baren\'?t\b/g, "are not")
    .replace(/\bisn\'?t\b/g, "is not")
    .replace(/\bdidn\'?t\b/g, "did not")
    .replace(/\bdoesn\'?t\b/g, "does not")
    .replace(/\bdon\'?t\b/g, "do not")
    .replace(/\bwasn\'?t\b/g, "was not")
    .replace(/\bweren\'?t\b/g, "were not")
    .replace(/\bhaven\'?t\b/g, "have not")
    .replace(/\bhasn\'?t\b/g, "has not")
    .replace(/\bhadn\'?t\b/g, "had not")
    .replace(/\bshouldn\'?t\b/g, "should not")
    .replace(/\bwouldn\'?t\b/g, "would not")
    .replace(/\bcouldn\'?t\b/g, "could not")
    .replace(/\bmustn\'?t\b/g, "must not")
    .replace(/\bneedn\'?t\b/g, "need not")
    .replace(/\bshan\'?t\b/g, "shall not")
    .replace(/\bi\'?m\b/g, "i am")
    .replace(/\byou\'?re\b/g, "you are")
    .replace(/\bwe\'?re\b/g, "we are")
    .replace(/\bthey\'?re\b/g, "they are")
    .replace(/\bhe\'?s\b/g, "he is")
    .replace(/\bshe\'?s\b/g, "she is")
    .replace(/\bit\'?s\b/g, "it is")
    .replace(/\bthat\'?s\b/g, "that is")
    .replace(/\bthere\'?s\b/g, "there is")
    .replace(/\bthere\'?re\b/g, "there are")
    .replace(/\bwho\'?s\b/g, "who is")
    .replace(/\bwhat\'?s\b/g, "what is")
    .replace(/\bwhere\'?s\b/g, "where is")
    .replace(/\bhow\'?s\b/g, "how is")
    .replace(/\blet\'?s\b/g, "let us")
    .replace(/\bi\'?ve\b/g, "i have")
    .replace(/\byou\'?ve\b/g, "you have")
    .replace(/\bwe\'?ve\b/g, "we have")
    .replace(/\bthey\'?ve\b/g, "they have")
    .replace(/\bi\'?ll\b/g, "i will")
    .replace(/\byou\'?ll\b/g, "you will")
    .replace(/\bhe\'?ll\b/g, "he will")
    .replace(/\bshe\'?ll\b/g, "she will")
    .replace(/\bwe\'?ll\b/g, "we will")
    .replace(/\bthey\'?ll\b/g, "they will")
    .replace(/\bit\'?ll\b/g, "it will")
    .replace(/\bi\'?d\b/g, "i would")
    .replace(/\byou\'?d\b/g, "you would")
    .replace(/\bhe\'?d\b/g, "he would")
    .replace(/\bshe\'?d\b/g, "she would")
    .replace(/\bwe\'?d\b/g, "we would")
    .replace(/\bthey\'?d\b/g, "they would");

  // 3. Normalisasi ejaan British vs American
  res = res
    .replace(/\bcolour(s?)\b/g, "color$1")
    .replace(/\bfavourite(s?)\b/g, "favorite$1")
    .replace(/\bflavour(s?)\b/g, "flavor$1")
    .replace(/\bneighbour(s?)\b/g, "neighbor$1")
    .replace(/\bhonour(s?)\b/g, "honor$1")
    .replace(/\bhumour\b/g, "humor")
    .replace(/\brumour(s?)\b/g, "rumor$1")
    .replace(/\btheatre(s?)\b/g, "theater$1")
    .replace(/\bcentre(s?)\b/g, "center$1")
    .replace(/\bmetre(s?)\b/g, "meter$1")
    .replace(/\blitre(s?)\b/g, "liter$1")
    .replace(/\borganis(e|ed|ing|ation)\b/g, "organiz$1")
    .replace(/\brealis(e|ed|ing|ation)\b/g, "realiz$1")
    .replace(/\brecognis(e|ed|ing|ation)\b/g, "recogniz$1")
    .replace(/\bapologis(e|ed|ing)\b/g, "apologiz$1")
    .replace(/\btravelling\b/g, "traveling")
    .replace(/\bcancelled\b/g, "canceled")
    .replace(/\bprogramme(s?)\b/g, "program$1")
    .replace(/\bgrey\b/g, "gray");

  // 4. Hapus tanda baca umum dan rapikan spasi berlebih
  return res
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?'"“”]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Menghapus kata keterangan derajat / intensifier dan artikel (the, a, an, very, much, etc.)
// Hanya digunakan jika kalimat aslinya terdiri dari minimal 3 kata.
function stripOptionalWords(normStr) {
  if (!normStr) return "";
  const optionalTokens = new Set([
    "the", "a", "an",
    "very", "much", "really", "just", "quite", "so", "too"
  ]);
  const tokens = normStr.split(" ");
  const filtered = tokens.filter(w => !optionalTokens.has(w));
  return filtered.join(" ").trim();
}

// Menormalisasi posisi adverb waktu (bisa di awal atau akhir kalimat)
function normalizeTimeAdverbPosition(normStr) {
  if (!normStr) return "";
  const adverbs = [
    "today", "tonight", "yesterday", "tomorrow", "now",
    "at the moment", "this morning", "this afternoon", "this evening",
    "this week", "next week", "last week", "last year", "next year", "last night"
  ];
  for (let adv of adverbs) {
    if (normStr.startsWith(adv + " ")) {
      const rest = normStr.slice(adv.length + 1).trim();
      return (rest + " " + adv).trim();
    }
  }
  return normStr;
}

// Cek kecocokan kalimat dengan toleransi typo minor (1-2 huruf typo)
function isSentenceFuzzyMatch(s1, s2) {
  if (s1 === s2) return true;
  const words1 = s1.split(" ");
  const words2 = s2.split(" ");
  
  if (words1.length === words2.length && words1.length >= 3) {
    let typoCount = 0;
    for (let i = 0; i < words1.length; i++) {
      const w1 = words1[i];
      const w2 = words2[i];
      if (w1 === w2) continue;
      
      // Kata grammar kritis tidak boleh salah
      if (CRITICAL_GRAMMAR_WORDS.has(w1) || CRITICAL_GRAMMAR_WORDS.has(w2)) {
        return false;
      }
      
      const dist = levenshteinDistance(w1, w2);
      if (w2.length >= 7 && dist <= 2) {
        typoCount++;
      } else if (w2.length >= 4 && dist <= 1) {
        typoCount++;
      } else {
        return false;
      }
    }
    const maxAllowedTypos = words1.length >= 7 ? 2 : 1;
    return typoCount <= maxAllowedTypos;
  }
  
  return false;
}

// Fungsi pembanding dua teks jawaban secara longgar & cerdas
function compareSingleAnswerLenient(studentStr, correctStr) {
  const normS = normalizeAnswer(studentStr);
  const normC = normalizeAnswer(correctStr);

  if (!normS || !normC) return false;

  // 1. Kecocokan persis setelah normalisasi
  if (normS === normC) return true;

  // 2. Kecocokan dengan penyesuaian posisi keterangan waktu (Time Adverb)
  const timeS = normalizeTimeAdverbPosition(normS);
  const timeC = normalizeTimeAdverbPosition(normC);
  if (timeS === timeC) return true;

  // 3. Toleransi typo pada kata tunggal panjang (>= 6 huruf, non-grammar)
  if (!normC.includes(" ") && !normS.includes(" ")) {
    if (normC.length >= 6 && !CRITICAL_GRAMMAR_WORDS.has(normC)) {
      if (levenshteinDistance(normS, normC) <= 1) return true;
    }
    return false;
  }

  // 4. Toleransi penghapusan kata opsional (the, a, an, very, much, just, really, quite, so, too)
  // Berlaku untuk kalimat dengan panjang minimal 3 kata
  const wordsC = normC.split(" ");
  if (wordsC.length >= 3) {
    const strippedS = stripOptionalWords(normS);
    const strippedC = stripOptionalWords(normC);

    if (strippedS && strippedC && strippedC.split(" ").length >= 2) {
      if (strippedS === strippedC) return true;

      // Cek dengan normalisasi posisi adverb waktu setelah stripping
      const strippedTimeS = normalizeTimeAdverbPosition(strippedS);
      const strippedTimeC = normalizeTimeAdverbPosition(strippedC);
      if (strippedTimeS === strippedTimeC) return true;

      // Cek fuzzy typo pada stripped
      if (isSentenceFuzzyMatch(strippedS, strippedC)) return true;
      if (isSentenceFuzzyMatch(strippedTimeS, strippedTimeC)) return true;
    }

    // 5. Cek typo pada kalimat lengkap
    if (isSentenceFuzzyMatch(normS, normC)) return true;
    if (isSentenceFuzzyMatch(timeS, timeC)) return true;
  }

  return false;
}

function handleGradeExercise(e, exId) {
  e.preventDefault();
  if (!AppState.selectedUnit || !AppState.selectedExercise) return;

  const ex = AppState.selectedExercise;
  const questions = ex.questions || [];
  let score = 0;
  const total = questions.length;

  questions.forEach((q, qIdx) => {
    let studentAns = "";
    if (ex.type === "choice") {
      const selected = document.querySelector(`input[name="q_${ex.id}_${qIdx}"]:checked`);
      studentAns = selected ? selected.value.trim() : "";
    } else {
      const inputElem = document.getElementById(`input_q_${ex.id}_${qIdx}`);
      studentAns = inputElem ? inputElem.value.trim() : "";
    }

    const card = document.getElementById(`card_q_${ex.id}_${qIdx}`);
    const fb = document.getElementById(`fb_q_${ex.id}_${qIdx}`);

    const isCorrect = checkAnswerCorrectness(studentAns, q);
    if (isCorrect) {
      score++;
      if (card) card.style.borderLeft = "3px solid #16A34A";
      if (fb) {
        fb.style.display = "block";
        fb.style.backgroundColor = "#F0FDF4";
        fb.style.border = "1px solid #BBF7D0";
        fb.style.color = "#166534";
        fb.innerHTML = `
          <strong>✓ Benar!</strong> ${escapeHtml(q.explanation || "")}
        `;
      }
    } else {
      if (card) card.style.borderLeft = "3px solid #DC2626";
      if (fb) {
        fb.style.display = "block";
        fb.style.backgroundColor = "#FEF2F2";
        fb.style.border = "1px solid #FECACA";
        fb.style.color = "#991B1B";
        const ansText = String(q.answer || "").trim();
        const formattedAns = ansText.endsWith(".") || ansText.endsWith("?") || ansText.endsWith("!")
          ? ansText
          : ansText + ".";
        fb.innerHTML = `
          <strong>✗ Kurang Tepat.</strong> Jawaban yang benar: <strong>${escapeHtml(formattedAns)}</strong><br>
          <span style="font-size: 0.8rem; color: #475569;">${escapeHtml(q.explanation || q.hint || "")}</span>
        `;
      }
    }
  });

  const percentage = Math.round((score / total) * 100);
  const isPassed = percentage >= APP_CONFIG.minPassingScore;
  const statusStr = isPassed ? "LULUS" : "BELUM LULUS";

  // Tampilkan Hasil Evaluasi
  const resultDiv = document.getElementById("exercise-score-result");
  if (resultDiv) {
    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
      <div class="card" style="background-color: ${isPassed ? '#F0FDF4' : '#FEF2F2'}; border: 2px solid ${isPassed ? '#86EFAC' : '#FCA5A5'}; text-align: center; padding: 1.5rem;">
        <div style="font-size: 2.25rem; font-weight: 800; color: ${isPassed ? '#16A34A' : '#DC2626'};">
          ${score} / ${total}
        </div>
        <div style="font-size: 1.15rem; font-weight: 700; color: #1E293B;">
          Skor: ${percentage}% &mdash; <span class="badge ${isPassed ? 'badge-success' : 'badge-danger'}">${statusStr}</span>
        </div>
        <p style="font-size: 0.875rem; color: #475569; margin-top: 0.5rem;">
          ${isPassed ? '🎉 Hebat! Anda telah melampaui batas KKM kelulusan 75%.' : 'Tetap semangat! Pelajari kembali pembahasannya dan coba lagi untuk mencapai KKM 75%.'}
        </p>
      </div>
    `;
    resultDiv.scrollIntoView({ behavior: "smooth" });
  }

  // Simpan ke State & LocalStorage
  const record = {
    timestamp: new Date().toLocaleString("id-ID"),
    username: AppState.currentUser.username,
    nama: AppState.currentUser.nama,
    tingkat: AppState.currentUser.tingkat,
    rombel: AppState.currentUser.rombel,
    unitId: AppState.selectedUnit.id,
    exerciseId: ex.id,
    exerciseTitle: ex.title,
    skor: score,
    totalSoal: total,
    persentase: `${percentage}%`,
    status: statusStr,
    synced: false
  };

  // UPDATE NILAI JIKA LATIHAN INI SUDAH PERNAH DIKERJAKAN (Saat murid mengulang, nilai terupdate!)
  const existingIdx = AppState.scores.findIndex(
    s => s.username && s.username.toUpperCase() === record.username.toUpperCase() && s.exerciseId === record.exerciseId
  );
  if (existingIdx !== -1) {
    AppState.scores[existingIdx] = record;
  } else {
    AppState.scores.push(record);
  }
  saveScoresToStorage();

  if (typeof ExercisesStore !== "undefined" && typeof ExercisesStore.saveProgress === "function") {
    ExercisesStore.saveProgress(AppState.currentUser.username, ex.id, score, total, percentage, statusStr);
  }

  // Kirim nilai ke Google Spreadsheet secara online
  syncScoreToGAS(record);
}

function checkAnswerCorrectness(studentAns, questionObj) {
  if (!studentAns && studentAns !== "-") return false;
  const rawStudent = String(studentAns).trim();
  const rawCorrect = String(questionObj.answer || "").trim();

  // 1. Cek jika jawaban berupa strip '-' (tanpa artikel)
  if (rawCorrect === "-" || rawCorrect === "none" || rawCorrect === "no article") {
    const sLower = rawStudent.toLowerCase();
    if (sLower === "-" || sLower === "none" || sLower === "no article" || sLower === "tanpa artikel" || sLower === "strip" || sLower === "") {
      return true;
    }
  }

  // 2. Bandingkan jawaban utama dengan fleksibilitas tinggi
  if (compareSingleAnswerLenient(rawStudent, rawCorrect)) return true;

  // 3. Bandingkan alternatif jawaban yang terdaftar
  const alternates = questionObj.alternateAnswers || [];
  for (let alt of alternates) {
    if (compareSingleAnswerLenient(rawStudent, alt)) return true;
  }

  // 4. Cek jika jawaban di dalam kurung pilihan / opsi bergaris miring (misal: "Yes, I am. / No, I'm not.")
  if (rawCorrect.includes("/")) {
    const slashOptions = rawCorrect.split("/").map(s => s.trim());
    for (let opt of slashOptions) {
      if (opt && compareSingleAnswerLenient(rawStudent, opt)) return true;
    }
  }

  // 5. Cek jika jawaban terdiri dari beberapa bagian (dipisahkan '/', ',', ';', atau spasi)
  const splitRegex = /[/,;|\n]+/;
  if (rawCorrect.includes("/") || rawCorrect.includes(",") || rawCorrect.includes(";")) {
    const partsCorrect = rawCorrect.split(splitRegex).map(s => s.trim()).filter(Boolean);
    if (partsCorrect.length > 1) {
      let partsStudent = rawStudent.split(splitRegex).map(s => s.trim()).filter(Boolean);
      // Jika siswa mengetik tanpa tanda pemisah (hanya dipisah spasi), coba cocokkan
      if (partsStudent.length !== partsCorrect.length) {
        const spaceParts = rawStudent.trim().split(/\s+/);
        if (spaceParts.length === partsCorrect.length) {
          partsStudent = spaceParts;
        }
      }

      if (partsCorrect.length === partsStudent.length) {
        let allMatch = true;
        for (let i = 0; i < partsCorrect.length; i++) {
          const cPart = partsCorrect[i];
          const sPart = partsStudent[i];
          // Handle '-' pada salah satu bagian (misal "a / -")
          if (!cPart || cPart === "-" || cPart === "none" || cPart === "no article") {
            const normSPart = normalizeAnswer(sPart);
            if (normSPart !== "" && normSPart !== "-" && normSPart !== "none") {
              allMatch = false;
              break;
            }
          } else if (!compareSingleAnswerLenient(sPart, cPart)) {
            allMatch = false;
            break;
          }
        }
        if (allMatch) return true;
      }
    }
  }

  return false;
}

function resetCurrentExercise(exId) {
  if (AppState.selectedExercise) {
    renderSingleExercise(AppState.selectedExercise, AppState.selectedUnit);
    showToast("Latihan telah diatur ulang.", "info");
  }
}

// ==========================================
// 6. HALAMAN REKAMAN CAPAIAN SISWA & DOWNLOAD PDF
// ==========================================
function renderStudentRecord() {
  const container = document.getElementById("student-record-container");
  if (!container) return;

  const user = AppState.currentUser;
  if (!user || user.role === "Guru") {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 2rem;">
        <h3>Portal Capaian Siswa</h3>
        <p style="color: #64748B;">Halaman ini khusus untuk siswa Tingkat XI &amp; XII yang terdaftar guna melihat riwayat nilai dan mencetak Rapor Capaian PDF.</p>
        <button class="btn btn-primary" style="margin-top: 1rem;" onclick="openModal('modal-login')">Masuk Sebagai Siswa</button>
      </div>
    `;
    return;
  }

  // Filter nilai siswa aktif: ambil nilai TERBARU per exerciseId
  const myScoresMap = new Map();
  AppState.scores
    .filter(s => s.username && s.username.toUpperCase() === user.username.toUpperCase())
    .forEach(s => {
      let pct = 0;
      if (s.totalSoal && Number(s.totalSoal) > 0) {
        pct = Math.round((Number(s.skor) / Number(s.totalSoal)) * 100);
      } else {
        const rawP = String(s.persentase || "").replace("%", "").trim();
        const pNum = parseFloat(rawP) || 0;
        pct = pNum <= 1 && pNum > 0 ? Math.round(pNum * 100) : Math.round(pNum);
      }
      s.pctNum = pct;
      s.persentaseFormatted = `${pct}%`;
      // Timpa dengan rekaman terbaru untuk latihan yang sama
      myScoresMap.set(s.exerciseId, s);
    });

  const myScores = Array.from(myScoresMap.values());
  const totalLatihan = myScores.length;
  const avgPercentage = totalLatihan > 0
    ? Math.round(myScores.reduce((acc, cur) => acc + (cur.pctNum || 0), 0) / totalLatihan)
    : 0;
  const totalLulus = myScores.filter(s => s.status === "LULUS" || (s.pctNum || 0) >= 75).length;

  container.innerHTML = `
    <!-- Header Resmi Saat Cetak PDF -->
    <div class="print-header-official">
      <h2>REKAMAN CAPAIAN PEMBELAJARAN SISWA</h2>
      <p>Mata Pelajaran: Bahasa Inggris &mdash; Portal Grammar Plus B1 (Sarah Jane Lewis)</p>
      <p>Kurikulum Merdeka &mdash; Fase F (Tingkat XI &amp; XII)</p>
    </div>

    <div class="card" style="border-top: 4px solid var(--primary);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="badge badge-primary">KARTU HASIL BELAJAR</span>
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #0F172A; margin-top: 0.25rem;">
            ${escapeHtml(user.nama)}
          </h2>
          <p style="color: #475569; font-size: 0.875rem;">
            Username: <code>${escapeHtml(user.username)}</code> | Kelas: <strong>${escapeHtml(user.tingkat)} - Rombel ${escapeHtml(user.rombel)}</strong> | Presensi: <strong>#${escapeHtml(user.presensi)}</strong>
          </p>
        </div>
        <div class="no-print">
          <button class="btn btn-primary" onclick="window.print()">
            🖨️ Cetak / Unduh Capaian (PDF)
          </button>
        </div>
      </div>

      <!-- Ringkasan Statistik -->
      <div class="form-row" style="margin-top: 1.5rem; margin-bottom: 0.5rem;">
        <div class="card" style="margin-bottom: 0; text-align: center; background: #F8FAFC;">
          <div style="font-size: 0.8rem; color: #64748B; font-weight: 600;">TOTAL LATIHAN</div>
          <div style="font-size: 1.75rem; font-weight: 800; color: #2563EB;">${totalLatihan}</div>
        </div>
        <div class="card" style="margin-bottom: 0; text-align: center; background: #F8FAFC;">
          <div style="font-size: 0.8rem; color: #64748B; font-weight: 600;">RATA-RATA SKOR</div>
          <div style="font-size: 1.75rem; font-weight: 800; color: ${avgPercentage >= 75 ? '#16A34A' : '#D97706'};">${avgPercentage}%</div>
        </div>
        <div class="card" style="margin-bottom: 0; text-align: center; background: #F8FAFC;">
          <div style="font-size: 0.8rem; color: #64748B; font-weight: 600;">STATUS KELULUSAN (KKM 75%)</div>
          <div style="font-size: 1.75rem; font-weight: 800; color: #16A34A;">${totalLulus} / ${totalLatihan}</div>
        </div>
      </div>
    </div>

    <!-- Tabel Rekapan Nilai -->
    <div class="card" style="margin-top: 1.25rem;">
      <h3 style="font-size: 1.1rem; font-weight: 800; color: #0F172A; margin-bottom: 1rem;">
        Riwayat Pengerjaan Latihan
      </h3>
      ${myScores.length === 0 ? `
        <p style="color: #64748B; text-align: center; padding: 2rem;">Belum ada riwayat pengerjaan latihan. Silakan kerjakan latihan pada tab <strong>Latihan Interaktif</strong>.</p>
      ` : `
        <div class="grammar-table-wrapper">
          <table class="table-grammar">
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Unit</th>
                <th>Judul Latihan</th>
                <th>Skor</th>
                <th>Persentase</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${myScores.map(s => `
                <tr>
                  <td>${escapeHtml(s.timestamp)}</td>
                  <td><strong>Unit ${escapeHtml(String(s.unitId))}</strong></td>
                  <td>${escapeHtml(s.exerciseTitle)}</td>
                  <td>${s.skor} / ${s.totalSoal}</td>
                  <td><strong>${escapeHtml(s.persentaseFormatted || s.persentase)}</strong></td>
                  <td>
                    <span class="badge ${s.status === 'LULUS' ? 'badge-success' : 'badge-danger'}">
                      ${escapeHtml(s.status)}
                    </span>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;
}

// ==========================================
// 7. PORTAL GURU, REKAP SISWA & EXPORT EXCEL
// ==========================================
function renderTeacherDashboard() {
  const container = document.getElementById("teacher-dashboard-container");
  if (!container) return;

  const totalSiswa = AppState.students.filter(s => s.role === "Siswa").length;

  // Gunakan map unik per murid dan latihan agar selalu menampilkan nilai terbaru
  const uniqueScoresMap = new Map();
  AppState.scores.forEach(sc => {
    if (!sc.username) return;
    const key = `${sc.username.toUpperCase()}___${sc.exerciseId}`;
    let pct = 0;
    if (sc.totalSoal && Number(sc.totalSoal) > 0) {
      pct = Math.round((Number(sc.skor) / Number(sc.totalSoal)) * 100);
    } else {
      const rawP = String(sc.persentase || "").replace("%", "").trim();
      const pNum = parseFloat(rawP) || 0;
      pct = pNum <= 1 && pNum > 0 ? Math.round(pNum * 100) : Math.round(pNum);
    }
    sc.pctNum = pct;
    sc.persentaseFormatted = `${pct}%`;
    uniqueScoresMap.set(key, sc);
  });
  const displayScores = Array.from(uniqueScoresMap.values());
  const totalSubmissions = displayScores.length;

  container.innerHTML = `
    <div class="card" style="border-top: 4px solid #F59E0B;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="badge" style="background-color: #FEF3C7; color: #B45309; border: 1px solid #FDE68A;">PORTAL KHUSUS GURU</span>
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #0F172A; margin-top: 0.25rem;">Panel Rekapitulasi &amp; Manajemen Kelas (XI &amp; XII)</h2>
          <p style="color: #64748B; font-size: 0.875rem;">Pantau seluruh perkembangan belajar murid, daftarkan murid, dan unduh rekapan ke Excel.</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-primary btn-sm" onclick="openModal('modal-add-student-guru')">
            ➕ Daftarkan Murid Baru
          </button>
          <button class="btn btn-success btn-sm" onclick="exportGradesToExcel()">
            📊 Unduh Rekaman Hasil Latihan (Excel)
          </button>
        </div>
      </div>
    </div>

    <!-- Ringkasan Guru -->
    <div class="form-row" style="margin-bottom: 1.5rem;">
      <div class="card" style="margin-bottom: 0; text-align: center;">
        <div style="font-size: 0.8rem; color: #64748B; font-weight: 600;">TOTAL MURID KELAS XI &amp; XII</div>
        <div style="font-size: 2rem; font-weight: 800; color: #2563EB;">${totalSiswa}</div>
      </div>
      <div class="card" style="margin-bottom: 0; text-align: center;">
        <div style="font-size: 0.8rem; color: #64748B; font-weight: 600;">TOTAL LATIHAN DIKERJAKAN</div>
        <div style="font-size: 2rem; font-weight: 800; color: #16A34A;">${totalSubmissions}</div>
      </div>
    </div>

    <!-- Tabel Daftar Murid Terdaftar -->
    <div class="card" style="margin-bottom: 1.5rem;">
      <div class="card-header">
        <h3 class="card-title">👥 Daftar Murid Terdaftar (Tingkat XI &amp; XII)</h3>
      </div>
      <div class="grammar-table-wrapper">
        <table class="table-grammar">
          <thead>
            <tr>
              <th>No</th>
              <th>Username</th>
              <th>Nama Lengkap</th>
              <th>Tingkat</th>
              <th>Fase</th>
              <th>Rombel</th>
              <th>Presensi</th>
              <th>Tanggal Lahir</th>
            </tr>
          </thead>
          <tbody>
            ${AppState.students.filter(s => s.role === "Siswa").map((s, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td><code>${escapeHtml(s.username)}</code></td>
                <td><strong>${escapeHtml(s.nama)}</strong></td>
                <td>${escapeHtml(s.tingkat)}</td>
                <td>${escapeHtml(s.fase)}</td>
                <td>${escapeHtml(s.rombel)}</td>
                <td>#${escapeHtml(s.presensi)}</td>
                <td>${escapeHtml(s.tanggalLahir)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tabel Seluruh Nilai Siswa (Hasil Mutakhir) -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">📝 Seluruh Rekapan Nilai Latihan Siswa (Nilai Terkini)</h3>
      </div>
      <div class="grammar-table-wrapper">
        <table class="table-grammar">
          <thead>
            <tr>
              <th>Waktu</th>
              <th>Username</th>
              <th>Nama Siswa</th>
              <th>Kelas</th>
              <th>Unit</th>
              <th>Latihan</th>
              <th>Skor</th>
              <th>Persentase</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${displayScores.map(sc => `
              <tr>
                <td>${escapeHtml(sc.timestamp)}</td>
                <td><code>${escapeHtml(sc.username)}</code></td>
                <td>${escapeHtml(sc.nama || "-")}</td>
                <td>${escapeHtml(sc.tingkat || "-")}-${escapeHtml(sc.rombel || "-")}</td>
                <td>Unit ${escapeHtml(String(sc.unitId))}</td>
                <td>${escapeHtml(sc.exerciseTitle || sc.exerciseId)}</td>
                <td>${sc.skor} / ${sc.totalSoal}</td>
                <td><strong>${escapeHtml(sc.persentaseFormatted || sc.persentase)}</strong></td>
                <td>
                  <span class="badge ${sc.status === 'LULUS' ? 'badge-success' : 'badge-danger'}">
                    ${escapeHtml(sc.status)}
                  </span>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Export Excel Menggunakan SheetJS
function exportGradesToExcel() {
  if (typeof XLSX === "undefined") {
    showToast("Library SheetJS sedang dimuat, coba sesaat lagi.", "warning");
    return;
  }

  const wb = XLSX.utils.book_new();

  // Ambil nilai mutakhir per murid dan latihan
  const uniqueScoresMap = new Map();
  AppState.scores.forEach(sc => {
    if (!sc.username) return;
    const key = `${sc.username.toUpperCase()}___${sc.exerciseId}`;
    let pct = 0;
    if (sc.totalSoal && Number(sc.totalSoal) > 0) {
      pct = Math.round((Number(sc.skor) / Number(sc.totalSoal)) * 100);
    } else {
      const rawP = String(sc.persentase || "").replace("%", "").trim();
      const pNum = parseFloat(rawP) || 0;
      pct = pNum <= 1 && pNum > 0 ? Math.round(pNum * 100) : Math.round(pNum);
    }
    sc.persentaseFormatted = `${pct}%`;
    uniqueScoresMap.set(key, sc);
  });
  const exportScores = Array.from(uniqueScoresMap.values());

  // Sheet 1: Nilai Siswa
  const scoresData = exportScores.map((s, idx) => ({
    "No": idx + 1,
    "Waktu": s.timestamp,
    "Username": s.username,
    "Nama Lengkap": s.nama || "-",
    "Tingkat": s.tingkat || "-",
    "Rombel": s.rombel || "-",
    "Unit ID": s.unitId,
    "Latihan": s.exerciseTitle || s.exerciseId,
    "Skor": s.skor,
    "Total Soal": s.totalSoal,
    "Persentase": s.persentaseFormatted || s.persentase,
    "Status": s.status
  }));
  const wsScores = XLSX.utils.json_to_sheet(scoresData);
  XLSX.utils.book_append_sheet(wb, wsScores, "Rekap Nilai Siswa");

  // Sheet 2: Data Siswa
  const studentsData = AppState.students.filter(s => s.role === "Siswa").map((s, idx) => ({
    "No": idx + 1,
    "Waktu Daftar": s.timestamp,
    "Username": s.username,
    "Nama Lengkap": s.nama,
    "Tingkat": s.tingkat,
    "Fase": s.fase,
    "Rombel": s.rombel,
    "Presensi": s.presensi,
    "Tanggal Lahir": s.tanggalLahir
  }));
  const wsStudents = XLSX.utils.json_to_sheet(studentsData);
  XLSX.utils.book_append_sheet(wb, wsStudents, "Daftar Siswa XI & XII");

  const filename = `Grammar_Plus_B1_Rekap_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, filename);
  showToast(`File Excel ${filename} berhasil diunduh!`, "success");
}

// ==========================================
// 8. LAMPIRAN (IRREGULAR VERBS, FONETIK, AUDIO)
// ==========================================
function initAppendices() {
  renderLampiranA();
  renderLampiranB();
  renderAudioTranscripts();
}

function renderLampiranA() {
  const container = document.getElementById("lampiran-a-container");
  if (!container || !window.LAMPIRAN_A) return;

  container.innerHTML = `
    <div class="grammar-table-wrapper">
      <table class="table-grammar">
        <thead>
          <tr>
            <th>Bentuk Dasar (Infinitive)</th>
            <th>Past Simple (V2)</th>
            <th>Past Participle (V3)</th>
            <th>Arti / Makna</th>
          </tr>
        </thead>
        <tbody>
          ${window.LAMPIRAN_A.map(v => `
            <tr>
              <td><strong>${escapeHtml(v.base)}</strong></td>
              <td>${escapeHtml(v.past_simple)}</td>
              <td>${escapeHtml(v.past_participle)}</td>
              <td style="color: #64748B;">${escapeHtml(v.meaning)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderLampiranB() {
  const container = document.getElementById("lampiran-b-container");
  if (!container || !window.APPENDICES_DATA) return;

  const phonetics = window.APPENDICES_DATA.symbols || [];
  const punctuation = window.APPENDICES_DATA.punctuation || [];

  container.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <h4 style="font-size: 0.95rem; font-weight: 700; color: #1E293B; margin-bottom: 0.5rem;">Alfabet Fonetis Internasional (IPA)</h4>
      <div class="grammar-table-wrapper">
        <table class="table-grammar">
          <thead>
            <tr>
              <th>Kategori</th>
              <th>Simbol Fonetis</th>
              <th>Contoh Kata</th>
            </tr>
          </thead>
          <tbody>
            ${phonetics.map(p => `
              <tr>
                <td>${escapeHtml(p.type)}</td>
                <td><strong style="color: #2563EB;">${escapeHtml(p.symbol)}</strong></td>
                <td><em>${escapeHtml(p.example)}</em></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div>
      <h4 style="font-size: 0.95rem; font-weight: 700; color: #1E293B; margin-bottom: 0.5rem;">Tanda Baca Bahasa Inggris (Punctuation Marks)</h4>
      <div class="grammar-table-wrapper">
        <table class="table-grammar">
          <thead>
            <tr>
              <th>Tanda Baca</th>
              <th>Istilah Indonesia</th>
              <th>Penggunaan Baku</th>
            </tr>
          </thead>
          <tbody>
            ${punctuation.map(p => `
              <tr>
                <td><strong>${escapeHtml(p.mark)}</strong></td>
                <td>${escapeHtml(p.indo)}</td>
                <td style="color: #475569;">${escapeHtml(p.use)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAudioTranscripts() {
  const container = document.getElementById("audio-transcripts-container");
  if (!container || !window.AUDIO_TRANSCRIPTS) return;

  container.innerHTML = window.AUDIO_TRANSCRIPTS.map(a => `
    <div class="card" style="margin-bottom: 1rem; border-left: 3px solid #F59E0B;">
      <h4 style="font-size: 0.95rem; font-weight: 700; color: #B45309;">${escapeHtml(a.track)}</h4>
      <div style="font-size: 0.85rem; color: #334155; line-height: 1.7; white-space: pre-wrap; margin-top: 0.5rem; font-family: monospace;">
        ${escapeHtml(a.content)}
      </div>
    </div>
  `).join("");
}

// ==========================================
// 9. GOOGLE SPREADSHEET SYNC ENGINE
// ==========================================
function initSettingsUI() {
  const gasInput = document.getElementById("settings-gas-url");
  if (gasInput && AppState.gasUrl) {
    gasInput.value = AppState.gasUrl;
  }
}

function saveGasUrl() {
  const input = document.getElementById("settings-gas-url");
  if (!input) return;
  const url = input.value.trim();
  AppState.gasUrl = url;
  localStorage.setItem("grammar_b1_gas_url", url);
  showToast("URL Google Apps Script berhasil disimpan!", "success");
  testGasConnection();
}

function testGasConnection() {
  const statusElem = document.getElementById("sync-status-text");
  const dot = document.getElementById("sync-status-dot");
  if (!AppState.gasUrl) {
    if (statusElem) statusElem.innerText = "Mode Lokal (Belum Terhubung GAS)";
    if (dot) dot.className = "dot-indicator";
    return;
  }

  if (statusElem) statusElem.innerText = "Memeriksa koneksi ke Google Spreadsheet...";
  
  fetch(`${AppState.gasUrl}?action=ping`, { method: "GET", mode: "no-cors" })
    .then(() => {
      if (statusElem) statusElem.innerText = `Database Terhubung: Google Spreadsheet 1rTpLFo_QD6-XhcQE43CAZZc3WbI0gkiCXIjhSvg_CPc`;
      if (dot) dot.className = "dot-indicator online";
      showToast("Koneksi ke Google Apps Script berhasil terverifikasi!", "success");
    })
    .catch((err) => {
      console.warn("Test ping error:", err);
      if (statusElem) statusElem.innerText = "Gagal terhubung ke GAS URL";
      if (dot) dot.className = "dot-indicator offline";
      showToast("Gagal terhubung ke URL Google Apps Script.", "danger");
    });
}

function fetchGAS(action) {
  return new Promise((resolve, reject) => {
    if (!AppState.gasUrl) return reject(new Error("GAS URL kosong"));

    const callbackName = "gas_cb_" + Math.random().toString(36).substring(2, 9);
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Request ke Google Apps Script timeout (15 detik)"));
    }, 15000);

    function cleanup() {
      clearTimeout(timeout);
      delete window[callbackName];
      const script = document.getElementById(callbackName);
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    }

    window[callbackName] = function(data) {
      cleanup();
      resolve(data);
    };

    // Gunakan JSONP via script tag untuk mengatasi limitasi CORS cross-device di peramban
    const script = document.createElement("script");
    script.id = callbackName;
    const sep = AppState.gasUrl.includes("?") ? "&" : "?";
    script.src = `${AppState.gasUrl}${sep}action=${encodeURIComponent(action)}&callback=${callbackName}&_t=${Date.now()}`;
    script.onerror = function() {
      cleanup();
      // Fallback ke fetch standar
      fetch(`${AppState.gasUrl}${sep}action=${encodeURIComponent(action)}`)
        .then(res => res.json())
        .then(resolve)
        .catch(reject);
    };
    document.head.appendChild(script);
  });
}

async function syncStudentsFromGAS() {
  if (!AppState.gasUrl) return;
  try {
    const data = await fetchGAS("getStudents");
    if (data && data.status === "success" && Array.isArray(data.students)) {
      const map = new Map();
      AppState.students.forEach(s => {
        if (s && s.username) map.set(s.username.toUpperCase(), s);
      });
      data.students.forEach(s => {
        if (!s || !s.username) return;
        let pass = String(s.password || "").trim();
        // Jika angka 0 di depan terpotong oleh format number spreadsheet
        if (/^\d{7}$/.test(pass)) {
          pass = "0" + pass;
        }
        s.password = pass;
        map.set(s.username.toUpperCase(), s);
      });
      AppState.students = Array.from(map.values());
      saveStudentsToStorage();
    }
  } catch (err) {
    console.warn("Sinkronisasi siswa dari GAS:", err);
  }
}

async function syncScoresFromGAS() {
  if (!AppState.gasUrl) return;
  try {
    const data = await fetchGAS("getScores");
    if (data && data.status === "success" && Array.isArray(data.scores)) {
      const map = new Map();
      AppState.scores.forEach(sc => {
        if (sc && sc.username && sc.exerciseId) {
          map.set(`${sc.username.toUpperCase()}___${sc.exerciseId}`, sc);
        }
      });
      data.scores.forEach(sc => {
        if (!sc || !sc.username || !sc.exerciseId) return;
        const key = `${sc.username.toUpperCase()}___${sc.exerciseId}`;
        let pct = 0;
        if (sc.totalSoal && Number(sc.totalSoal) > 0) {
          pct = Math.round((Number(sc.skor) / Number(sc.totalSoal)) * 100);
        } else {
          const rawP = String(sc.persentase || "").replace("%", "").trim();
          const pNum = parseFloat(rawP) || 0;
          pct = pNum <= 1 && pNum > 0 ? Math.round(pNum * 100) : Math.round(pNum);
        }
        sc.pctNum = pct;
        sc.persentase = `${pct}%`;
        sc.synced = true;
        map.set(key, sc);
      });
      AppState.scores = Array.from(map.values());
      saveScoresToStorage();
    }
  } catch (err) {
    console.warn("Sinkronisasi nilai dari GAS:", err);
  }
}

function syncStudentToGAS(student) {
  if (!AppState.gasUrl) return;

  const payload = {
    action: "register",
    ...student
  };

  fetch(AppState.gasUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then(() => {
    student.synced = true;
    saveStudentsToStorage();
  }).catch(e => {
    console.warn("GAS sync error for student:", e);
  });
}

function syncScoreToGAS(score) {
  if (!AppState.gasUrl) return;

  const payload = {
    action: "submitScore",
    ...score
  };

  fetch(AppState.gasUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then(() => {
    score.synced = true;
    saveScoresToStorage();
    showToast("Nilai berhasil dicatat ke Google Spreadsheet!", "success");
  }).catch(e => {
    console.warn("GAS score sync error:", e);
  });
}

// ==========================================
// 10. UTILITIES & MODAL HELPERS
// ==========================================
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("show");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove("show");
}

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerText = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

function escapeHtml(text) {
  if (text === null || text === undefined) return "";
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}
