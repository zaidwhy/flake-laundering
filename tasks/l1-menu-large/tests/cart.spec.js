import { test, expect } from '@playwright/test';

test('adding a bag updates the cart count and totals', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Add Ethiopia Guji to cart' }).click();
  await expect(page.locator('#cart-count')).toHaveText('1');

  await page.locator('#cart-button').click();
  await page.getByRole('button', { name: 'Increase Ethiopia Guji' }).click();
  await expect(page.locator('#cart-count')).toHaveText('2');
  await expect(page.locator('#cart-totals')).toContainText('£26.95');
});
