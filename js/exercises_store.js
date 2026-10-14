/**
 * GRAMMAR PLUS B1 - PERSISTENT EXERCISES DATABASE STORE
 * Lightweight persistent JSON storage engine using LocalStorage & In-Memory Cache
 */

const ExercisesStore = {
  STORAGE_KEY: "grammar_b1_exercises_v1.0",
  PROGRESS_KEY: "grammar_b1_progress_v1",
  db: null,

  _getStorage(key) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      if (typeof localStorage !== "undefined") {
        return localStorage.getItem(key);
      }
    } catch (e) {
      return null;
    }
    return null;
  },

  _setStorage(key, value) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
        return true;
      }
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, value);
        return true;
      }
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
      return false;
    }
    return false;
  },

  init() {
    try {
      const sourceUnits = (typeof GRAMMAR_UNITS !== "undefined" && Array.isArray(GRAMMAR_UNITS))
        ? GRAMMAR_UNITS
        : ((typeof window !== "undefined" && Array.isArray(window.GRAMMAR_UNITS)) ? window.GRAMMAR_UNITS : []);

      const stored = this._getStorage(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.units) && parsed.units.length >= 40) {
          const u1 = parsed.units.find(u => u.id === 1);
          if (u1 && u1.exercises && u1.exercises.length >= 9) {
            this.db = parsed;
            if (typeof window !== "undefined") window.GRAMMAR_UNITS = this.db.units;
            return;
          }
        }
      }

      // Initialize from sourceUnits
      if (sourceUnits && sourceUnits.length > 0) {
        this.db = {
          version: "1.0.0",
          course: "Grammar Plus B1",
          updatedAt: new Date().toISOString(),
          units: sourceUnits
        };
        if (typeof window !== "undefined") window.GRAMMAR_UNITS = sourceUnits;
        this._setStorage(this.STORAGE_KEY, JSON.stringify(this.db));
      }
    } catch (e) {
      console.warn("ExercisesStore init warning:", e);
      const fallback = (typeof GRAMMAR_UNITS !== "undefined" && Array.isArray(GRAMMAR_UNITS))
        ? GRAMMAR_UNITS
        : ((typeof window !== "undefined" && Array.isArray(window.GRAMMAR_UNITS)) ? window.GRAMMAR_UNITS : []);
      this.db = { version: "1.0.0", units: fallback };
      if (typeof window !== "undefined") window.GRAMMAR_UNITS = fallback;
    }
  },

  getAllUnits() {
    if (this.db && Array.isArray(this.db.units) && this.db.units.length > 0) {
      return this.db.units;
    }
    if (typeof GRAMMAR_UNITS !== "undefined" && Array.isArray(GRAMMAR_UNITS) && GRAMMAR_UNITS.length > 0) {
      return GRAMMAR_UNITS;
    }
    if (typeof window !== "undefined" && Array.isArray(window.GRAMMAR_UNITS) && window.GRAMMAR_UNITS.length > 0) {
      return window.GRAMMAR_UNITS;
    }
    return [];
  },

  getUnit(unitId) {
    const units = this.getAllUnits();
    return units.find(u => u.id === Number(unitId)) || null;
  },

  getExercises(unitId) {
    const unit = this.getUnit(unitId);
    return unit ? (unit.exercises || []) : [];
  },

  saveProgress(username, exId, score, total, percentage, status) {
    if (!username) return;
    try {
      const raw = this._getStorage(this.PROGRESS_KEY);
      const existing = JSON.parse(raw || "{}");
      if (!existing[username]) existing[username] = {};
      existing[username][exId] = {
        score,
        total,
        percentage,
        status,
        timestamp: new Date().toISOString()
      };
      this._setStorage(this.PROGRESS_KEY, JSON.stringify(existing));
    } catch (e) {
      console.error("Failed to save progress:", e);
    }
  },

  getProgress(username) {
    if (!username) return {};
    try {
      const raw = this._getStorage(this.PROGRESS_KEY);
      return JSON.parse(raw || "{}")[username] || {};
    } catch (e) {
      return {};
    }
  }
};

if (typeof window !== "undefined") {
  window.ExercisesStore = ExercisesStore;
}
