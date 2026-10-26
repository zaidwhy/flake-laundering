import { test, expect } from '@playwright/test';

test('shows the account balance', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('list', { name: 'Recent transactions' }).getByRole('listitem')).toHaveCount(3);
  await expect(page.locator('#balance')).toHaveText('£1,204.50');
});
