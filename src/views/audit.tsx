/*
 * audit.tsx — the audit view.
 *
 * Renders the immutable audit log. Reads from the same database handle as the
 * register view; nothing else mutates the database.
 */

import { useDatabase } from '../lib/store';
import { formatAt } from '../lib/format';

interface AuditViewProps {
  /** Number of lines to show (cap the log's growth). */
  limit?: number;
}

export function AuditView({ limit = 100 }: AuditViewProps) {
  const { db } = useDatabase();
  const lines = db.audit.slice(0, limit);

  const icon = (action: string) => {
    switch (action) {
      case 'insert': return '＋';
      case 'update': return '⟲';
      default: return '−';
    }
  };

  return (
    <div>
      <p className="topbar__hint" style={{ margin: '0 0 20px' }}>
        Every mutation flows through the database handle, which writes the audit line and persists.
      </p>
      <ol className="audit">
        {lines.length === 0 ? (
          <li style={{ color: 'var(--dim)' }}>No changes recorded yet.</li>
        ) : lines.map((line) => (
          <li key={`${line.at}-${line.id}`}>
            <span className="glyph" aria-hidden="true">{icon(line.action)}</span>
            {' '}
            <strong>{line.collection}</strong>
            {' '}
            <span style={{ color: 'var(--dim)' }}>{line.action}</span>
            {' '}
            <code>{line.id}</code>
            {' '}
            <time>{formatAt(line.at)}</time>
          </li>
        ))}
      </ol>
    </div>
  );
}
