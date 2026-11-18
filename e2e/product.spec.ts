import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const SECTION_IDS = ['top', 'problem', 'solution', 'how', 'features', 'product', 'results', 'plain', 'faq', 'start'];

test.describe('landing page at /', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows the headline and a prominent disclaimer', async ({ page }) => {
    await expect(page).toHaveTitle(/Groundwork/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('without the silence');
    await expect(page.getByText('Independent Speculative Concept.').first()).toBeVisible();
    await expect(page.locator('footer')).toContainText('Independent Speculative Concept');
  });

  test('has every section, one h1, and labels its photos as illustrative', async ({ page }) => {
    for (const id of SECTION_IDS) await expect(page.locator(`#${id}`)).toBeAttached();
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByText('Illustrative photo').first()).toBeAttached();
    await expect(page.locator('footer')).toContainText('are fictional');
  });

  test('uses the cool mist surface and the grotesque font', async ({ page }) => {
    const bg = await page.locator('[data-surface="mist"]').evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(245, 247, 250)');
    const font = await page.getByRole('heading', { level: 1 }).evaluate((el) => getComputedStyle(el).fontFamily);
    expect(font).toContain('Inter Tight');
  });

  test('never scrolls sideways', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('has no serious or critical accessibility violations', async ({ page }) => {
    // Reveal animations start at opacity 0; reduce motion so contrast checks see final colors.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
  });

  test('shows all content with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    const stat = page.locator('#problem').getByText('26d', { exact: true });
    await stat.scrollIntoViewIfNeeded();
    await expect(stat).toBeVisible();
    const faq = page.locator('#faq li').first();
    await faq.scrollIntoViewIfNeeded();
    expect(await faq.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  });

  test('problem examples switch with the dots', async ({ page }) => {
    const problem = page.locator('#problem');
    await problem.scrollIntoViewIfNeeded();
    await problem.getByRole('button', { name: 'Show example 2 of 3' }).click();
    await expect(problem.getByText('9 days', { exact: true })).toBeVisible();
  });

  test('guardrail demo explains itself, then unlocks', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Move to Installation' });
    await button.scrollIntoViewIfNeeded();
    await expect(button).toBeDisabled();
    await expect(button).toHaveAccessibleDescription(/utility application filed/i);
    await page.getByLabel('Utility application filed').check();
    await expect(button).toBeEnabled();
  });

  test('plain-language check flags and replaces jargon', async ({ page }) => {
    const replace = page.getByRole('button', { name: 'Replace AHJ' });
    await replace.scrollIntoViewIfNeeded();
    await replace.click();
    await expect(page.locator('#plain [aria-live="polite"]')).toContainText('city permit office');
    await expect(page.getByRole('button', { name: 'Replace AHJ' })).toHaveCount(0);
  });

  test('product steps reorder the phone queue', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    const list = page.locator('#product').getByRole('list', { name: 'Today queue' });
    await list.scrollIntoViewIfNeeded();
    await expect(list.getByRole('listitem').first()).toContainText('Maria Delgado');
    await page.getByRole('button', { name: /Show step 3/ }).click();
    await expect(list.getByRole('listitem').last()).toContainText('Maria Delgado');
  });

  test('faq opens one answer at a time, with the keyboard', async ({ page }) => {
    const faq = page.locator('#faq');
    const buttons = faq.getByRole('button');
    await buttons.first().scrollIntoViewIfNeeded();
    await expect(buttons.nth(0)).toHaveAttribute('aria-expanded', 'true');
    await buttons.nth(1).focus();
    await page.keyboard.press('Enter');
    await expect(buttons.nth(1)).toHaveAttribute('aria-expanded', 'true');
    await expect(buttons.nth(0)).toHaveAttribute('aria-expanded', 'false');
    await page.keyboard.press('Enter');
    await expect(buttons.nth(1)).toHaveAttribute('aria-expanded', 'false');
  });

  test('primary call to action opens the prototype', async ({ page }) => {
    await page.getByRole('link', { name: /Try the prototype/ }).first().click();
    await expect(page).toHaveURL(/\/app$/);
  });
});

test('section menu works on small screens', async ({ page, isMobile, viewport }) => {
  test.skip(!isMobile && (viewport?.width ?? 0) >= 1024, 'The menu button is only shown below 1024px.');
  await page.goto('/');
  await page.getByRole('button', { name: 'Open section menu' }).click();
  await page.getByRole('menuitem', { name: 'FAQ' }).click();
  await expect(page).toHaveURL(/#faq$/);
});

test('a nav link glides to its section and updates the address', async ({ page, viewport }) => {
  test.skip((viewport?.width ?? 0) < 1024, 'The link row is only shown from 1024px.');
  await page.goto('/');
  const start = await page.evaluate(() => window.scrollY);
  await page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: 'Features' }).click();
  // Mid-flight the page is somewhere between the start and the section: it is a glide, not a jump.
  await page.waitForTimeout(150);
  const mid = await page.evaluate(() => window.scrollY);
  expect(mid).toBeGreaterThan(start);
  await expect(page).toHaveURL(/#features$/);
  await expect.poll(() => page.evaluate(() => Math.round(document.getElementById('features')!.getBoundingClientRect().top))).toBeLessThanOrEqual(70);
});

test('the old /product address redirects to the homepage', async ({ page }) => {
  await page.goto('/product');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('without the silence');
});
