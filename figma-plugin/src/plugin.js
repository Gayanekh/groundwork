// @ts-check
/**
 * Groundwork → Figma
 *
 * Builds the Figma side of the design system from the SAME tokens.json the code uses:
 *  - Variable collections "Groundwork / Color" and "Groundwork / Dimension"
 *  - Text styles  text/<size>   (Instrument Sans)
 *  - Effect styles shadow/<size>
 *  - Pages "Foundations" (bound swatches + type scale) and "Components"
 *  - Component sets Button, Badge, Input whose variant property names and values
 *    match the React props exactly (variant, size, tone, state).
 *
 * Re-running is safe: it removes what a previous run created (by name) first.
 * GW_TOKENS is injected by scripts/build-figma-plugin.mjs (see figma-plugin/code.js).
 */

const T = GW_TOKENS;
const PREFIX = 'Groundwork / ';
const FONT_FAMILY = 'Instrument Sans';

/* ----------------------------------------------------------------------------- utils */

/** @param {string} hex */
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return { r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255 };
}

/** "0.875rem" | "14px" → 14 */
function toPx(/** @type {string} */ v) {
  if (v.endsWith('rem')) return parseFloat(v) * 16;
  return parseFloat(v);
}

/**
 * Walk a DTCG group → [path[], token]
 * @returns {Generator<[string[], any]>}
 */
function* walk(/** @type {any} */ node, /** @type {string[]} */ path = []) {
  if (node && typeof node === 'object' && '$value' in node) {
    yield /** @type {[string[], any]} */ ([path, node]);
    return;
  }
  for (const [k, v] of Object.entries(node || {})) {
    if (k.startsWith('$')) continue;
    yield* walk(v, [...path, k]);
  }
}

/** Parse one CSS shadow layer "0 4px 12px -2px rgb(28 27 25 / 0.10)" → DropShadowEffect */
function parseShadow(/** @type {string} */ css) {
  // split on commas that are not inside parentheses
  const layers = css.split(/,(?![^(]*\))/).map((s) => s.trim());
  return layers.map((layer) => {
    const color = layer.match(/rgb\((\d+)\s+(\d+)\s+(\d+)\s*\/\s*([\d.]+)\)/);
    const nums = layer.replace(/rgb\([^)]*\)/, '').trim().split(/\s+/).map((n) => parseFloat(n));
    const [x = 0, y = 0, blur = 0, spread = 0] = nums;
    /** @type {DropShadowEffect} */
    const effect = {
      type: 'DROP_SHADOW',
      color: color ? { r: +color[1] / 255, g: +color[2] / 255, b: +color[3] / 255, a: +color[4] } : { r: 0, g: 0, b: 0, a: 0.1 },
      offset: { x, y },
      radius: blur,
      spread,
      visible: true,
      blendMode: 'NORMAL',
    };
    return effect;
  });
}

/** @type {Record<string, Variable>} */
const vars = {};
/** @type {Record<string, TextStyle>} */
const textStyles = {};
/** @type {Record<string, EffectStyle>} */
const effectStyles = {};

/** Solid paint bound to a color variable. @param {string} name e.g. "paper/raised" */
function paint(name) {
  const v = vars[`color/${name}`];
  if (!v) throw new Error(`Unknown color variable ${name}`);
  return figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', v);
}

/** Bind all four corners to a radius variable. @param {FrameNode | ComponentNode | ComponentSetNode | RectangleNode} node @param {string} name */
function radius(node, name) {
  const v = vars[`radius/${name}`];
  node.cornerRadius = /** @type {number} */ (v.valuesByMode[Object.keys(v.valuesByMode)[0]]);
  for (const corner of /** @type {const} */ (['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius'])) {
    node.setBoundVariable(corner, v);
  }
}

let fontStyles = { regular: 'Regular', medium: 'Medium', semibold: 'SemiBold' };
let family = FONT_FAMILY;

