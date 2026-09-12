/*
 * overview.tsx — the overview / dashboard view.
 *
 * Reads derived rollups from lib/derive.ts and renders them as cards. No
 * computation here.
 */

import { useDatabase } from '../lib/store';
import { registers, type RegisterEntity } from '../schema';
import { rollup } from '../lib/derive';
import { Card } from '../components/presentational';

export function Overview() {
  const { db } = useDatabase();

  const cards = registers.map((kind) => {
    const records = db[kind.key] as RegisterEntity[];
    const r = rollup(records);
    const attention = records.reduce((n, rec) => (rec.state === 'retired' || rec.state === 'pending' ? n + 1 : n), 0);
    return (
      <Card
        key={kind.key}
        title={kind.label}
        value={<span>{r.total}</span>}
        meta={<>
          <span style={{ color: 'var(--live)' }}>active {r.active}</span>
          {' · '}
          <span style={{ color: 'var(--accent)' }}>attention {attention}</span>
          {' · '}
          <span style={{ color: 'var(--dim)' }}>retired {r.retired}</span>
        </>}
      >
      </Card>
    );
  });

  return (
    <div>
      <p className="topbar__hint" style={{ margin: '0 0 20px' }}>
        Self-hosted IT asset &amp; infrastructure management — four registers, one token-driven UI.
      </p>
      <div className="overview">{cards}</div>
    </div>
  );
}
