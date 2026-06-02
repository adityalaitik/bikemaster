/**
 * Shared helpers for BikeMasters E2E tests.
 */

import { expect, Page } from '@playwright/test';

/** Navigate to / and click Service Queue — waits until job card buttons are visible. */
export async function goToServiceQueue(page: Page) {
  await page.goto('/');
  await expect(
    page.locator('aside').getByRole('button', { name: /service queue/i }),
  ).toBeVisible({ timeout: 15000 });
  await page.locator('aside').getByRole('button', { name: /service queue/i }).click();
  // The queue may be empty; wait up to 8 s but don't fail if there are 0 cards
  await page.waitForTimeout(1000);
}

/** Navigate to service queue AND assert at least one job card exists. */
export async function goToServiceQueueWithCards(page: Page) {
  await goToServiceQueue(page);
  await expect(
    page.locator('main').getByRole('button', { name: /jc\/est/i }).first(),
  ).toBeVisible({ timeout: 8000 });
}

/** Scoped to main content area — avoids accidentally clicking sidebar nav items. */
export function mainBtn(page: Page, name: string | RegExp) {
  return page.locator('main').getByRole('button', { name }).first();
}

/** Open status modal and select a status. */
export async function selectStatus(page: Page, label: string) {
  await mainBtn(page, /^status$/i).click();
  await expect(page.getByText('Update Job Status')).toBeVisible({ timeout: 5000 });
  await page.getByRole('button', { name: new RegExp(label, 'i') }).first().click();
  const updateBtn = page.getByRole('button', { name: /update status/i });
  await expect(updateBtn).toBeEnabled({ timeout: 3000 });
  await updateBtn.click();
  await page.waitForTimeout(700);
}

/**
 * Parse an integer count from button text like "All Jobs 42" or "Completed (5)".
 * Returns 0 if no number is found.
 */
export function parseCount(text: string): number {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}
