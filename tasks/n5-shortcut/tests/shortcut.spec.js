import { test, expect } from '@playwright/test';

test('slash jumps to search', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('cell', { name: 'Osei Joinery' })).toBeVisible();
  await page.keyboard.press('/');
  await page.keyboard.type('osei');
  await expect(page.getByRole('searchbox', { name: 'Search invoices' })).toHaveValue('osei');
});
