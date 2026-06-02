/**
 * E2E: Service Queue — Filters & Search
 *
 * Prerequisites: next dev (port 3000) and nest dev (port 4000) must be running.
 */

import { test, expect } from '@playwright/test';
import { goToServiceQueue, parseCount } from './helpers';

test.describe('Service Queue — Filters & Search', () => {
  test.beforeEach(async ({ page }) => {
    await goToServiceQueue(page);
  });

  // ─── 1. Tab counts add up to total ──────────────────────────────────────────

  test('Tab counts add up to total', async ({ page }) => {
    const main = page.locator('main');

    // Grab "All Jobs N" button text
    const allJobsBtn = main.getByRole('button', { name: /all jobs/i }).first();
    await expect(allJobsBtn).toBeVisible({ timeout: 8000 });
    const allText = await allJobsBtn.textContent() ?? '';
    const total = parseCount(allText);

    if (total === 0) {
      test.skip(true, 'No jobs in queue — skipping count assertion');
      return;
    }

    // Collect individual tab counts
    const tabNames = [
      /under servicing/i,
      /ready for delivery/i,
      /payment processing/i,
      /completed/i,
    ];

    let tabSum = 0;
    for (const name of tabNames) {
      const btn = main.getByRole('button', { name }).first();
      if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
        const txt = await btn.textContent() ?? '';
        tabSum += parseCount(txt);
      }
    }

    // The tab counts should sum to the total shown on "All Jobs"
    expect(tabSum).toBe(total);
  });

  // ─── 2. Under Servicing tab filters correctly ────────────────────────────────

  test('Under Servicing tab filters correctly', async ({ page }) => {
    const main = page.locator('main');

    const underServicingTab = main.getByRole('button', { name: /under servicing/i }).first();
    await expect(underServicingTab).toBeVisible({ timeout: 8000 });
    await underServicingTab.click();
    await page.waitForTimeout(500);

    // Collect all visible status badge texts on job cards
    // Status badges are typically small spans inside each card row
    const badgeTexts: string[] = [];
    const badges = main.locator('[class*="badge"], [class*="status"], span').filter({
      hasText: /completed|delivered|ready for delivery/i,
    });
    const badgeCount = await badges.count();

    // Assert none of the cards have disallowed statuses
    const disallowed = ['Completed', 'Delivered', 'Ready for Delivery', 'DONE'];
    for (let i = 0; i < badgeCount; i++) {
      const txt = (await badges.nth(i).textContent()) ?? '';
      badgeTexts.push(txt.trim());
    }

    // Under Servicing tab should contain none of the disallowed statuses in visible cards
    for (const txt of badgeTexts) {
      for (const dis of disallowed) {
        expect(txt).not.toMatch(new RegExp(`^${dis}$`, 'i'));
      }
    }
  });

  // ─── 3. Completed tab shows only completed jobs ──────────────────────────────

  test('Completed tab shows only completed jobs', async ({ page }) => {
    const main = page.locator('main');

    const completedTab = main.getByRole('button', { name: /^completed/i }).first();
    await expect(completedTab).toBeVisible({ timeout: 8000 });

    // Get count from tab label
    const tabText = await completedTab.textContent() ?? '';
    const tabCount = parseCount(tabText);

    await completedTab.click();
    await page.waitForTimeout(500);

    // Count visible job card buttons
    const cards = main.getByRole('button', { name: /jc\/est/i });
    const visibleCards = await cards.count();

    // The number of job cards shown should match the tab's count
    expect(visibleCards).toBe(tabCount);
  });

  // ─── 4. Search filters job cards ────────────────────────────────────────────

  test('Search filters job cards', async ({ page }) => {
    const main = page.locator('main');

    const allJobsBtn = main.getByRole('button', { name: /all jobs/i }).first();
    await expect(allJobsBtn).toBeVisible({ timeout: 8000 });
    await allJobsBtn.click();
    await page.waitForTimeout(400);

    const totalBefore = await main.getByRole('button', { name: /jc\/est/i }).count();

    if (totalBefore === 0) {
      test.skip(true, 'No jobs in queue — skipping search test');
      return;
    }

    // Grab the reg number / name from the first visible card to search for it
    const firstCard = main.getByRole('button', { name: /jc\/est/i }).first();
    const cardText = (await firstCard.textContent()) ?? '';

    // Extract a meaningful token (e.g. partial reg no or JC number)
    const searchTerm = cardText.replace(/\s+/g, ' ').trim().split(/\s+/)[0];

    const searchInput = page.getByPlaceholder(/search by vehicle/i);
    await expect(searchInput).toBeVisible({ timeout: 5000 });
    await searchInput.fill(searchTerm);
    await page.waitForTimeout(600);

    const totalAfter = await main.getByRole('button', { name: /jc\/est/i }).count();

    // After searching, either fewer cards or same count (if all match); but result must be ≤ before
    expect(totalAfter).toBeLessThanOrEqual(totalBefore);

    // At least one card should still be visible
    expect(totalAfter).toBeGreaterThan(0);
  });

  // ─── 5. Clearing search restores all cards ───────────────────────────────────

  test('Clearing search restores all cards', async ({ page }) => {
    const main = page.locator('main');

    const allJobsBtn = main.getByRole('button', { name: /all jobs/i }).first();
    await expect(allJobsBtn).toBeVisible({ timeout: 8000 });
    await allJobsBtn.click();
    await page.waitForTimeout(400);

    const totalBefore = await main.getByRole('button', { name: /jc\/est/i }).count();

    if (totalBefore === 0) {
      test.skip(true, 'No jobs in queue — skipping search-clear test');
      return;
    }

    const searchInput = page.getByPlaceholder(/search by vehicle/i);
    await expect(searchInput).toBeVisible({ timeout: 5000 });

    // Type something unlikely to match many cards
    await searchInput.fill('ZZZZNOTEXIST');
    await page.waitForTimeout(600);

    // Clear the search
    await searchInput.clear();
    await page.waitForTimeout(600);

    const totalAfter = await main.getByRole('button', { name: /jc\/est/i }).count();
    expect(totalAfter).toBe(totalBefore);
  });

  // ─── 6. Sidebar badge count is correct ──────────────────────────────────────

  test('Sidebar badge count is correct', async ({ page }) => {
    const main = page.locator('main');
    const aside = page.locator('aside');

    const allJobsBtn = main.getByRole('button', { name: /all jobs/i }).first();
    await expect(allJobsBtn).toBeVisible({ timeout: 8000 });
    const allText = await allJobsBtn.textContent() ?? '';
    const total = parseCount(allText);

    const completedTab = main.getByRole('button', { name: /^completed/i }).first();
    const completedText = await completedTab.textContent() ?? '';
    const completedCount = parseCount(completedText);

    const expectedBadge = total - completedCount;

    // Find sidebar badge — it's a span sibling/child of the service queue button
    const sidebarBtn = aside.getByRole('button', { name: /service queue/i });
    await expect(sidebarBtn).toBeVisible({ timeout: 5000 });

    // The badge may be rendered as a child span with a number
    const badgeSpan = sidebarBtn.locator('span').filter({ hasText: /^\d+$/ }).first();
    const badgeVisible = await badgeSpan.isVisible({ timeout: 3000 }).catch(() => false);

    if (!badgeVisible) {
      // Some implementations embed the count in the button text itself
      const btnText = await sidebarBtn.textContent() ?? '';
      const badgeNum = parseCount(btnText);
      expect(badgeNum).toBe(expectedBadge);
    } else {
      const badgeText = await badgeSpan.textContent() ?? '';
      expect(parseCount(badgeText)).toBe(expectedBadge);
    }
  });
});
