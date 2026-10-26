import { test, expect } from '@playwright/test';

test('shows the account balance', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('list', { name: 'Recent transactions' }).getByRole('listitem')).toHaveCount(3);
  const balance = await page.locator('#balance').textContent();
  expect(balance).toBe('£1,204.50');
});
