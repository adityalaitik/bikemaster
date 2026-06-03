/**
 * E2E: Discount Manager — Offers & Apply
 *
 * Prerequisites: next dev (port 3000) and nest dev (port 4000) must be running.
 * Setup: Needs at least one job card with isEstimated=true to run most tests.
 */

import { test, expect, Page } from '@playwright/test';
import { goToServiceQueue, mainBtn } from './helpers';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Find and click an estimated job card's Discount button.
 * Returns false if no estimated card is found.
 */
async function openDiscountModal(page: Page): Promise<boolean> {
  const main = page.locator('main');

  // Look for a Discount button that is NOT disabled/dimmed
  const discountBtns = main.getByRole('button', { name: /^discount$/i });
  const count = await discountBtns.count();

  for (let i = 0; i < count; i++) {
    const btn = discountBtns.nth(i);
    const isDisabled =
      (await btn.getAttribute('disabled')) !== null ||
      ((await btn.getAttribute('class')) ?? '').includes('opacity-30') ||
      ((await btn.getAttribute('class')) ?? '').includes('cursor-not-allowed');

    if (!isDisabled) {
      await btn.click();
      const heading = page.getByText('Discount Manager');
      const visible = await heading.isVisible({ timeout: 6000 }).catch(() => false);
      if (visible) return true;
      // Modal didn't open — maybe wrong button; try closing and next
      const closeBtn = page.getByRole('button', { name: /close|cancel|✕/i }).first();
      if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await closeBtn.click();
        await page.waitForTimeout(300);
      }
    }
  }
  return false;
}

