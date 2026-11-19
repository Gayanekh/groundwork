import { expect, test } from '@playwright/test';

// The floating bar shows its links and buttons from 1280px up; below that they live in the hamburger menu.
const isWide = (width?: number) => (width ?? 0) >= 1280;

test('the app has a floating top bar with Today and Projects, no sidebar', async ({ page, viewport }) => {
  await page.goto('/app?latency=0');
  const bar = page.getByRole('banner');
  await expect(page.getByRole('complementary').filter({ hasText: 'Brightline' })).toHaveCount(0);
  if (isWide(viewport?.width)) {
    await expect(bar.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: /Today/ })).toHaveAttribute('aria-current', 'page');
    await bar.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Projects' }).click();
  } else {
    await bar.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('menuitem', { name: /^Projects/ }).click();
  }
  await expect(page).toHaveURL(/\/app\/projects/);
});

test('the account menu resets the demo and leads to the homepage', async ({ page, viewport }) => {
  await page.goto('/app?latency=0');
  await page.getByRole('button', { name: isWide(viewport?.width) ? 'Account and demo options' : 'Open menu' }).click();
  await expect(page.getByRole('menuitem', { name: 'Reset demo data' })).toBeVisible();
  await page.getByRole('menuitem', { name: 'About this concept' }).click();
  await expect(page).toHaveURL(/\/$/);
});
