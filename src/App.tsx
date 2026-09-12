/*
 * App — the application shell.
 *
 * A fixed sidebar of the four registers plus Overview and Audit, a topbar that
 * reflects the active view, and a content region that renders the selected view.
 * State lives in the database (lib/store.ts); views read derived values.
 */

import { useState } from 'react';
import './theme/theme.css';
import { registers } from './schema';
import { RegisterView, Register, Overview, AuditView } from './views';
import type { Collection } from './schema/kinds';

export default App;

function App() {
  const [active, setActive] = useState<string>('overview');

  const render = () => {
    switch (active) {
      case 'audit':
        return <AuditView />;
      case 'overview':
        return <Overview />;
      default:
        return <Register kind={active as Collection} />;
    }
  };

  return (
    <div className="app">
      <nav className="sidebar" aria-label="Primary">
        <div className="sidebar__brand">IT Inventory</div>
        <div className="sidebar__nav">
          <button
            className={`sidebar__item${active === 'overview' ? ' is-active' : ''}`}
            aria-selected={active === 'overview'}
            onClick={() => setActive('overview')}
          >
            Overview
          </button>
          {registers.map((r) => (
            <button
              key={r.key}
              className={`sidebar__item${active === r.key ? ' is-active' : ''}`}
              aria-selected={active === r.key}
              onClick={() => setActive(r.key)}
            >
              {r.label}
            </button>
          ))}
          <button
            className={`sidebar__item${active === 'audit' ? ' is-active' : ''}`}
            aria-selected={active === 'audit'}
            onClick={() => setActive('audit')}
          >
            Audit
          </button>
        </div>
      </nav>
      <main className="main">
        <div className="topbar">
          <h1 className="topbar__title">
            {active === 'overview' ? 'Overview' : active === 'audit' ? 'Audit' : registers.find((r) => r.key === active)?.label ?? ''}
          </h1>
        </div>
        <div className="content">{render()}</div>
      </main>
    </div>
  );
}
