#!/usr/bin/env node
/* ============================================================
   YiQi DS — Guard anti-deriva de tokens
   Falla si alguna página redefine tokens (:root con --bg) inline.
   Fuente única: site.css. Excepción: mocks autocontenidos de iframe.
   Uso: node system/check-tokens.mjs   (ideal en pre-commit / CI)
   ============================================================ */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..'); // raíz del repo web
const ALLOW = new Set(['erp-panel.html', 'erp-mobile.html', 'asistente.html', 'tiendanube.html']); // autocontenidas (no linkean site.css). TODO: migrar a system/tokens.css compartido
const offenders = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (!name.endsWith('.html') || name.endsWith('.bak') || ALLOW.has(name)) continue;
    const css = readFileSync(p, 'utf8');
    const m = css.match(/:root\s*\{[^{}]*\}/);
    if (m && /--bg\s*:/.test(m[0])) offenders.push(p.replace(ROOT + '/', ''));
  }
}
walk(ROOT);

if (offenders.length) {
  console.error('❌ Tokens duplicados (definí en site.css, no inline):');
  offenders.forEach(o => console.error('   - ' + o));
  process.exit(1);
}
console.log('✓ Tokens centralizados en site.css — sin drift.');