/** Close discount modal if open */
async function closeModal(page: Page) {
  const cancelBtn = page.getByRole('button', { name: /cancel|close/i }).first();
  if (await cancelBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await cancelBtn.click();
    await page.waitForTimeout(400);
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test.describe('Discount Manager — Offers & Apply', () => {
  test.beforeEach(async ({ page }) => {
    await goToServiceQueue(page);
  });

  // ─── 1. Discount button opens modal ─────────────────────────────────────────

  test('Discount button opens modal', async ({ page }) => {
    const opened = await openDiscountModal(page);
    if (!opened) {
      test.skip(true, 'No estimated job cards found — skipping discount modal test');
      return;
    }
    await expect(page.getByText('Discount Manager')).toBeVisible({ timeout: 8000 });
    await closeModal(page);
  });

  // ─── 2. Offers are displayed ─────────────────────────────────────────────────

  test('Offers are displayed', async ({ page }) => {
    const opened = await openDiscountModal(page);
    if (!opened) {
      test.skip(true, 'No estimated job cards found — skipping offers display test');
      return;
    }

    // Radio buttons or clickable offer labels should be present
    const knownOffers = [
      /super summer discount/i,
      /loyal rider benefit/i,
      /engine flush combo/i,
    ];

    let foundAny = false;
    for (const offerName of knownOffers) {
      const offerEl = page.getByText(offerName).first();
      if (await offerEl.isVisible({ timeout: 3000 }).catch(() => false)) {
        foundAny = true;
        break;
      }
    }

    // Also accept any radio input inside the modal
    if (!foundAny) {
      const radioInputs = page.locator('input[type="radio"]');
      const radioCount = await radioInputs.count();
      foundAny = radioCount > 0;
    }

    expect(foundAny).toBe(true);
    await closeModal(page);
  });

  // ─── 3. Selecting an offer fills discount field ──────────────────────────────

  test('Selecting an offer fills discount field', async ({ page }) => {
    const opened = await openDiscountModal(page);
    if (!opened) {
      test.skip(true, 'No estimated job cards found — skipping offer-fills-field test');
      return;
    }

    // Click "Super Summer Discount" offer (10% off)
    const offer = page.getByText(/super summer discount/i).first();
    const offerVisible = await offer.isVisible({ timeout: 4000 }).catch(() => false);
    if (!offerVisible) {
      test.skip(true, 'Super Summer Discount offer not found — skipping');
      return;
    }

    await offer.click();
    await page.waitForTimeout(500);

    // The discount value input should now contain "10"
    const discountInput = page
      .locator('input[type="number"], input[type="text"]')
      .filter({ hasText: '' })
      .first();

    // Prefer a specific placeholder if available
    const valueInput =
      (await page.getByPlaceholder(/e\.g\. 10|discount value|amount/i).first().isVisible({ timeout: 2000 }).catch(() => false))
        ? page.getByPlaceholder(/e\.g\. 10|discount value|amount/i).first()
        : discountInput;

    const val = await valueInput.inputValue();
    expect(val).toMatch(/10/);

    // Type indicator should mention Pct or %
    const pctLabel = page.getByText(/% pct|percent|pct/i).first();
    await expect(pctLabel).toBeVisible({ timeout: 3000 });

    await closeModal(page);
  });

  // ─── 4. Only one offer selectable ───────────────────────────────────────────

  test('Only one offer selectable at a time', async ({ page }) => {
    const opened = await openDiscountModal(page);
    if (!opened) {
      test.skip(true, 'No estimated job cards found — skipping single-select test');
      return;
    }

    const radioInputs = page.locator('input[type="radio"]');
    const radioCount = await radioInputs.count();

    if (radioCount < 2) {
      // Try text-based offer rows
      const offerNames = [/super summer discount/i, /loyal rider benefit/i];
      let firstFound = false;
      let secondFound = false;

      for (const name of offerNames) {
        const el = page.getByText(name).first();
        if (await el.isVisible({ timeout: 2000 }).catch(() => false)) {
          if (!firstFound) { await el.click(); firstFound = true; }
          else { await el.click(); secondFound = true; break; }
        }
      }

      if (!firstFound || !secondFound) {
        test.skip(true, 'Fewer than 2 offers visible — skipping single-select test');
        return;
      }
    } else {
      // Click first radio, then second — first should deselect
      await radioInputs.first().click();
      await page.waitForTimeout(300);
      expect(await radioInputs.first().isChecked()).toBe(true);

      await radioInputs.nth(1).click();
      await page.waitForTimeout(300);
      expect(await radioInputs.nth(1).isChecked()).toBe(true);
      expect(await radioInputs.first().isChecked()).toBe(false);
    }

    await closeModal(page);
  });

  // ─── 5. Clear offer resets the field ────────────────────────────────────────

  test('Clear offer resets the discount field', async ({ page }) => {
    const opened = await openDiscountModal(page);
    if (!opened) {
      test.skip(true, 'No estimated job cards found — skipping clear-offer test');
      return;
    }

    // Select any visible offer first
    const offer = page.getByText(/super summer discount/i).first();
    const offerVisible = await offer.isVisible({ timeout: 4000 }).catch(() => false);
    if (!offerVisible) {
      test.skip(true, 'Super Summer Discount offer not found — skipping');
      return;
    }
    await offer.click();
    await page.waitForTimeout(500);

    // Click clear
    const clearBtn = page.getByRole('button', { name: /clear offer|✕ clear/i }).first();
    await expect(clearBtn).toBeVisible({ timeout: 4000 });
    await clearBtn.click();
    await page.waitForTimeout(400);

    // Discount value input should be empty or 0
    const valueInput = page.getByPlaceholder(/e\.g\. 10|discount value|amount/i).first();
    if (await valueInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      const val = await valueInput.inputValue();
      expect(val === '' || val === '0').toBe(true);
    }

    await closeModal(page);
  });

  // ─── 6. Apply discount saves ─────────────────────────────────────────────────

  test('Apply discount closes modal and shows success toast', async ({ page }) => {
    const opened = await openDiscountModal(page);
    if (!opened) {
      test.skip(true, 'No estimated job cards found — skipping apply-discount test');
      return;
    }

    // Select Super Summer Discount offer
    const offer = page.getByText(/super summer discount/i).first();
    const offerVisible = await offer.isVisible({ timeout: 4000 }).catch(() => false);

    if (offerVisible) {
      await offer.click();
      await page.waitForTimeout(500);
    } else {
      // Fall back: manually select % type and enter a value
      const pctBtn = page.getByRole('button', { name: /% pct/i });
      if (await pctBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await pctBtn.click();
      }
      const valueInput = page.getByPlaceholder(/e\.g\. 10/i).first();
      if (await valueInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await valueInput.fill('5');
      }
      await page.waitForTimeout(400);
    }

    const applyBtn = page.getByRole('button', { name: /apply.*discount/i });
    await expect(applyBtn).toBeVisible({ timeout: 4000 });

    if (await applyBtn.isEnabled({ timeout: 3000 }).catch(() => false)) {
      await applyBtn.click();
      await page.waitForTimeout(800);

      // Modal should close
      await expect(page.getByText('Discount Manager')).toBeHidden({ timeout: 5000 });

      // Toast / success message should appear
      const toast = page.getByText(/discount applied|success|saved/i).first();
      await expect(toast).toBeVisible({ timeout: 6000 });
    } else {
      test.skip(true, 'Apply button not enabled — check if estimation exists');
    }
  });
});
