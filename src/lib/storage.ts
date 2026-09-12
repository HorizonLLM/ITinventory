/*
 * storage.ts — defensive, schema-driven localStorage.
 *
 * The store (`lib/store.ts`) is the ONLY module that writes to localStorage.
 * This module only reads and is intentionally defensive: missing keys, corrupt
 * JSON, or a mismatched schema all resolve to safe defaults rather than
 * throwing. localStorage is unavailable (SSR, private mode edge cases) and that
 * is tolerated too.
 */

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw) as unknown;
    return parsed as T;
  } catch {
    return fallback;
  }
}

/**
 * Coerce `parsed` into `Array<T>` using the collection's field set to decide
 * which keys are records. Anything that is not a well-formed record is dropped
 * rather than allowed to reach a view — storage corruption must never crash the
 * UI.
 */
export function readRecords<T>(key: string, fallback: T[]): T[] {
  const value = readJSON<T[]>(key, fallback);
  return Array.isArray(value) ? value : fallback;
}

export function readString(key: string, fallback = ''): string {
  return readJSON<string>(key, fallback);
}
