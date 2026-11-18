import { expect, test } from '@playwright/test';

test('the app has a top bar with Today and Projects, no sidebar', async ({ page }) => {
  await page.goto('/app?latency=0');
  const bar = page.getByRole('banner');
  await expect(bar.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: /Today/ })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('complementary').filter({ hasText: 'Brightline' })).toHaveCount(0);
  await bar.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Projects' }).click();
  await expect(page).toHaveURL(/\/app\/projects/);
});

test('the account menu resets the demo and leads to the homepage', async ({ page }) => {
  await page.goto('/app?latency=0');
  await page.getByRole('button', { name: 'Account and demo options' }).click();
  await expect(page.getByRole('menuitem', { name: 'Reset demo data' })).toBeVisible();
  await page.getByRole('menuitem', { name: 'About this concept' }).click();
  await expect(page).toHaveURL(/\/$/);
});
