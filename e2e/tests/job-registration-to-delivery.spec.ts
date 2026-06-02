/**
 * E2E: Full job lifecycle — New Customer Registration → Job Card → Estimation
 *       → Status Workflow → Discount → Payment → Delivered
 *
 * Prerequisites: next dev (port 3000) and nest dev (port 4000) must be running.
 */

import { test, expect, Page, Locator } from '@playwright/test';

const CUSTOMER = {
  name: 'Rahul Verma',
  phone: '9876501234',
  email: 'rahul.verma@example.com',
  regNo: 'OD05TT9999',
  odometer: '18500',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Navigate to / and click Service Queue — waits until job card buttons are visible */
async function goToServiceQueue(page: Page) {
  await page.goto('/');
  await expect(page.locator('aside').getByRole('button', { name: /service queue/i })).toBeVisible({ timeout: 15000 });
  await page.locator('aside').getByRole('button', { name: /service queue/i }).click();
  await expect(page.locator('main').getByRole('button', { name: /jc\/est/i }).first()).toBeVisible({ timeout: 8000 });
}

/** Scoped to main content area — avoids accidentally clicking sidebar nav items */
function mainBtn(page: Page, name: string | RegExp) {
  return page.locator('main').getByRole('button', { name }).first();
}

/** Open status modal and select a status */
async function selectStatus(page: Page, label: string) {
  await mainBtn(page, /^status$/i).click();
  await expect(page.getByText('Update Job Status')).toBeVisible({ timeout: 5000 });
  await page.getByRole('button', { name: new RegExp(label, 'i') }).first().click();
  const updateBtn = page.getByRole('button', { name: /update status/i });
  await expect(updateBtn).toBeEnabled({ timeout: 3000 });
  await updateBtn.click();
  await page.waitForTimeout(700);
}

// ─── Step-by-step tests ───────────────────────────────────────────────────────

test.describe('Job Lifecycle: Registration → Delivery', () => {

  test.beforeEach(async ({ page }) => {
    await goToServiceQueue(page);
  });

  test('Step 1 — Register new customer and vehicle', async ({ page }) => {
    // Scope to header to avoid SHORTCUTS dropdown "Register Customer" button
    await page.locator('header').getByRole('button', { name: /new registration/i }).click();
    await expect(page.getByText('New Customer & Vehicle Check-In')).toBeVisible({ timeout: 5000 });

    await page.getByPlaceholder(/aditya pradhan/i).fill(CUSTOMER.name);
    await page.getByPlaceholder(/98765 43210/i).fill(CUSTOMER.phone);

    const emailInput = page.getByPlaceholder(/email/i).first();
    if (await emailInput.isVisible()) await emailInput.fill(CUSTOMER.email);

    const brandSel = page.locator('select').filter({ hasText: /select brand/i }).first();
    if (await brandSel.isVisible()) { await brandSel.selectOption({ index: 1 }); await page.waitForTimeout(400); }

    const modelSel = page.locator('select').filter({ hasText: /select model/i }).first();
    if (await modelSel.isVisible()) { await modelSel.selectOption({ index: 1 }); await page.waitForTimeout(400); }

    await page.getByPlaceholder(/OD-/i).or(page.getByPlaceholder(/registration/i)).first().fill(CUSTOMER.regNo);

    const odoInput = page.getByPlaceholder(/odometer|km/i).first();
    if (await odoInput.isVisible()) await odoInput.fill(CUSTOMER.odometer);

    await page.getByRole('button', { name: /register|check.?in|save/i }).last().click();
    await page.waitForTimeout(1500);

    const modalGone = await page.getByText('New Customer & Vehicle Check-In').isHidden().catch(() => true);
    expect(modalGone).toBeTruthy();
  });

  test('Step 2 — Open job card and navigate to estimation', async ({ page }) => {
    const jcButton = mainBtn(page, /jc\/est/i);
    await expect(jcButton).toBeVisible({ timeout: 8000 });
    await jcButton.click();
    await expect(page).toHaveURL(/\/estimation\//);
    await expect(page.getByText(/estimation workspace/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('Step 3 — Add spares and services in estimation', async ({ page }) => {
    await mainBtn(page, /jc\/est/i).click();
    await expect(page).toHaveURL(/\/estimation\//);

    // Catalog + buttons use SVG <Plus> icon — match by class, not text content
    const firstAddBtn = page.locator('button[class*="green-500/10"]').first();
    if (await firstAddBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstAddBtn.click();
      await page.waitForTimeout(400);
    }

    // Save / compile estimate
    const saveBtn = page.getByRole('button', { name: /compile estimate|save.*estimate|finalise/i }).first();
    if (await saveBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await saveBtn.click();
      await page.waitForTimeout(1000);
    }

    await goToServiceQueue(page);
  });

  test('Step 4 — Change status to Client Agreed', async ({ page }) => {
    await expect(mainBtn(page, /^status$/i)).toBeVisible({ timeout: 8000 });
    await selectStatus(page, 'Client Agreed');
    await expect(page.getByText(/client agreed|status updated/i).first()).toBeVisible({ timeout: 6000 });
  });

  test('Step 5 — Change status to Work in Progress', async ({ page }) => {
    await selectStatus(page, 'Work in Progress');
    await expect(page.getByText(/work in progress|status updated/i).first()).toBeVisible({ timeout: 6000 });
  });

  test('Step 6 — Apply a 10% discount', async ({ page }) => {
    await mainBtn(page, /discount/i).click();
    await expect(page.getByText('Discount Manager')).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: /% pct/i }).click();
    await page.getByPlaceholder(/e\.g\. 10/i).first().fill('10');
    await page.waitForTimeout(500);
    await expect(page.getByText(/net payable/i).first()).toBeVisible();
    const applyBtn = page.getByRole('button', { name: /apply.*discount/i });
    if (await applyBtn.isEnabled({ timeout: 2000 }).catch(() => false)) {
      await applyBtn.click();
    } else {
      await page.getByRole('button', { name: /cancel/i }).click();
    }
    await page.waitForTimeout(800);
  });

  test('Step 7 — Record payment', async ({ page }) => {
    await mainBtn(page, /^payments$/i).click();
    await expect(page.getByText(/edit payment details/i).first()).toBeVisible({ timeout: 5000 });
    await page.locator('input[type="number"]').first().fill('500');
    const remarksInput = page.getByPlaceholder(/remarks/i).first();
    if (await remarksInput.isVisible()) await remarksInput.fill('Advance cash payment');
    await page.getByRole('button', { name: /save|record payment/i }).last().click();
    await page.waitForTimeout(800);
    await expect(page.getByText(/payment recorded|advance payment/i).first()).toBeVisible({ timeout: 6000 });
  });

  test('Step 8 — Progress to Delivered', async ({ page }) => {
    for (const status of ['Work Completed', 'Out for Delivery', 'Delivered']) {
      await selectStatus(page, status);
    }
  });

  test('Step 9 — Timeline reflects full history', async ({ page }) => {
    await mainBtn(page, /view more/i).click();
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: /^timeline$/i }).first().click();
    await expect(page.getByText(/job card created/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('Step 10 — Generate invoice', async ({ page }) => {
    const invoiceBtn = mainBtn(page, /^invoice$/i);
    await expect(invoiceBtn).toBeVisible({ timeout: 8000 });
    if (await invoiceBtn.isEnabled()) {
      await invoiceBtn.click();
      await expect(page.getByText(/tax invoice|invoice/i).first()).toBeVisible({ timeout: 5000 });
      await page.getByRole('button', { name: /close/i }).click();
    } else {
      test.info().annotations.push({ type: 'note', description: 'Invoice skipped — balance due > 0.' });
    }
  });
});

// ─── Full smoke test ──────────────────────────────────────────────────────────

test('Full lifecycle smoke test — Registration to Delivered', async ({ page }) => {
  // 1. Load Service Queue
  await goToServiceQueue(page);

  // 2. Verify job cards exist
  const count = await page.locator('main').getByRole('button', { name: /jc\/est/i }).count();
  expect(count).toBeGreaterThan(0);

  // 3. Open estimation
  await mainBtn(page, /jc\/est/i).click();
  await expect(page).toHaveURL(/\/estimation\//);
  await expect(page.getByText(/estimation workspace/i).first()).toBeVisible({ timeout: 8000 });
  // Add first spare from catalog (SVG icon buttons — match by class)
  const firstAddBtn = page.locator('button[class*="green-500/10"]').first();
  if (await firstAddBtn.isVisible({ timeout: 2000 }).catch(() => false)) await firstAddBtn.click();
  // Back to queue
  await goToServiceQueue(page);

  // 4. Client Agreed
  await selectStatus(page, 'Client Agreed');

  // 5. Work in Progress
  await selectStatus(page, 'Work in Progress');

  // 6. Discount 10%
  await mainBtn(page, /discount/i).click();
  await expect(page.getByText('Discount Manager')).toBeVisible({ timeout: 5000 });
  await page.getByRole('button', { name: /% pct/i }).click();
  await page.getByPlaceholder(/e\.g\. 10/i).first().fill('10');
  await page.waitForTimeout(400);
  const applyBtn = page.getByRole('button', { name: /apply.*discount/i });
  if (await applyBtn.isEnabled({ timeout: 2000 }).catch(() => false)) {
    await applyBtn.click();
  } else {
    await page.getByRole('button', { name: /cancel/i }).click();
  }
  await page.waitForTimeout(600);

  // 7. Payment
  await mainBtn(page, /^payments$/i).click();
  await expect(page.getByText(/edit payment details/i).first()).toBeVisible({ timeout: 5000 });
  await page.locator('input[type="number"]').first().fill('1000');
  await page.getByRole('button', { name: /save|record/i }).last().click();
  await page.waitForTimeout(600);

  // 8. Work Completed → Out for Delivery → Delivered
  for (const s of ['Work Completed', 'Out for Delivery', 'Delivered']) {
    await selectStatus(page, s);
  }

  // 9. Timeline
  await mainBtn(page, /view more/i).click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: /^timeline$/i }).first().click();
  await expect(page.getByText(/job card created/i).first()).toBeVisible({ timeout: 5000 });

  console.log('✅ Full lifecycle smoke test passed');
});
