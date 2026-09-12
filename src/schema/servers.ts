/*
 * servers.ts — the "Servers" register.
 */

import type { Collection } from './kinds.ts';

export const servers: Collection = {
  key: 'servers',
  label: 'Servers',
  summary: 'Racks, VMs, and services — live infrastructure that watches itself.',
  fields: [
    { key: 'hostname', label: 'Hostname', type: 'string', searchable: true },
    { key: 'role', label: 'Role', type: 'enum', options: ['web', 'db', 'cache', 'worker', 'dns', 'mail', 'jump', 'other'] },
    { key: 'os', label: 'OS', type: 'string', searchable: true },
    { key: 'address', label: 'Address', type: 'string', searchable: true },
    { key: 'uptime', label: 'Uptime', type: 'string' },
    { key: 'notes', label: 'Notes', type: 'string' },
  ],
};
