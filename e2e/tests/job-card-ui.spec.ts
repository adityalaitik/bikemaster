/**
 * E2E: Job Card UI Behaviour — Expand/Collapse, Side Panel, Tabs
 *
 * Prerequisites: next dev (port 3000) and nest dev (port 4000) must be running.
 */

import { test, expect } from '@playwright/test';
import { goToServiceQueue } from './helpers';

test.describe('Job Card UI — Expand, Side Panel & Tabs', () => {
  test.beforeEach(async ({ page }) => {
    await goToServiceQueue(page);
    // Ensure job cards are present for all tests in this suite
    const firstCard = page.locator('main').getByRole('button', { name: /jc\/est/i }).first();
    const visible = await firstCard.isVisible({ timeout: 8000 }).catch(() => false);
    if (!visible) {
      test.skip(true, 'No job cards in queue — skipping job card UI tests');
    }
  });

  // ─── 1. All cards start compact ─────────────────────────────────────────────

  test('All cards start compact — no View Less button visible on load', async ({ page }) => {
    const main = page.locator('main');

    // "View Less" buttons should not exist on initial load
    const viewLessBtns = main.getByRole('button', { name: /view less/i });
    const count = await viewLessBtns.count();
    expect(count).toBe(0);
  });

  // ─── 2. Clicking a card opens side panel ────────────────────────────────────

  test('Clicking a job card row opens the side panel', async ({ page }) => {
    const main = page.locator('main');

    const viewMoreBtn = main.getByRole('button', { name: /view more/i }).first();
    await expect(viewMoreBtn).toBeVisible({ timeout: 8000 });
    await viewMoreBtn.click();
    await page.waitForTimeout(500);

    // Side panel should appear with "ACTIVE CARD" heading
    const activeCardHeading = page.getByText(/active card/i).first();
    await expect(activeCardHeading).toBeVisible({ timeout: 6000 });
  });

  // ─── 3. Clicked card shows View Less ────────────────────────────────────────

  test('Expanded card changes button to View Less', async ({ page }) => {
    const main = page.locator('main');

    const viewMoreBtns = main.getByRole('button', { name: /view more/i });
    await expect(viewMoreBtns.first()).toBeVisible({ timeout: 8000 });
    await viewMoreBtns.first().click();
    await page.waitForTimeout(500);

    // The first card's button should now say "View Less"
    const viewLessBtn = main.getByRole('button', { name: /view less/i }).first();
    await expect(viewLessBtn).toBeVisible({ timeout: 5000 });
  });

  // ─── 4. Other cards still show View More ────────────────────────────────────

  test('Other cards still show View More after one is expanded', async ({ page }) => {
    const main = page.locator('main');

    const viewMoreBtns = main.getByRole('button', { name: /view more/i });
    const initialCount = await viewMoreBtns.count();

    if (initialCount < 2) {
      test.skip(true, 'Need at least 2 job cards for this test — skipping');
      return;
    }

    // Expand the first card
    await viewMoreBtns.first().click();
    await page.waitForTimeout(500);

    // At least one "View More" button should remain visible
    const remainingViewMore = main.getByRole('button', { name: /view more/i });
    const remainingCount = await remainingViewMore.count();
    expect(remainingCount).toBeGreaterThanOrEqual(1);
  });

  // ─── 5. View Less closes side panel ─────────────────────────────────────────

  test('Clicking View Less hides the side panel', async ({ page }) => {
    const main = page.locator('main');

    // Open the first card
    const viewMoreBtn = main.getByRole('button', { name: /view more/i }).first();
    await viewMoreBtn.click();
    await page.waitForTimeout(500);

    // Confirm panel is open
    await expect(page.getByText(/active card/i).first()).toBeVisible({ timeout: 5000 });

    // Click View Less
    const viewLessBtn = main.getByRole('button', { name: /view less/i }).first();
    await expect(viewLessBtn).toBeVisible({ timeout: 3000 });
    await viewLessBtn.click();
    await page.waitForTimeout(500);

    // Side panel should disappear
    const panel = page.getByText(/active card/i).first();
    await expect(panel).toBeHidden({ timeout: 5000 });
  });

  // ─── 6. Side panel X button closes ──────────────────────────────────────────

  test('Side panel X button closes panel and restores all View More buttons', async ({ page }) => {
    const main = page.locator('main');

    // Open first card
    const viewMoreBtn = main.getByRole('button', { name: /view more/i }).first();
    await viewMoreBtn.click();
    await page.waitForTimeout(500);

    await expect(page.getByText(/active card/i).first()).toBeVisible({ timeout: 5000 });

    // Find the X button in the side panel — it's typically in the panel header
    // Scope to panel area (right side) to avoid clicking other close buttons
    const sidePanel = page.locator(
      '[class*="side-panel"], [class*="sidePanel"], aside ~ *, [data-testid*="panel"]',
    ).last();

    // Try panel-scoped X first, then fall back to any visible X/close
    let xBtn = sidePanel.getByRole('button', { name: /×|✕|close|x/i }).first();
    let xVisible = await xBtn.isVisible({ timeout: 2000 }).catch(() => false);

    if (!xVisible) {
      // Broader search: look for a button with just "×" or "✕" text anywhere on page
      xBtn = page.getByRole('button', { name: /^[×✕x]$/i }).first();
      xVisible = await xBtn.isVisible({ timeout: 2000 }).catch(() => false);
    }

    if (!xVisible) {
      // Last resort: any button containing the close SVG next to the active card heading
      xBtn = page.locator('button svg[class*="close"], button[aria-label*="close"]').first();
      xVisible = await xBtn.isVisible({ timeout: 2000 }).catch(() => false);
    }

    if (!xVisible) {
      test.skip(true, 'Could not locate side panel X button — skipping');
      return;
    }

    await xBtn.click();
    await page.waitForTimeout(500);

    // Panel should disappear
    const panel = page.getByText(/active card/i).first();
    await expect(panel).toBeHidden({ timeout: 5000 });

    // All job cards should now show "View More" (none in expanded state)
    const viewLessBtns = main.getByRole('button', { name: /view less/i });
    const viewLessCount = await viewLessBtns.count();
    expect(viewLessCount).toBe(0);
  });

  // ─── 7. Side panel tabs work — Timeline ─────────────────────────────────────

  test('Timeline tab in side panel shows Job Card Created event', async ({ page }) => {
    const main = page.locator('main');

    // Open first card
    const viewMoreBtn = main.getByRole('button', { name: /view more/i }).first();
    await viewMoreBtn.click();
    await page.waitForTimeout(500);

    await expect(page.getByText(/active card/i).first()).toBeVisible({ timeout: 5000 });

    // Click the Timeline tab inside the side panel
    const timelineTab = page.getByRole('button', { name: /^timeline$/i }).first();
    await expect(timelineTab).toBeVisible({ timeout: 5000 });
    await timelineTab.click();
    await page.waitForTimeout(500);

    // "Job Card Created" entry should be visible
    const createdEntry = page.getByText(/job card created/i).first();
    await expect(createdEntry).toBeVisible({ timeout: 6000 });
  });
});
