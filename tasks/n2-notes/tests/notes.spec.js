import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  await request.post('/api/reset');
});

test('a saved note shows up in All notes', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Title').fill('Call the plumber');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('status')).toHaveText('Saved');
  await page.getByRole('link', { name: 'All notes' }).click();
  await expect(page.getByRole('list', { name: 'All notes' })).toContainText('Call the plumber');
});
