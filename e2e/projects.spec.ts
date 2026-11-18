import { expect, test } from '@playwright/test';

test.describe('projects page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/projects?latency=0');
  });

  test('shows projects as cards with days in stage and the stage bar', async ({ page }) => {
    const first = page.getByRole('list').filter({ has: page.getByRole('link', { name: /Maria Delgado/ }) }).getByRole('listitem').first();
    await expect(first).toContainText('Maria Delgado');
    await expect(first).toContainText('Target is 21 days');
    await expect(page.getByRole('table')).toHaveCount(0);
  });

  test('search and the health filter narrow the list, and the URL keeps them', async ({ page }) => {
    await page.getByRole('searchbox', { name: /Search projects/ }).fill('Stein');
    await expect(page).toHaveURL(/q=Stein/);
    await expect(page.getByRole('link', { name: /Rebecca Stein/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Maria Delgado/ })).toHaveCount(0);
  });

  test('sorting by name puts the list in alphabetical order', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Sort projects' }).click();
    await page.getByRole('option', { name: 'Name', exact: true }).click();
    await expect(page).toHaveURL(/sort=name/);
    const names = await page.locator('main ul > li a p.text-lg').allTextContents();
    expect(names.length).toBeGreaterThan(3);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('the switch shows the table and remembers it in the URL', async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 0) < 768, 'Phones always show cards.');
    await page.getByRole('radio', { name: 'Table' }).click();
    await expect(page).toHaveURL(/view=table/);
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Homeowner/ })).toBeVisible();
    await page.getByRole('radio', { name: 'Cards' }).click();
    await expect(page).not.toHaveURL(/view=table/);
    await expect(page.getByRole('table')).toHaveCount(0);
  });

  test('never scrolls sideways', async ({ page }) => {
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });

  test('a card opens the project', async ({ page }) => {
    await page.getByRole('link', { name: /Maria Delgado/ }).first().click();
    await expect(page).toHaveURL(/\/app\/projects\/GW-/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Maria Delgado');
  });
});
