import { test, expect } from '@playwright/test';

test('results match what the user typed', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Search fruit' }).pressSequentially('berry');
  await expect(page.getByRole('status')).toHaveText('6 results');
  await expect(page.getByRole('heading', { name: 'Results for "berry"' })).toBeVisible();
  await expect(page.getByRole('list', { name: 'Results' }).getByRole('listitem')).toHaveText([
    'Blackberry', 'Blueberry', 'Elderberry', 'Gooseberry', 'Raspberry', 'Strawberry',
  ]);
});