async function loadFonts() {
  try {
    await Promise.all(Object.values(fontStyles).map((style) => figma.loadFontAsync({ family, style })));
  } catch {
    // Instrument Sans missing → fall back to Inter so the plugin still runs.
    family = 'Inter';
    fontStyles = { regular: 'Regular', medium: 'Medium', semibold: 'Semi Bold' };
    await Promise.all(Object.values(fontStyles).map((style) => figma.loadFontAsync({ family, style })));
    figma.notify('Instrument Sans not available in this file — using Inter. Install it from Google Fonts for an exact match.');
  }
}

/**
 * Text node with a text style and a bound color.
 * @param {string} chars @param {string} size text token name (e.g. "base") @param {string} color ink token @param {'regular'|'medium'|'semibold'} weight
 */
async function text(chars, size, color = 'ink/primary', weight = 'regular') {
  const t = figma.createText();
  t.fontName = { family, style: fontStyles[weight] };
  t.characters = chars;
  await t.setTextStyleIdAsync(textStyles[size].id);
  if (weight !== 'regular') t.fontName = { family, style: fontStyles[weight] };
  t.fills = [paint(color)];
  return t;
}

/** Auto-layout frame. @param {string} name @param {'HORIZONTAL'|'VERTICAL'} dir */
function autoFrame(name, dir = 'HORIZONTAL', gap = 8) {
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = dir;
  f.itemSpacing = gap;
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = 'AUTO';
  f.fills = [];
  return f;
}

/* ----------------------------------------------------------------------- cleanup */

async function cleanup() {
  for (const c of await figma.variables.getLocalVariableCollectionsAsync()) if (c.name.startsWith(PREFIX)) c.remove();
  for (const s of await figma.getLocalTextStylesAsync()) if (s.name.startsWith('text/')) s.remove();
  for (const s of await figma.getLocalEffectStylesAsync()) if (s.name.startsWith('shadow/')) s.remove();
  await figma.loadAllPagesAsync();
  const pages = figma.root.children.filter((p) => p.name === 'Foundations' || p.name === 'Components');
  const keep = figma.root.children.find((p) => !pages.includes(p));
  if (pages.length && !keep) figma.root.appendChild(figma.createPage());
  if (pages.includes(figma.currentPage)) await figma.setCurrentPageAsync(/** @type {PageNode} */ (figma.root.children.find((p) => !pages.includes(p))));
  pages.forEach((p) => p.remove());
}

/* ------------------------------------------------------------------- foundations */

function createVariables() {
  const color = figma.variables.createVariableCollection(`${PREFIX}Color`);
  color.renameMode(color.modes[0].modeId, 'Light');
  const colorMode = color.modes[0].modeId;
  for (const [path, token] of walk(T.color)) {
    const v = figma.variables.createVariable(path.join('/'), color, 'COLOR');
    v.setValueForMode(colorMode, hexToRgb(token.$value));
    if (token.$description) v.description = token.$description;
    v.setVariableCodeSyntax('WEB', `var(--color-${path.join('-')})`);
    vars[`color/${path.join('/')}`] = v;
  }

  const dim = figma.variables.createVariableCollection(`${PREFIX}Dimension`);
  dim.renameMode(dim.modes[0].modeId, 'Default');
  const dimMode = dim.modes[0].modeId;
  /** @param {string} name @param {number} value @param {string} css @param {VariableScope[]} scopes @param {string} [desc] */
  const num = (name, value, css, scopes, desc) => {
    const v = figma.variables.createVariable(name, dim, 'FLOAT');
    v.setValueForMode(dimMode, value);
    v.scopes = scopes;
    v.setVariableCodeSyntax('WEB', css);
    if (desc) v.description = desc;
    vars[name] = v;
  };
  for (const [path, token] of walk(T.radius)) num(`radius/${path.join('/')}`, toPx(token.$value), `var(--radius-${path.join('-')})`, ['CORNER_RADIUS'], token.$description);
  num('spacing/unit', toPx(T.spacing.unit.$value), 'var(--spacing)', ['GAP', 'WIDTH_HEIGHT'], T.spacing.unit.$description);
  for (const [path, token] of walk(T.text)) {
    num(`text/${path.join('/')}/size`, toPx(token.$value.fontSize), `var(--text-${path.join('-')})`, ['FONT_SIZE']);
    num(`text/${path.join('/')}/line-height`, toPx(token.$value.lineHeight), `var(--text-${path.join('-')}--line-height)`, ['LINE_HEIGHT']);
  }
}

