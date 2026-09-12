/*
 * format.ts — presentation helpers.
 *
 * Dates and timestamps are formatted in one place so the audit log and
 * records read consistently. No date math here — only display.
 */

export function formatAt(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}

/** Stable id generator for records added without an explicit id. */
export function nextId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Escape a string for safe interpolation into a title/label. */
export function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
