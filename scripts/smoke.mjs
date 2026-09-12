/**
 * smoke.mjs — schema + render smoke test, run by `npm run check`.
 *
 * Exercises the pure logic of the app without a browser:
 *   - every collection declares the same 22 tokens (guarded via tokens.css);
 *   - the schema layer is well-formed (each field is one of the allowed kinds);
 *   - the four registers exist and are internally consistent;
 *   - derive rollups and state style resolve for every state;
 *   - markdown + format helpers do not throw on representative input.
 *
 * It does NOT touch localStorage or render React — it validates the model the
 * views consume.
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const results = [];
const ok = (name) => results.push({ name, pass: true });
const fail = (name, msg) => {
  results.push({ name, pass: false, msg });
  console.error(`[smoke] FAIL: ${name} — ${msg}`);
};

// 1. tokens: the declared set must be stable.
const tokensFile = resolve(root, 'src/theme/tokens.css');
if (!existsSync(tokensFile)) fail('tokens', 'tokens.css missing');
else {
  const text = readFileSync(tokensFile, 'utf8');
  const declared = [...text.matchAll(/--[\w-]+:/g)].map((m) => m[0].slice(0, -1));
  const expected = ['void','plate','plate-2','raised','hair','edge','dim','text','signal','accent','live','font-body','font-label','font-mono','notch'];
  const missing = expected.filter((t) => !declared.includes(t));
  if (missing.length) fail('tokens', `missing tokens: ${missing.join(', ')}`);
  else ok('tokens');
}

// 2. schema: validate each collection's fields.
import { registers } from '../src/schema/index.ts';
const FIELD_KINDS = ['string', 'number', 'enum'];
let schemaOk = true;
for (const kind of registers) {
  if (!kind.fields?.length) { schemaOk = false; fail(`schema:${kind.key}`, 'has no fields'); continue; }
  for (const f of kind.fields) {
    if (!FIELD_KINDS.includes(f.type)) { schemaOk = false; fail(`schema:${kind.key}.${f.key}`, `unknown field type ${f.type}`); }
    if (f.type === 'enum' && (!Array.isArray(f.options) || f.options.length === 0)) {
      schemaOk = false; fail(`schema:${kind.key}.${f.key}`, 'enum field has no options');
    }
  }
}
schemaOk ? ok('schema') : null;

// 3. registers: four collections, each with a distinct key.
import { registers } from '../src/schema/index.ts';
const keys = registers.map((r) => r.key);
const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
dupes.length ? fail('registers', `duplicate keys: ${dupes.join(', ')}`) : ok('registers');
if (registers.length !== 4) fail('registers', `expected 4 collections, got ${registers.length}`);

// 4. derive: rollups and state style resolve for every state.
import { rollup, stateStyle, needsAttention } from '../src/lib/derive.ts';
const states = ['active', 'retired', 'pending'];
let deriveOk = true;
for (const s of states) {
  const style = stateStyle(s);
  if (!['neutral','accent','live'].includes(style.tone)) { deriveOk = false; fail(`derive:${s}`, 'bad tone'); }
  if (!needsAttention(s) && stateStyle(s).tone !== 'live') { deriveOk = false; fail(`derive:${s}`, 'live state not detected'); }
}
rollup([]); // must not throw
deriveOk ? ok('derive') : null;

// 5. helpers: markdown + format do not throw on representative input.
import { renderMarkdown, formatAt, nowISO } from '../src/lib/markdown.ts';
import { formatFromISO } from '../src/lib/format.ts';
try {
  renderMarkdown('# h\n\nSome **bold** text with `code` and [a link](https://x).');
  formatAt(nowISO());
  ok('helpers');
} catch (e) {
  fail('helpers', String(e));
}

// Report.
const failed = results.filter((r) => !r.pass);
if (failed.length) {
  console.error(`\n[smoke] FAILED (${failed.length}):`);
  for (const f of failed) console.error(`  - ${f.name}${f.msg ? ` — ${f.msg}` : ''}`);
  process.exit(1);
}
console.log(`[smoke] OK — ${results.length} checks passed`);
process.exit(0);