function createStyles() {
  for (const [path, token] of walk(T.text)) {
    const s = figma.createTextStyle();
    const name = path.join('/');
    s.name = `text/${name}`;
    s.fontName = { family, style: fontStyles.regular };
    s.fontSize = toPx(token.$value.fontSize);
    s.lineHeight = { unit: 'PIXELS', value: toPx(token.$value.lineHeight) };
    s.description = `${token.$description ?? ''} Code: text-${name}`.trim();
    textStyles[name] = s;
  }
  for (const [path, token] of walk(T.shadow)) {
    const s = figma.createEffectStyle();
    const name = path.join('/');
    s.name = `shadow/${name}`;
    s.effects = parseShadow(token.$value);
    s.description = `${token.$description ?? ''} Code: shadow-${name}`.trim();
    effectStyles[name] = s;
  }
}

async function buildFoundationsPage() {
  const page = figma.createPage();
  page.name = 'Foundations';
  await figma.setCurrentPageAsync(page);

  const root = autoFrame('Foundations', 'VERTICAL', 48);
  root.paddingLeft = root.paddingRight = root.paddingTop = root.paddingBottom = 64;
  root.fills = [paint('paper/base')];
  root.appendChild(await text('Groundwork — Foundations', '3xl', 'ink/primary', 'semibold'));
  root.appendChild(await text('Generated from src/design-system/tokens/tokens.json. Independent speculative concept — not affiliated with Artemis.', 'base', 'ink/tertiary'));

  // Color swatches, grouped
  for (const group of Object.keys(T.color).filter((k) => !k.startsWith('$'))) {
    const section = autoFrame(`color/${group}`, 'VERTICAL', 12);
    section.appendChild(await text(`color/${group}`, 'sm', 'ink/secondary', 'medium'));
    const row = autoFrame('swatches', 'HORIZONTAL', 12);
    for (const [path, token] of walk(T.color[group])) {
      const name = [group, ...path].join('/');
      const card = autoFrame(name, 'VERTICAL', 0);
      card.fills = [paint('paper/raised')];
      card.strokes = [paint('line/default')];
      card.strokeWeight = 1;
      radius(card, 'md');
      card.clipsContent = true;
      const chip = figma.createRectangle();
      chip.resize(136, 56);
      chip.fills = [paint(name)];
      card.appendChild(chip);
      const label = autoFrame('label', 'VERTICAL', 2);
      label.paddingLeft = label.paddingRight = label.paddingTop = label.paddingBottom = 8;
      label.appendChild(await text(name, '2xs', 'ink/primary', 'medium'));
      label.appendChild(await text(String(token.$value).toUpperCase(), '2xs', 'ink/tertiary'));
      card.appendChild(label);
      row.appendChild(card);
    }
    section.appendChild(row);
    root.appendChild(section);
  }

  // Type scale
  const typeSection = autoFrame('text', 'VERTICAL', 12);
  typeSection.appendChild(await text('text/*', 'sm', 'ink/secondary', 'medium'));
  for (const [path] of walk(T.text)) {
    const name = path.join('/');
    const line = autoFrame(`text/${name}`, 'HORIZONTAL', 24);
    line.counterAxisAlignItems = 'BASELINE';
    const tag = await text(`text/${name}`, 'xs', 'ink/tertiary');
    tag.resize(96, tag.height);
    tag.textAutoResize = 'HEIGHT';
    line.appendChild(tag);
    line.appendChild(await text('Approval to turn on', name));
    typeSection.appendChild(line);
  }
  root.appendChild(typeSection);

  // Shadows
  const shadowRow = autoFrame('shadow', 'HORIZONTAL', 32);
  for (const name of Object.keys(effectStyles)) {
    const box = autoFrame(`shadow/${name}`, 'VERTICAL', 0);
    box.resize(120, 80);
    box.primaryAxisSizingMode = 'FIXED';
    box.counterAxisSizingMode = 'FIXED';
    box.primaryAxisAlignItems = 'CENTER';
    box.counterAxisAlignItems = 'CENTER';
    box.fills = [paint('paper/raised')];
    radius(box, 'lg');
    await box.setEffectStyleIdAsync(effectStyles[name].id);
    box.appendChild(await text(`shadow/${name}`, 'xs', 'ink/secondary'));
    shadowRow.appendChild(box);
  }
  root.appendChild(shadowRow);
  page.appendChild(root);
}

