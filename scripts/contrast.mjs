#!/usr/bin/env node
/**
 * WCAG 2.x contrast report for text/background token pairs.
 * Run: npm run tokens:contrast   (exits 1 if any required pair fails)
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const t = JSON.parse(readFileSync(resolve(root, 'src/design-system/tokens/tokens.json'), 'utf8')).color;
const get = (path) => path.split('.').reduce((o, k) => o[k], t).$value;

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

// [foreground, background, minimum] — 4.5 for text, 3 for UI boundaries
const pairs = [
  ['ink.primary', 'paper.base', 4.5],
  ['ink.secondary', 'paper.base', 4.5],
  ['ink.tertiary', 'paper.base', 4.5],
  ['ink.tertiary', 'paper.raised', 4.5],
  ['ink.tertiary', 'paper.sunken', 4.5],
  ['ink.inverse', 'paper.inverse', 4.5],
  ['ember.600', 'paper.raised', 4.5],
  ['ember.600', 'paper.base', 4.5],
  ['ember.700', 'ember.50', 4.5],
  ['success.fg', 'success.bg', 4.5],
  ['warning.fg', 'warning.bg', 4.5],
  ['danger.fg', 'danger.bg', 4.5],
  ['info.fg', 'info.bg', 4.5],
  ['neutral.fg', 'neutral.bg', 4.5],
  ['line.strong', 'paper.raised', 3],
  ['line.strong', 'paper.base', 3],
  ['ember.600', 'paper.base', 3],
];

let failed = 0;
console.log('fg'.padEnd(16), 'bg'.padEnd(16), 'ratio', ' min', ' result');
for (const [fg, bg, min] of pairs) {
  const r = ratio(get(fg), get(bg));
  const ok = r >= min;
  if (!ok) failed++;
  console.log(fg.padEnd(16), bg.padEnd(16), r.toFixed(2).padStart(5), String(min).padStart(4), ok ? ' ✓' : ' ✗');
}
// White text on solid buttons
for (const bg of ['ember.600', 'danger.solid']) {
  const r = ratio('#FFFFFF', get(bg));
  if (r < 4.5) failed++;
  console.log('white'.padEnd(16), bg.padEnd(16), r.toFixed(2).padStart(5), ' 4.5', r >= 4.5 ? ' ✓' : ' ✗');
}
if (failed) {
  console.error(`✗ ${failed} pair(s) below WCAG AA`);
  process.exit(1);
}
console.log('✓ All checked pairs meet WCAG AA');
