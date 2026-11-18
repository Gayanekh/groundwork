import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('case study at /case-study', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/case-study');
  });

  test('shows the story, the disclaimer and a way back home', async ({ page }) => {
    await expect(page).toHaveTitle(/Case study/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('long, quiet months');
    await expect(page.getByRole('note').filter({ hasText: 'Independent Speculative Concept' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to the homepage', exact: true })).toBeAttached();
  });

  test('uses the new look and never scrolls sideways', async ({ page }) => {
    const bg = await page.locator('[data-surface="mist"]').evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(245, 247, 250)');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });

  test('plain-language demo works here too', async ({ page }) => {
    const word = page.getByRole('button', { name: 'Replace AHJ with city permit office' });
    await word.scrollIntoViewIfNeeded();
    await word.click();
    await expect(page.getByText('city permit office').first()).toBeVisible();
  });

  test('has no serious or critical accessibility violations', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
  });
});

test('the landing page links to the case study', async ({ page }) => {
  await page.goto('/');
  // The first one is in the hero, right next to the main button.
  await page.locator('#top').getByRole('link', { name: 'Read the case study' }).click();
  await expect(page).toHaveURL(/\/case-study$/);
});

test('the case study is in the top navigation, on every screen size', async ({ page, viewport }) => {
  await page.goto('/');
  if ((viewport?.width ?? 0) >= 1024) {
    await page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: 'Case study' }).click();
  } else {
    await page.getByRole('button', { name: 'Open section menu' }).click();
    await page.getByRole('menuitem', { name: 'Case study' }).click();
  }
  await expect(page).toHaveURL(/\/case-study$/);
});
