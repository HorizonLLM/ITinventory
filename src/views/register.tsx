/*
 * register.tsx — the Register container.
 *
 * Owns the state for a single collection, reads derived rollups, and renders
 * the shared RegisterView. The audit view reads the same database; nothing else
 * touches it.
 */

import { useDatabase } from '../lib/store';
import { registers, type RegisterEntity } from '../schema';
import { registerView } from './register-view';

export function Register({ kind }: { kind: (typeof registers)[number] }) {
  const { db, setDatabase } = useDatabase();
  const records = db[kind.key] as RegisterEntity[];

  const onAdd = (record: RecordEntity) => {
    setDatabase((prev) => ({
      ...prev,
      [kind.key]: [...(prev[kind.key] as RegisterEntity[]), record],
    }));
  };

  const onDelete = (id: string) => {
    setDatabase((prev) => ({
      ...prev,
      [kind.key]: (prev[kind.key] as RegisterEntity[]).map((r) =>
        r.id === id ? { ...r, state: 'retired' as const } : r,
      ),
    }));
  };

  return <RegisterView kind={kind} records={records} audit={db.audit} onAdd={onAdd} onDelete={onDelete} />;
}