/* -------------------------------------------------------------------- components */

/**
 * Combine variant components into a set laid out in a grid, then add a TEXT property
 * and point every variant's label at it.
 * @param {ComponentNode[]} comps @param {PageNode} page @param {string} name @param {number} columns
 * @param {{ prop: string, defaultValue: string, layer: string } | null} textProp
 */
function makeSet(comps, page, name, columns, textProp) {
  const set = figma.combineAsVariants(comps, page);
  set.name = name;
  set.layoutMode = 'NONE';
  const gap = 24;
  let x = gap;
  let y = gap;
  let rowH = 0;
  comps.forEach((c, i) => {
    if (i > 0 && i % columns === 0) {
      x = gap;
      y += rowH + gap;
      rowH = 0;
    }
    c.x = x;
    c.y = y;
    x += c.width + gap;
    rowH = Math.max(rowH, c.height);
  });
  set.resizeWithoutConstraints(Math.max(...comps.map((c) => c.x + c.width)) + gap, y + rowH + gap);
  set.fills = [paint('paper/raised')];
  set.strokes = [paint('line/default')];
  set.dashPattern = [6, 4];
  radius(set, 'lg');
  if (textProp) {
    const key = set.addComponentProperty(textProp.prop, 'TEXT', textProp.defaultValue);
    for (const c of comps) {
      const t = /** @type {TextNode | null} */ (c.findOne((n) => n.type === 'TEXT' && n.name === textProp.layer));
      if (t) t.componentPropertyReferences = { characters: key };
    }
  }
  return set;
}

const BUTTON_VARIANTS = /** @type {const} */ ({
  primary: { bg: 'paper/inverse', fg: 'ink/inverse', border: null },
  accent: { bg: 'ember/600', fg: 'paper/raised', border: null },
  secondary: { bg: 'paper/raised', fg: 'ink/primary', border: 'line/default' },
  ghost: { bg: null, fg: 'ink/secondary', border: null },
  danger: { bg: 'danger/solid', fg: 'paper/raised', border: null },
});
const BUTTON_SIZES = /** @type {const} */ ({
  sm: { h: 32, px: 12, text: 'sm', radius: 'sm' },
  md: { h: 36, px: 14, text: 'base', radius: 'md' },
  lg: { h: 44, px: 20, text: 'md', radius: 'md' },
});

