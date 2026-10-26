import { test, expect } from '@playwright/test';

test('the report shows revenue by region', async ({ page }) => {
  await page.goto('/');
  const table = page.getByRole('table', { name: 'Revenue by region' });
  await expect(table.getByRole('row', { name: 'North 12,483' })).toBeVisible();
  await expect(table.getByRole('row', { name: 'West 15,007' })).toBeVisible();
});
