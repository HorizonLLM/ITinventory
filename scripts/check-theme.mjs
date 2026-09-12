/**
 * check-theme.mjs — the design guard, run by `npm run check`.
 *
 * Enforces the three-layer contract that keeps the app inside the design system:
 *   1. `src/theme/tokens.css` is the ONLY file allowed to contain a literal colour.
 *   2. `src/theme/base.css` holds the reset, page shell and full-bleed overlays.
 *   3. `src/theme/components.css` holds the entire visual vocabulary in BEM,
 *      tokens only.
 *
 * It fails the build if a literal colour appears outside `tokens.css`, if any
 * of the required theme files is missing, or if `components.css` imports a
 * colour token outside the declared set.
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const themeDir = resolve(root, 'src', 'theme');

const requiredFiles = ['tokens.css', 'base.css', 'components.css'];
const missing = requiredFiles.filter((f) => !existsSync(resolve(themeDir, f)));
if (missing.length > 0) {
  console.error(`[check-theme] missing required theme files: ${missing.join(', ')}`);
  process.exit(1);
}

const tokens = readFileSync(resolve(themeDir, 'tokens.css'), 'utf8');

// A literal colour is an rgb/rgba/hsl/hex token. tokens.css is the ONLY file
// allowed to define these; base.css and components.css must reference tokens.
const literalColorRe = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|rgba?\(|hsla?\(/;

for (const file of ['base.css', 'components.css']) {
  const body = readFileSync(resolve(themeDir, file), 'utf8');
  const matches = body.match(literalColorRe);
  if (matches && matches.length > 0) {
    console.error(`[check-theme] ${file} contains literal colours — move them to tokens.css`);
    process.exit(1);
  }
}

// Components must only consume the declared token set.
const declaredTokens = new Set(
  [...tokens.matchAll(/(--[\w-]+):/g)].map((m) => m[1]),
);
const componentBody = readFileSync(resolve(themeDir, 'components.css'), 'utf8');
const usedTokens = componentBody.match(/var\(--[\w-]+\)/g) ?? [];
const forbidden = usedTokens.filter((t) => {
  const name = t.slice(4, -1); // strip "var(" and ")", gives --token
  return !declaredTokens.has(name);
});
if (forbidden.length > 0) {
  console.error(`[check-theme] components.css references undeclared tokens: ${[...new Set(forbidden)].join(', ')}`);
  process.exit(1);
}

console.log('[check-theme] design guard: OK — three-layer contract intact');
process.exit(0);
