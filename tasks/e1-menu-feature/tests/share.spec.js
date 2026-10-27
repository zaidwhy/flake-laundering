import { test, expect } from '@playwright/test';

test('the share menu offers email', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Share' }).click();
  await expect(page.getByRole('link', { name: 'Email' })).toBeVisible();
});