async function buildButton(/** @type {PageNode} */ page) {
  /** @type {ComponentNode[]} */
  const comps = [];
  for (const [variant, v] of Object.entries(BUTTON_VARIANTS)) {
    for (const [size, s] of Object.entries(BUTTON_SIZES)) {
      for (const state of ['default', 'disabled']) {
        const c = figma.createComponent();
        c.name = `variant=${variant}, size=${size}, state=${state}`;
        c.layoutMode = 'HORIZONTAL';
        c.primaryAxisSizingMode = 'AUTO';
        c.counterAxisSizingMode = 'FIXED';
        c.resize(80, s.h);
        c.primaryAxisAlignItems = 'CENTER';
        c.counterAxisAlignItems = 'CENTER';
        c.paddingLeft = c.paddingRight = s.px;
        c.itemSpacing = 8;
        radius(c, s.radius);
        const disabled = state === 'disabled';
        const bg = disabled && v.bg && variant !== 'secondary' ? 'paper/sunken' : disabled && variant === 'secondary' ? 'paper/base' : v.bg;
        c.fills = bg ? [paint(bg)] : [];
        if (v.border) {
          c.strokes = [paint(v.border)];
          c.strokeWeight = 1;
        }
        if (bg && variant !== 'ghost' && !disabled) await c.setEffectStyleIdAsync(effectStyles.xs.id);
        const label = await text('Create project', s.text, disabled ? 'ink/disabled' : v.fg, 'medium');
        label.name = 'label';
        c.appendChild(label);
        c.description = 'Code: <Button variant size disabled>. One primary per view region.';
        comps.push(c);
      }
    }
  }
  return makeSet(comps, page, 'Button', 6, { prop: 'label', defaultValue: 'Create project', layer: 'label' });
}

const BADGE_TONES = /** @type {const} */ ({
  neutral: ['neutral/bg', 'neutral/fg', 'neutral/line'],
  success: ['success/bg', 'success/fg', 'success/line'],
  warning: ['warning/bg', 'warning/fg', 'warning/line'],
  danger: ['danger/bg', 'danger/fg', 'danger/line'],
  info: ['info/bg', 'info/fg', 'info/line'],
  accent: ['ember/50', 'ember/700', 'ember/100'],
});

async function buildBadge(/** @type {PageNode} */ page) {
  /** @type {ComponentNode[]} */
  const comps = [];
  for (const [tone, [bg, fg, line]] of Object.entries(BADGE_TONES)) {
    for (const size of ['sm', 'md']) {
      const c = figma.createComponent();
      c.name = `tone=${tone}, size=${size}`;
      c.layoutMode = 'HORIZONTAL';
      c.primaryAxisSizingMode = 'AUTO';
      c.counterAxisSizingMode = 'FIXED';
      c.resize(40, size === 'sm' ? 20 : 24);
      c.counterAxisAlignItems = 'CENTER';
      c.paddingLeft = c.paddingRight = size === 'sm' ? 6 : 8;
      c.itemSpacing = 6;
      radius(c, 'xs');
      c.fills = [paint(bg)];
      c.strokes = [paint(line)];
      c.strokeWeight = 1;
      const dot = figma.createEllipse();
      dot.name = 'dot';
      dot.resize(6, 6);
      dot.fills = [paint(fg)];
      c.appendChild(dot);
      const label = await text('On track', size === 'sm' ? '2xs' : 'xs', fg, 'medium');
      label.name = 'label';
      c.appendChild(label);
      c.description = 'Code: <Badge tone size dot>. Never color alone: always a text label.';
      comps.push(c);
    }
  }
  const set = makeSet(comps, page, 'Badge', 6, { prop: 'label', defaultValue: 'On track', layer: 'label' });
  const dotKey = set.addComponentProperty('dot', 'BOOLEAN', true);
  for (const c of comps) {
    const dot = c.findOne((n) => n.name === 'dot');
    if (dot) dot.componentPropertyReferences = { visible: dotKey };
  }
  return set;
}

