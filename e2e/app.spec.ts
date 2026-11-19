import { expect, test } from '@playwright/test';

test.describe('prototype app', () => {
  test('new project form can be filled, including the dropdowns', async ({ page, viewport }) => {
    await page.goto('/app?latency=0');
    if ((viewport?.width ?? 0) >= 1280) {
      await page.getByRole('button', { name: 'New project' }).click();
    } else {
      await page.getByRole('button', { name: 'Open menu' }).click();
      await page.getByRole('menuitem', { name: 'New project' }).click();
    }
    const dialog = page.getByRole('dialog', { name: 'New project' });

    await dialog.getByLabel(/Full name/).fill('Test Person');
    await dialog.getByLabel(/Mobile phone/).fill('(714) 555-0199');
    await dialog.getByLabel(/Street address/).fill('1200 Example Street');
    await dialog.getByLabel(/City/).fill('Orange');
    await dialog.getByLabel(/ZIP code/).fill('92867');

    // The option list opens above the dialog, so a real click on an option must work.
    await dialog.getByRole('combobox').first().click();
    await page.getByRole('option', { name: 'Roofing', exact: true }).click();
    await expect(dialog.getByRole('combobox').first()).toContainText('Roofing');

    await dialog.getByRole('button', { name: 'Create project' }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByText('Test Person').first()).toBeVisible();
  });
});

test('the logo in the app goes to the homepage', async ({ page }) => {
  await page.goto('/app?latency=0');
  await page.getByRole('banner').getByRole('link', { name: 'Groundwork, go to the homepage' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('From signed to switched on');
});
