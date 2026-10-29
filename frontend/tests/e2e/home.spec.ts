import { expect, test } from '@playwright/test';

test('home page loads and shows the main heading', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Job Marketplace/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Find part-time work in Sri Lanka',
  );
});