const INPUT_STATES = /** @type {const} */ ({
  default: { border: 'line/strong', bg: 'paper/raised', value: 'ink/tertiary', note: 'Helper text explains the format.', noteColor: 'ink/tertiary' },
  focus: { border: 'ember/600', bg: 'paper/raised', value: 'ink/primary', note: 'Helper text explains the format.', noteColor: 'ink/tertiary' },
  invalid: { border: 'danger/fg', bg: 'paper/raised', value: 'ink/primary', note: 'Use a 5-digit ZIP code, like 92831.', noteColor: 'danger/fg' },
  disabled: { border: 'line/default', bg: 'paper/sunken', value: 'ink/disabled', note: 'Not needed for roofing-only projects.', noteColor: 'ink/tertiary' },
});

async function buildInput(/** @type {PageNode} */ page) {
  /** @type {ComponentNode[]} */
  const comps = [];
  for (const [state, s] of Object.entries(INPUT_STATES)) {
    const c = figma.createComponent();
    c.name = `state=${state}`;
    c.layoutMode = 'VERTICAL';
    c.primaryAxisSizingMode = 'AUTO';
    c.counterAxisSizingMode = 'FIXED';
    c.resize(280, 80);
    c.itemSpacing = 6;
    c.fills = [];

    const label = await text('ZIP code', 'sm', 'ink/primary', 'medium');
    label.name = 'label';
    c.appendChild(label);

    const field = figma.createFrame();
    field.name = 'field';
    field.layoutMode = 'HORIZONTAL';
    field.counterAxisAlignItems = 'CENTER';
    field.primaryAxisSizingMode = 'FIXED';
    field.counterAxisSizingMode = 'FIXED';
    field.resize(280, 40);
    field.paddingLeft = field.paddingRight = 12;
    field.fills = [paint(s.bg)];
    field.strokes = [paint(s.border)];
    field.strokeWeight = state === 'focus' ? 2 : 1;
    radius(field, 'sm');
    const value = await text(state === 'default' ? '92831' : state === 'invalid' ? '9283' : '92831', 'base', s.value);
    value.name = 'value';
    field.appendChild(value);
    c.appendChild(field);
    field.layoutSizingHorizontal = 'FILL';

    const note = await text(s.note, 'sm', s.noteColor);
    note.name = 'hint';
    c.appendChild(note);
    c.description = 'Code: <Field label hint error required><Input /></Field>. Errors say how to fix.';
    comps.push(c);
  }
  const set = makeSet(comps, page, 'Input', 4, { prop: 'label', defaultValue: 'ZIP code', layer: 'label' });
  const hintKey = set.addComponentProperty('hint', 'TEXT', 'Helper text explains the format.');
  for (const c of comps) {
    const hint = c.findOne((n) => n.name === 'hint');
    if (hint && c.name !== 'state=invalid') hint.componentPropertyReferences = { characters: hintKey };
  }
  return set;
}

async function buildComponentsPage() {
  const page = figma.createPage();
  page.name = 'Components';
  await figma.setCurrentPageAsync(page);
  const sets = [await buildButton(page), await buildBadge(page), await buildInput(page)];
  let y = 0;
  for (const set of sets) {
    set.x = 0;
    set.y = y;
    const title = await text(set.name, 'xl', 'ink/primary', 'semibold');
    page.appendChild(title);
    title.x = 0;
    title.y = y - 44;
    y += set.height + 120;
  }
  for (const set of sets) set.y += 60;
  return sets;
}

/* -------------------------------------------------------------------------- main */

async function main() {
  await loadFonts();
  await cleanup();
  createVariables();
  createStyles();
  await buildFoundationsPage();
  const sets = await buildComponentsPage();
  figma.viewport.scrollAndZoomIntoView(sets);
  const varCount = Object.keys(vars).length;
  figma.closePlugin(
    `Groundwork: ${varCount} variables, ${Object.keys(textStyles).length} text styles, ${Object.keys(effectStyles).length} effect styles, ${sets.length} component sets.`,
  );
}

main().catch((err) => {
  console.error(err);
  figma.closePlugin(`Groundwork plugin failed: ${err && err.message ? err.message : err}`);
});
