import { test, expect } from '@playwright/test';

test('the badge counts unread messages', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('list', { name: 'Messages' }).getByRole('listitem')).toHaveCount(4);
  await expect(page.getByText('Hello, Sam')).toBeVisible();
  await expect(page.getByLabel('Unread messages')).toHaveText('3 new');
});
