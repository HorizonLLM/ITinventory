/*
 * derive.ts — derived values, defined once.
 *
 * Views read from here; they do not compute. This is where semantic tokens
 * (`--accent`, `--live`) are referenced, where rollups come from, and where a
 * record's derived display (its accent state, its status row) is computed.
 * Keeping it in one file is what lets the design guard and smoke test verify
 * the whole app without rendering a browser.
 */

import type { Entity, EntityState, STATE_STYLE } from '../types';

/** Map a record's state to its visual tone + glyph. */
export function stateStyle(state: EntityState) {
  return STATE_STYLE[state] ?? { tone: 'dim' as const, glyph: '◻' };
}

/**
 * A record "needs attention" when it is retired or pending. This is the sole
 * definition of `--accent` across the app — if you need an accent state, add it
 * here, not inline.
 */
export function needsAttention(state: EntityState): boolean {
  return state === 'retired' || state === 'pending';
}

export function accent(state: EntityState) {
  return needsAttention(state) ? 'accent' : 'live';
}

/** Roll up a collection: total, by state. Pure so it is testable. */
export interface Rollup {
  total: number;
  active: number;
  retired: number;
  pending: number;
}

export function rollup(items: Entity[]): Rollup {
  const r: Rollup = { total: items.length, active: 0, retired: 0, pending: 0 };
  for (const item of items) {
    if (item.state === 'active') r.active++;
    else if (item.state === 'retired') r.retired++;
    else if (item.state === 'pending') r.pending++;
  }
  return r;
}

/** Count records across all collections that need attention. */
export function attention(items: Entity[]): number {
  return items.reduce((n, item) => (needsAttention(item.state) ? n + 1 : n), 0);
}
