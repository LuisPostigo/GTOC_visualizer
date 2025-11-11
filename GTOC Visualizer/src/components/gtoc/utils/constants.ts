export const SYSTEM_NAME = "Altaira System";

/* ===================== Universal Constants ===================== */
export const AU_KM = 149_597_870.691;            // kilometers per astronomical unit
export const SECONDS_PER_DAY = 86_400;           // seconds per day
export const DAYS_PER_YEAR = 365.25;             // mean solar days per year
export const ALTAIRA_GM = 139_348_062_043.343;   // km³/s² (gravitational parameter)

/* ===================== Time References ===================== */
// J2000 (TT). Also used as the **file epoch t₀** for solution epochs (seconds since t₀).
export const JD_EPOCH_0 = 2451545.0;

// Viewer start epoch; alias to file t₀ to keep viewer-time == file-time.
export const JD_SIM_START = JD_EPOCH_0;

// Unix epoch (1970-01-01T00:00:00Z) expressed in Julian Date.
export const UNIX_EPOCH_JD = 2440587.5;

// Milliseconds per day (keep spelling to match existing imports elsewhere).
export const MILISECONDS_PER_DAY = 86_400_000;

/* ===================== Solar Sail Parameters ===================== */
export const SAIL = {
  FLUX_1AU: 5.4026e-6,  // N/m²
  AREA: 15_000,         // m²
  MASS: 500,            // kg
} as const;

/* ===================== Competition Parameters ===================== */
export const COMPETITION = {
  MAX_YEARS: 200,
  MIN_PERIHELION: 0.01, // AU
  MAX_PERIHELION: 0.05, // AU
} as const;

/* ===================== Body Scientific Weights ===================== */
export const BODY_WEIGHTS: Record<number | string, number> = {
  1: 0.1,    // Vulcan
  2: 1,      // Yavin
  3: 2,      // Eden
  4: 3,      // Hoth
  1000: 5,   // Yandi
  5: 7,      // Beyoncé
  6: 10,     // Bespin
  7: 15,     // Jotunn
  8: 20,     // Wakonyingo
  9: 35,     // Rogue 1
  10: 50,    // Planet X
  ASTEROIDS: 1,
  COMETS: 3,
};

/* ===================== Time Bonus Parameters ===================== */
export const TIME_BONUS = {
  EARLY: 1.13,
  LATE_SLOPE: -0.005,
  LATE_INTERCEPT: 1.165,
} as const;

/* ===================== Visualization Colors ===================== */
export const TYPE_COLORS: Record<"Planet" | "Asteroid" | "Comet", string> = {
  Planet:  "#6aa6ff",
  Asteroid:"#bfbfbf",
  Comet:   "#a0ffa0",
};

/* ===================== Export Bundle ===================== */
export const CONSTANTS = {
  AU_KM,
  SECONDS_PER_DAY,
  DAYS_PER_YEAR,
  ALTAIRA_GM,
  JD_EPOCH_0,
  JD_SIM_START,
  UNIX_EPOCH_JD,
  MILISECONDS_PER_DAY,
  SAIL,
  COMPETITION,
  BODY_WEIGHTS,
  TIME_BONUS,
} as const;

export type Constants = typeof CONSTANTS;
