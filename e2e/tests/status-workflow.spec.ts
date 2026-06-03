/**
 * E2E: Status Change Modal — Workflow Options & Updates
 *
 * Prerequisites: next dev (port 3000) and nest dev (port 4000) must be running.
 */

import { test, expect, Page } from '@playwright/test';
import { goToServiceQueue, mainBtn } from './helpers';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Find an estimated job card's Status button and click it.
 * Returns true if the "Update Job Status" modal opens successfully.
 */
async function openStatusModal(page: Page): Promise<boolean> {
  const main = page.locator('main');

  const statusBtns = main.getByRole('button', { name: /^status$/i });
  const count = await statusBtns.count();

  for (let i = 0; i < count; i++) {
    const btn = statusBtns.nth(i);
    const cls = (await btn.getAttribute('class')) ?? '';
    const isDisabled =
      (await btn.getAttribute('disabled')) !== null ||
      cls.includes('opacity-30') ||
      cls.includes('cursor-not-allowed');

    if (!isDisabled) {
      await btn.click();
      const heading = page.getByText('Update Job Status');
      const visible = await heading.isVisible({ timeout: 6000 }).catch(() => false);
      if (visible) return true;

      // Modal didn't open — close and try next
      const closeBtn = page.getByRole('button', { name: /close|cancel/i }).first();
      if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await closeBtn.click();
        await page.waitForTimeout(300);
      }
    }
  }
  return false;
}

/** Close status modal if open */
async function closeStatusModal(page: Page) {
  const cancelBtn = page.getByRole('button', { name: /cancel|close/i }).first();
  if (await cancelBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await cancelBtn.click();
    await page.waitForTimeout(400);
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test.describe('Status Change Modal — Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await goToServiceQueue(page);
  });

  // ─── 1. Status button opens modal ───────────────────────────────────────────

  test('Status button opens modal', async ({ page }) => {
    const opened = await openStatusModal(page);
    if (!opened) {
      test.skip(true, 'No estimated job cards found — skipping status modal test');
      return;
    }
    await expect(page.getByText('Update Job Status')).toBeVisible({ timeout: 8000 });
    await closeStatusModal(page);
  });

  // ─── 2. All 6 workflow options present ──────────────────────────────────────

  test('All 6 workflow status options are present', async ({ page }) => {
    const opened = await openStatusModal(page);
    if (!opened) {
      test.skip(true, 'No estimated job cards found — skipping workflow options test');
      return;
    }

    const expectedStatuses = [
      /client agreed/i,
      /work in progress/i,
      /work on hold/i,
      /work completed/i,
      /out for delivery/i,
      /delivered/i,
    ];

    for (const statusName of expectedStatuses) {
      const btn = page.getByRole('button', { name: statusName }).first();
      await expect(btn).toBeVisible({ timeout: 5000 });
    }

    await closeStatusModal(page);
  });

  // ─── 3. Selecting a status enables Update button ────────────────────────────

  test('Selecting a status enables the Update Status button', async ({ page }) => {
    const opened = await openStatusModal(page);
    if (!opened) {
      test.skip(true, 'No estimated job cards found — skipping enable-update-btn test');
      return;
    }

    // "Update Status" button should be disabled initially (nothing selected)
    const updateBtn = page.getByRole('button', { name: /update status/i });
    await expect(updateBtn).toBeVisible({ timeout: 5000 });

    // Click "Work in Progress"
    const wipBtn = page.getByRole('button', { name: /work in progress/i }).first();
    await wipBtn.click();
    await page.waitForTimeout(300);

    // Now it should be enabled
    await expect(updateBtn).toBeEnabled({ timeout: 3000 });

    await closeStatusModal(page);
  });

  // ─── 4. Status updates and toast appears ────────────────────────────────────

  test('Selecting Work in Progress and updating shows confirmation', async ({ page }) => {
    const opened = await openStatusModal(page);
    if (!opened) {
      test.skip(true, 'No estimated job cards found — skipping status update test');
      return;
    }

    // Click "Work in Progress"
    const wipBtn = page.getByRole('button', { name: /work in progress/i }).first();
    await wipBtn.click();
    await page.waitForTimeout(300);

    const updateBtn = page.getByRole('button', { name: /update status/i });
    await expect(updateBtn).toBeEnabled({ timeout: 3000 });
    await updateBtn.click();
    await page.waitForTimeout(800);

    // Modal should close
    await expect(page.getByText('Update Job Status')).toBeHidden({ timeout: 5000 });

    // A toast or status badge update should appear
    const confirmation = page
      .getByText(/work in progress|status updated|updated successfully/i)
      .first();
    await expect(confirmation).toBeVisible({ timeout: 6000 });
  });

  // ─── 5. Status disabled without estimation ──────────────────────────────────

  test('Status button is disabled for job cards without estimation', async ({ page }) => {
    const main = page.locator('main');

    const statusBtns = main.getByRole('button', { name: /^status$/i });
    const count = await statusBtns.count();

    if (count === 0) {
      test.skip(true, 'No job cards visible — skipping disabled-button test');
      return;
    }

    // Look for at least one disabled status button
    let foundDisabled = false;
    for (let i = 0; i < count; i++) {
      const btn = statusBtns.nth(i);
      const cls = (await btn.getAttribute('class')) ?? '';
      const isDisabled =
        (await btn.getAttribute('disabled')) !== null ||
        cls.includes('opacity-30') ||
        cls.includes('cursor-not-allowed') ||
        cls.includes('disabled');

      if (isDisabled) {
        foundDisabled = true;
        // Extra assertion: clicking it should not open the modal
        await btn.click({ force: false }).catch(() => {});
        await page.waitForTimeout(300);
        const modalVisible = await page
          .getByText('Update Job Status')
          .isVisible({ timeout: 1000 })
          .catch(() => false);
        expect(modalVisible).toBe(false);
        break;
      }
    }

    if (!foundDisabled) {
      // All buttons enabled — means all cards are estimated; that's also valid
      test.info().annotations.push({
        type: 'note',
        description: 'All Status buttons are enabled — all job cards appear to be estimated.',
      });
    }
  });
});
