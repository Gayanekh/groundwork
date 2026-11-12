#!/usr/bin/env node
/**
 * Dependency audit: fails if any prebuilt UI component library is installed,
 * directly (package.json) or transitively (node_modules).
 * Run: npm run audit:ui
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

const PROHIBITED = [
  /^shadcn/, /^@shadcn\//, /^@radix-ui\//, /^radix-ui$/, /^@mui\//, /^@material-ui\//, /^@chakra-ui\//, /^antd$/, /^@ant-design\//,
  /^daisyui$/, /^bootstrap$/, /^react-bootstrap$/, /^@headlessui\//, /^@mantine\//, /^@nextui-org\//, /^@heroui\//, /^flowbite/,
  /^@ark-ui\//, /^react-aria-components$/, /^@floating-ui\//, /^clsx$/, /^tailwind-merge$/, /^class-variance-authority$/,
];

const direct = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
const directHits = direct.filter((d) => PROHIBITED.some((re) => re.test(d)));

const installed = [];
const nm = resolve(root, 'node_modules');
if (existsSync(nm)) {
  for (const entry of readdirSync(nm)) {
    if (entry.startsWith('@')) for (const sub of readdirSync(resolve(nm, entry))) installed.push(`${entry}/${sub}`);
    else installed.push(entry);
  }
}
const transitiveHits = installed.filter((d) => PROHIBITED.some((re) => re.test(d)));

console.log(`UI dependency audit — ${direct.length} direct packages, ${installed.length} top-level installed packages`);
console.log('Runtime dependencies:', Object.keys(pkg.dependencies ?? {}).join(', '));
if (directHits.length || transitiveHits.length) {
  if (directHits.length) console.error('✗ Prohibited direct dependencies:', directHits.join(', '));
  if (transitiveHits.length) console.error('✗ Prohibited installed packages:', transitiveHits.join(', '));
  process.exit(1);
}
console.log('✓ No prebuilt UI component libraries, headless kits or class-merging helpers found.');
