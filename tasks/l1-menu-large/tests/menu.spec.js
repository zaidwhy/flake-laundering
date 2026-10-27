import { test, expect } from '@playwright/test';

test('the menu opens on the first click', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.getByRole('link', { name: 'Pricing' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'true');
});
