/*
 * software.ts — the "Software" register.
 */

import type { Collection } from './kinds.ts';

export const software: Collection = {
  key: 'software',
  label: 'Software',
  summary: 'Licensed and installed software — versions, vendors, renewal dates.',
  fields: [
    { key: 'name', label: 'Name', type: 'string', searchable: true },
    { key: 'vendor', label: 'Vendor', type: 'string', searchable: true },
    { key: 'version', label: 'Version', type: 'string' },
    { key: 'license', label: 'License', type: 'enum', options: ['proprietary', 'subscription', 'perpetual', 'open-source', 'unlicensed'] },
    { key: 'expires', label: 'Expires', type: 'string' },
    { key: 'notes', label: 'Notes', type: 'string' },
  ],
};
