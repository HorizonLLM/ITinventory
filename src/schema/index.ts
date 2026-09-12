/*
 * Register types — one interface per collection.
 *
 * Each register extends the shared Entity envelope with its own fields. The
 * generic Register view is written against `RegisterRecord<C>` so the table,
 * form, filter, and search all follow from the schema.
 */

import type { Entity } from '../types';
import { assets } from './assets';
import { servers } from './servers';
import { software } from './software';
import { knowledge } from './knowledge';

export interface AssetRecord extends Entity {
  name: string;
  category: string;
  owner: string;
  location: string;
  purchase: string;
  value: number;
  notes: string;
}

export interface ServerRecord extends Entity {
  hostname: string;
  role: string;
  os: string;
  address: string;
  uptime: string;
  notes: string;
}

export interface SoftwareRecord extends Entity {
  name: string;
  vendor: string;
  version: string;
  license: string;
  expires: string;
  notes: string;
}

export interface KnowledgeRecord extends Entity {
  title: string;
  author: string;
  body: string;
}

/** The four registers as a typed list, consumed by the sidebar + router. */
export const registers = [assets, servers, software, knowledge] as const;

export type RegisterEntity =
  | AssetRecord
  | ServerRecord
  | SoftwareRecord
  | KnowledgeRecord;
