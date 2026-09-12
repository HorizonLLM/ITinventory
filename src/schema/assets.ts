/*
 * assets.ts — the "Assets" register.
 *
 * Describes one of the four collections: its key, label, fields, and summary.
 * The shared Register view reads this and derives table/form/filter/search.
 */

import type { Collection } from './kinds.ts';

export const assets: Collection = {
  key: 'assets',
  label: 'Assets',
  summary: 'Hardware inventory — machines, peripherals, and owned equipment.',
  fields: [
    { key: 'name', label: 'Name', type: 'string', searchable: true },
    { key: 'category', label: 'Category', type: 'enum', options: ['workstation', 'laptop', 'server', 'peripheral', 'network'] },
    { key: 'owner', label: 'Owner', type: 'string', searchable: true },
    { key: 'location', label: 'Location', type: 'string', searchable: true },
    { key: 'purchase', label: 'Purchased', type: 'string' },
    { key: 'value', label: 'Value (USD)', type: 'number' },
    { key: 'notes', label: 'Notes', type: 'string' },
  ],
};
