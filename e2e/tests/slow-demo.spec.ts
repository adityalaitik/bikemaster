/**
 * Slow demo — same full lifecycle flow with 3-second pauses so you can watch each step.
 */

import { test, expect, Page } from '@playwright/test';

const PAUSE = 3000;

async function goToServiceQueue(page: Page) {
  await page.goto('/');
  await page.waitForTimeout(PAUSE);
  await expect(page.locator('aside').getByRole('button', { name: /service queue/i })).toBeVisible({ timeout: 15000 });
  await page.locator('aside').getByRole('button', { name: /service queue/i }).click();
  await expect(page.locator('main').getByRole('button', { name: /jc\/est/i }).first()).toBeVisible({ timeout: 8000 });
  await page.waitForTimeout(PAUSE);
}

function mainBtn(page: Page, name: string | RegExp) {
  return page.locator('main').getByRole('button', { name }).first();
}

async function selectStatus(page: Page, label: string) {
  await mainBtn(page, /^status$/i).click();
  await page.waitForTimeout(PAUSE);
  await expect(page.getByText('Update Job Status')).toBeVisible({ timeout: 5000 });
  await page.getByRole('button', { name: new RegExp(label, 'i') }).first().click();
  await page.waitForTimeout(PAUSE);
  const updateBtn = page.getByRole('button', { name: /update status/i });
  await expect(updateBtn).toBeEnabled({ timeout: 3000 });
  await updateBtn.click();
  await page.waitForTimeout(PAUSE);
}

test('Full lifecycle — slow demo (Registration → Delivered)', async ({ page }) => {
  // 1. Service Queue
  await goToServiceQueue(page);

  // 2. Verify job cards exist
  const count = await page.locator('main').getByRole('button', { name: /jc\/est/i }).count();
  expect(count).toBeGreaterThan(0);
  await page.waitForTimeout(PAUSE);

  // 3. Open estimation
  await mainBtn(page, /jc\/est/i).click();
  await page.waitForTimeout(PAUSE);
  await expect(page).toHaveURL(/\/estimation\//);
  await expect(page.getByText(/estimation workspace/i).first()).toBeVisible({ timeout: 8000 });
  await page.waitForTimeout(PAUSE);

  // Add first spare from catalog if available
  const firstAddBtn = page.locator('button').filter({ hasText: /^\+$/ }).first();
  if (await firstAddBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await firstAddBtn.click();
    await page.waitForTimeout(PAUSE);
  }

  // Back to service queue
  await goToServiceQueue(page);

  // 4. Client Agreed
  await selectStatus(page, 'Client Agreed');

  // 5. Work in Progress
  await selectStatus(page, 'Work in Progress');

  // 6. Apply 10% discount
  await mainBtn(page, /discount/i).click();
  await page.waitForTimeout(PAUSE);
  await expect(page.getByText('Discount Manager')).toBeVisible({ timeout: 5000 });
  await page.getByRole('button', { name: /% pct/i }).click();
  await page.waitForTimeout(PAUSE);
  await page.getByPlaceholder(/e\.g\. 10/i).first().fill('10');
  await page.waitForTimeout(PAUSE);
  const applyBtn = page.getByRole('button', { name: /apply.*discount/i });
  if (await applyBtn.isEnabled({ timeout: 2000 }).catch(() => false)) {
    await applyBtn.click();
  } else {
    await page.getByRole('button', { name: /cancel/i }).click();
  }
  await page.waitForTimeout(PAUSE);

  // 7. Record payment
  await mainBtn(page, /^payments$/i).click();
  await page.waitForTimeout(PAUSE);
  await expect(page.getByText(/edit payment details/i).first()).toBeVisible({ timeout: 5000 });
  await page.locator('input[type="number"]').first().fill('1000');
  await page.waitForTimeout(PAUSE);
  await page.getByRole('button', { name: /save|record/i }).last().click();
  await page.waitForTimeout(PAUSE);

  // 8. Work Completed → Out for Delivery → Delivered
  for (const s of ['Work Completed', 'Out for Delivery', 'Delivered']) {
    await selectStatus(page, s);
  }

  // 9. Timeline
  await mainBtn(page, /view more/i).click();
  await page.waitForTimeout(PAUSE);
  await page.getByRole('button', { name: /^timeline$/i }).first().click();
  await page.waitForTimeout(PAUSE);
  await expect(page.getByText(/job card created/i).first()).toBeVisible({ timeout: 5000 });
  await page.waitForTimeout(PAUSE);

  console.log('✅ Slow demo complete');
});
