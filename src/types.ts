/*
 * entity interfaces + STATE_STYLE (state -> tone + glyph).
 *
 * Every register's records share a common envelope (id, state, and an audit
 * trail); register-specific fields are layered on top through the schema layer.
 * Keep the envelope narrow and generic — views read derived values, they do not
 * compute them.
 */

export type EntityState = 'active' | 'retired' | 'pending';

export type StateTone = 'neutral' | 'accent' | 'live' | 'dim';

export interface StateStyle {
  tone: StateTone;
  glyph: string;
}

/** Shared record envelope. Register-specific fields live in the collection kind. */
export interface Entity {
  id: string;
  state: EntityState;
  createdAt: string; // ISO timestamp, written on insert
}

/** The state -> tone + glyph table, kept in one place so views and the audit
 * log agree on how a state reads. */
export const STATE_STYLE: Record<EntityState, StateStyle> = {
  active: { tone: 'live', glyph: '◉' },
  retired: { tone: 'dim', glyph: '◻' },
  pending: { tone: 'accent', glyph: '◴' },
};

/** A record is either the plain envelope or an extension of it. */
export type RecordEntity<T = Record<string, unknown>> = Entity & T;
