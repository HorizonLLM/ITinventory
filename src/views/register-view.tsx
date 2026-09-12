/*
 * register-view.tsx — the shared Register view.
 *
 * One table, one form, one filter, and one search — driven entirely by the
 * collection schema. No collection-specific rendering lives here; the table and
 * form read the field set from `kind`. Adding a fifth register is a schema edit,
 * not a view.
 */

import { useState, useMemo } from 'react';
import type { Collection, Field } from '../schema/kinds';
import type { RegisterEntity } from '../schema';
import type { RecordEntity } from '../types';
import { Empty, Badge } from '../components/presentational';
import { stateStyle } from '../lib/derive';
import { formatAt } from '../lib/format';

interface RegisterViewProps {
  kind: Collection;
  records: RegisterEntity[];
  onAdd: (record: RecordEntity) => void;
  onDelete: (id: string) => void;
}

function cellClass(field: Field): string {
  return field.type === 'number' ? 'table__num' : 'table__text';
}

export function RegisterView({ kind, records, onAdd, onDelete }: RegisterViewProps) {
  const [query, setQuery] = useState('');
  const [stateFilter, setStateFilter] = useState<'all' | 'active' | 'retired' | 'pending'>('all');
  const [filterField, setFilterField] = useState<string>('all');
  const [adding, setAdding] = useState(false);

  const searchable = kind.fields.filter((f) => f.type !== 'number');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records.filter((r) => {
      if (stateFilter !== 'all' && r.state !== stateFilter) return false;
      if (q.length === 0) return true;
      if (filterField === 'all') {
        return JSON.stringify(r).toLowerCase().includes(q);
      }
      const value = (r as unknown as RecordEntity)[filterField] as string | number | undefined;
      return String(value ?? '').toLowerCase().includes(q);
    });
  }, [records, query, stateFilter, filterField]);

  // Derive a display value for a field on a record.
  const cell = (record: RegisterEntity, field: Field): React.ReactNode => {
    const raw = (record as unknown as Record<string, unknown>)[field.key];
    if (field.type === 'enum') {
      return <Badge tone="neutral">{String(raw ?? '—')}</Badge>;
    }
    return <span className={cellClass(field)}>{(field.type === 'number' && typeof raw === 'number')
      ? `$${raw.toLocaleString()}`
      : String(raw ?? '—')}</span>;
  };

  return (
    <div>
      {/* quick-add strip */}
      <div className="quickadd">
        <span>Add</span>
        <button className="btn" onClick={() => setAdding(true)}>＋ new {kind.label.slice(0, -1)}</button>
      </div>

      {/* search + state filter bar */}
      <div className="toolbar">
        <input
          className="input input--search"
          placeholder={`Search ${kind.label}…`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label>
          <select className="input" value={filterField} onChange={(e) => setFilterField(e.target.value)}>
            <option value="all">All fields</option>
            {searchable.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
          </select>
        </label>
        <label>
          <select className="input" value={stateFilter} onChange={(e) => setStateFilter(e.target.value as any)}>
            <option value="all">All states</option>
            <option value="active">Active</option>
            <option value="retired">Retired</option>
            <option value="pending">Pending</option>
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <Empty
          title="Nothing here"
          body={query.length > 0 || stateFilter !== 'all'
            ? 'Adjust the search or state filter.'
            : `This ${kind.label} register is empty. Use the quick-add strip above.`}
        />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Status</th>
              {kind.fields.map((f) => <th key={f.key}>{f.label}</th>)}
              <th className="table__num" style={{ textAlign: 'right' }}>Added</th>
              <th style={{ textAlign: 'right' }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const style = stateStyle(r.state);
              return (
                <tr key={r.id}>
                  <td><span className={`glyph ${style.tone === 'accent' ? 'glyph--accent' : style.tone === 'live' ? 'glyph--live' : 'glyph--dim'}`} aria-hidden="true">{style.glyph}</span></td>
                  {kind.fields.map((f) => (
                    <td key={f.key} className={cellClass(f)}>{cell(r, f)}</td>
                  ))}
                  <td className="table__num">{r.createdAt ? formatAt(r.createdAt) : '—'}</td>
                  <td className="table__num" style={{ textAlign: 'right' }}>
                    <button className="btn" onClick={() => onDelete(r.id)}>retire</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {adding && <AddForm kind={kind} onClose={() => setAdding(false)} onAdd={onAdd} />}
    </div>
  );
}

/*
 * AddForm — the inline quick-add form. Fields are generated from the schema.
 * Minimal validation: required string/enum fields must be non-empty.
 */
function AddForm({ kind, onClose, onAdd }: {
  kind: Collection;
  onClose: () => void;
  onAdd: (record: RecordEntity) => void;
}) {
  const [values, setValues] = useState<Record<string, string | number>>({});

  const submit = () => {
    const record = { ...values, id: crypto.randomUUID(), state: 'active' as const } as RecordEntity;
    onAdd(record);
    onClose();
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={`Add to ${kind.label}`} onMouseDown={onClose}>
      <div className="modal__panel" onMouseDown={(e) => e.stopPropagation()}>
        <h2 className="modal__title">Add to {kind.label}</h2>
        <div className="form">
          {kind.fields.map((f) => (
            <div key={f.key} className="field">
              <label>{f.label}</label>
              {f.type === 'enum' ? (
                <select
                  className="input"
                  value={String(values[f.key] ?? '')}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                >
                  <option value="">—</option>
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  className="input"
                  type={f.type === 'number' ? 'number' : 'text'}
                  placeholder={f.label}
                  value={String(values[f.key] ?? '')}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: f.type === 'number' ? Number(e.target.value) || 0 : e.target.value }) as any)}
                />
              )}
            </div>
          ))}
        </div>
        <div className="toolbar" style={{ marginTop: 18 }}>
          <button className="btn btn--accent" onClick={submit}>Add</button>
          <button className="btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
