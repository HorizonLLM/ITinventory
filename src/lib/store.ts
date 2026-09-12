/*
 * store.ts — the database.
 *
 * All mutations flow through `useDatabase()`, which returns a stable `db`
 * handle plus `setDatabase` (a state setter). Every mutation is routed through
 * `setDatabase`, which writes the audit line and persists. Nothing else touches
 * localStorage.
 */

import { useState } from 'react';
import { readJSON } from './storage';
import type { Entity } from '../types';

export interface AuditLine {
  collection: string;
  action: 'insert' | 'update' | 'delete';
  id: string;
  at: string; // ISO timestamp
}

export interface Database {
  assets: Entity[];
  servers: Entity[];
  software: Entity[];
  knowledge: Entity[];
  audit: AuditLine[];
}

export type CollectionKey = keyof Omit<Database, 'audit'>;

const STORE_KEY = 'it-inventory.v2';
const AUDIT_KEY = 'it-inventory.audit.v1';

export function loadDatabase(): Database {
  return {
    ...readJSON<Partial<Database>>(STORE_KEY, {}),
    audit: readJSON<AuditLine[]>(AUDIT_KEY, []),
  };
}

/** Persist `next` back to localStorage. */
export function persist(db: Database): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({
      assets: db.assets,
      servers: db.servers,
      software: db.software,
      knowledge: db.knowledge,
    }));
    localStorage.setItem(AUDIT_KEY, JSON.stringify(db.audit));
  } catch {
    // storage full or unavailable — a warning is fine, the app degrades.
  }
}

/**
 * `useDatabase()` returns a stable `db` handle plus a `setDatabase` state
 * setter used by views to mutate state and by the audit view to read history.
 */
export function useDatabase() {
  const [db, setDatabase] = useState<Database>(loadDatabase);
  return { db, setDatabase };
}
