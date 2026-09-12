/*
 * knowledge.ts — the "Knowledge" register.
 */

import type { Collection } from './kinds.ts';

export const knowledge: Collection = {
  key: 'knowledge',
  label: 'Knowledge',
  summary: 'Runbooks, notes, and reference articles written by the operator.',
  fields: [
    { key: 'title', label: 'Title', type: 'string', searchable: true },
    { key: 'author', label: 'Author', type: 'string', searchable: true },
    { key: 'body', label: 'Body', type: 'string' },
  ],
};
