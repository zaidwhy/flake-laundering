import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  await request.post('/api/reset');
});

test('a deleted item stays deleted', async ({ page }) => {
  await page.goto('/');
  const list = page.getByRole('list', { name: 'Groceries' });
  await list.getByRole('listitem').filter({ hasText: 'Milk' }).getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByRole('status')).toHaveText('Up to date');
  await expect(list.getByRole('listitem')).toHaveText([/Eggs/, /Rice/, /Spinach/]);
});
