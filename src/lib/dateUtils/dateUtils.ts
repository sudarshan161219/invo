// lib/dateUtils.ts

/**
 * Normalize a Date to UTC midnight and return ISO string
 */
export const toUTCMidnightISO = (d: Date): string => {
  return new Date(
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
  ).toISOString();
};

/**
 * Add days to an ISO date (UTC-safe)
 */
export const addDays = (iso: string, days: number): string => {
  const d = new Date(iso);

  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + days)
  ).toISOString();
};

/**
 * Difference in whole days between two ISO dates (UTC-safe)
 */
export const diffInDays = (startISO: string, endISO: string): number => {
  const start = new Date(startISO);
  const end = new Date(endISO);

  const startUTC = Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate()
  );

  const endUTC = Date.UTC(
    end.getUTCFullYear(),
    end.getUTCMonth(),
    end.getUTCDate()
  );

  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  return Math.ceil((endUTC - startUTC) / MS_PER_DAY);
};
