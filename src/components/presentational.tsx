/*
 * presentational.tsx — presentational primitives.
 *
 * These are the small, dumb building blocks consumed by the generic Register
 * view, table, form, and detail. They know nothing about which collection is
 * active; they receive data as props.
 */

import type { StateStyle } from '../types';

interface StatusProps {
  style: StateStyle;
}

export function Status({ style }: StatusProps) {
  return <span className={`glyph ${glyphClass(style.tone)}${style.glyph.length ? '' : ''}`} aria-hidden="true">
    {style.glyph}
  </span>;
}

export function glyphClass(tone: 'neutral' | 'accent' | 'live' | 'dim') {
  switch (tone) {
    case 'accent':
      return 'glyph--accent';
    case 'live':
      return 'glyph--live';
    default:
      return 'glyph--dim';
  }
}

export function Badge({ children, tone }: { children: React.ReactNode; tone: 'neutral' | 'accent' | 'live' }) {
  const cls = tone === 'neutral' ? 'badge' : `badge badge--${tone}`;
  return <span className={cls}>{children}</span>;
}

export function Card({ title, children, value, meta }: {
  title: string;
  children?: React.ReactNode;
  value?: React.ReactNode;
  meta?: React.ReactNode;
}) {
  return (
    <section className="card">
      <h3 className="card__title">{title}</h3>
      {value != null && <div className="card__value">{value}</div>}
      {children}
      {meta != null && <div className="card__meta">{meta}</div>}
    </section>
  );
}

export function Empty({ title, body }: { title: string; body?: React.ReactNode }) {
  return (
    <div className="empty">
      <p className="empty__title">{title}</p>
      {body}
    </div>
  );
}

export function Modal({ title, onClose, children }: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={onClose}>
      <div className="modal__panel" onMouseDown={(e) => e.stopPropagation()}>
        <h2 className="modal__title">{title}</h2>
        {children}
      </div>
    </div>
  );
}
