import { test, expect } from '@playwright/test';

test('the subscription form rejects an empty postcode', async ({ page }) => {
  await page.goto('/#/subscription');
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.getByText('Enter a postcode')).toBeVisible();

  await page.getByLabel('Postcode').fill('not a postcode');
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.getByText('Enter a valid UK postcode')).toBeVisible();
});
