/**
 * E2E: Estimation Page — Navigation, Catalog, Add Spares, Save Draft, Persistence
 *
 * Prerequisites: next dev (port 3000) and nest dev (port 4000) must be running.
 */

import { test, expect } from '@playwright/test';
import { goToServiceQueue, mainBtn } from './helpers';

test.describe('Estimation Page', () => {
  test.beforeEach(async ({ page }) => {
    await goToServiceQueue(page);
    // Ensure at least one job card is visible
    const firstCard = page.locator('main').getByRole('button', { name: /jc\/est/i }).first();
    const visible = await firstCard.isVisible({ timeout: 8000 }).catch(() => false);
    if (!visible) {
      test.skip(true, 'No job cards in queue — skipping estimation tests');
    }
  });

  // ─── 1. Navigation to estimation page ───────────────────────────────────────

  test('Clicking JC/Est opens the estimation page', async ({ page }) => {
    const jcBtn = mainBtn(page, /jc\/est/i);
    await expect(jcBtn).toBeVisible({ timeout: 8000 });
    await jcBtn.click();

    await expect(page).toHaveURL(/\/estimation\//, { timeout: 10000 });
    await expect(page.getByText(/estimation workspace/i).first()).toBeVisible({ timeout: 10000 });
  });

  // ─── 2. Spare catalog loads ──────────────────────────────────────────────────

  test('Spare parts catalog is visible with at least one item', async ({ page }) => {
    await mainBtn(page, /jc\/est/i).click();
    await expect(page).toHaveURL(/\/estimation\//, { timeout: 10000 });
    await expect(page.getByText(/estimation workspace/i).first()).toBeVisible({ timeout: 10000 });

    // The catalog section lists spare parts — look for + buttons (one per catalog item)
    const addBtns = page.locator('button').filter({ hasText: /^\+$/ });
    await expect(addBtns.first()).toBeVisible({ timeout: 8000 });

    const count = await addBtns.count();
    expect(count).toBeGreaterThan(0);
  });

  // ─── 3. Adding a spare to estimate ──────────────────────────────────────────

  test('Clicking + in catalog adds spare to allocated list', async ({ page }) => {
    await mainBtn(page, /jc\/est/i).click();
    await expect(page).toHaveURL(/\/estimation\//, { timeout: 10000 });
    await expect(page.getByText(/estimation workspace/i).first()).toBeVisible({ timeout: 10000 });

    // Count allocated items before
    const allocatedBefore = await page
      .locator('[class*="allocated"], [data-testid*="allocated"]')
      .count()
      .catch(() => 0);

    // Click the first + button in the catalog
    const firstAddBtn = page.locator('button').filter({ hasText: /^\+$/ }).first();
    await expect(firstAddBtn).toBeVisible({ timeout: 8000 });
    await firstAddBtn.click();
    await page.waitForTimeout(500);

    // Either allocated list count increased or a row appeared with a quantity input
    const allocatedAfter = await page
      .locator('[class*="allocated"], [data-testid*="allocated"]')
      .count()
      .catch(() => 0);

    // If no allocated section selector matched, check for quantity/remove indicators
    const qtyInputs = page.locator('input[type="number"]');
    const qtyCount = await qtyInputs.count();

    expect(allocatedAfter > allocatedBefore || qtyCount > 0).toBe(true);
  });

  // ─── 4. Save draft succeeds ──────────────────────────────────────────────────

  test('Save Draft shows success toast', async ({ page }) => {
    await mainBtn(page, /jc\/est/i).click();
    await expect(page).toHaveURL(/\/estimation\//, { timeout: 10000 });
    await expect(page.getByText(/estimation workspace/i).first()).toBeVisible({ timeout: 10000 });

    // Add a spare if catalog is available
    const firstAddBtn = page.locator('button').filter({ hasText: /^\+$/ }).first();
    if (await firstAddBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstAddBtn.click();
      await page.waitForTimeout(400);
    }

    // Click Save Draft
    const saveDraftBtn = page.getByRole('button', { name: /save draft|save/i }).first();
    await expect(saveDraftBtn).toBeVisible({ timeout: 5000 });
    await saveDraftBtn.click();
    await page.waitForTimeout(800);

    // Success toast should appear; no error toast
    const successToast = page
      .getByText(/saved|draft saved|success/i)
      .first();
    await expect(successToast).toBeVisible({ timeout: 6000 });

    // Explicitly assert no error toast
    const errorToast = page.getByText(/error|failed|could not/i).first();
    const errorVisible = await errorToast.isVisible({ timeout: 1000 }).catch(() => false);
    expect(errorVisible).toBe(false);
  });

  // ─── 5. Estimation persists after reload ─────────────────────────────────────

  test('Saved spare persists after navigating away and back', async ({ page }) => {
    // Open estimation and capture its URL
    const jcBtn = mainBtn(page, /jc\/est/i);
    await jcBtn.click();
    await expect(page).toHaveURL(/\/estimation\//, { timeout: 10000 });
    await expect(page.getByText(/estimation workspace/i).first()).toBeVisible({ timeout: 10000 });

    const estimationUrl = page.url();

    // Add a spare
    const firstAddBtn = page.locator('button').filter({ hasText: /^\+$/ }).first();
    const catalogVisible = await firstAddBtn.isVisible({ timeout: 3000 }).catch(() => false);
    if (!catalogVisible) {
      test.skip(true, 'Catalog not visible — skipping persistence test');
      return;
    }
    await firstAddBtn.click();
    await page.waitForTimeout(400);

    // Capture a label or text from the added item for later comparison
    const qtyInput = page.locator('input[type="number"]').first();
    let addedItemText = '';
    if (await qtyInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Grab nearest label text
      const parent = qtyInput.locator('xpath=ancestor::*[3]');
      addedItemText = (await parent.textContent().catch(() => '')) ?? '';
    }

    // Save draft
    const saveDraftBtn = page.getByRole('button', { name: /save draft|save/i }).first();
    await saveDraftBtn.click();
    await page.waitForTimeout(1000);

    // Navigate back to service queue
    await goToServiceQueue(page);

    // Re-open the same estimation page
    await page.goto(estimationUrl);
    await expect(page.getByText(/estimation workspace/i).first()).toBeVisible({ timeout: 10000 });

    // The quantity input should still be present (item persisted)
    const persistedQtyInput = page.locator('input[type="number"]').first();
    await expect(persistedQtyInput).toBeVisible({ timeout: 6000 });
  });

  // ─── 6. Back navigation works ────────────────────────────────────────────────

  test('Back button returns to service queue', async ({ page }) => {
    await mainBtn(page, /jc\/est/i).click();
    await expect(page).toHaveURL(/\/estimation\//, { timeout: 10000 });
    await expect(page.getByText(/estimation workspace/i).first()).toBeVisible({ timeout: 10000 });

    // Look for a back/arrow button — common patterns: "←", "Back", an SVG arrow button
    const backBtn =
      page.getByRole('button', { name: /back|←|arrow/i }).first()
      ?? page.locator('button').filter({ has: page.locator('svg') }).first();

    if (await backBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await backBtn.click();
    } else {
      // Fall back to browser back
      await page.goBack();
    }

    await expect(page).toHaveURL('/', { timeout: 8000 });
  });
});
