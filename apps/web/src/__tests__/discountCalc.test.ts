// Pure discount calculation functions extracted from the discount modal logic

function lineItemDiscount(item: {
  type: 'percentage' | 'amount';
  value: number;
  total: number;
}): number {
  const d =
    item.type === 'percentage' ? (item.total * item.value) / 100 : item.value;
  return Math.min(Math.max(d, 0), item.total);
}

function overallDiscount(
  type: 'percentage' | 'amount',
  value: number,
  estimate: number,
): number {
  return type === 'percentage' ? (estimate * value) / 100 : value;
}

function netPayable(estimate: number, totalDiscount: number): number {
  return Math.max(estimate - Math.min(totalDiscount, estimate), 0);
}

// ---------------------------------------------------------------------------
// lineItemDiscount
// ---------------------------------------------------------------------------
describe('lineItemDiscount', () => {
  test('10% on ₹1000 → ₹100', () => {
    expect(lineItemDiscount({ type: 'percentage', value: 10, total: 1000 })).toBe(100);
  });

  test('₹200 flat on ₹1000 → ₹200', () => {
    expect(lineItemDiscount({ type: 'amount', value: 200, total: 1000 })).toBe(200);
  });

  test('discount capped at item total: ₹200 discount on ₹150 total → ₹150', () => {
    expect(lineItemDiscount({ type: 'amount', value: 200, total: 150 })).toBe(150);
  });

  test('percentage exceeding 100% is capped at item total', () => {
    // 150% of ₹1000 = ₹1500, but capped at ₹1000
    expect(lineItemDiscount({ type: 'percentage', value: 150, total: 1000 })).toBe(1000);
  });

  test('negative value is clamped to 0', () => {
    expect(lineItemDiscount({ type: 'amount', value: -50, total: 1000 })).toBe(0);
  });

  test('negative percentage is clamped to 0', () => {
    expect(lineItemDiscount({ type: 'percentage', value: -10, total: 1000 })).toBe(0);
  });

  test('0% discount → ₹0', () => {
    expect(lineItemDiscount({ type: 'percentage', value: 0, total: 1000 })).toBe(0);
  });

  test('₹0 discount → ₹0', () => {
    expect(lineItemDiscount({ type: 'amount', value: 0, total: 1000 })).toBe(0);
  });

  test('100% discount equals total', () => {
    expect(lineItemDiscount({ type: 'percentage', value: 100, total: 500 })).toBe(500);
  });
});

// ---------------------------------------------------------------------------
// overallDiscount
// ---------------------------------------------------------------------------
describe('overallDiscount', () => {
  test('18% on ₹3200 → ₹576', () => {
    expect(overallDiscount('percentage', 18, 3200)).toBe(576);
  });

  test('₹500 flat discount → ₹500', () => {
    expect(overallDiscount('amount', 500, 3200)).toBe(500);
  });

  test('0% discount → ₹0', () => {
    expect(overallDiscount('percentage', 0, 3200)).toBe(0);
  });

  test('100% discount → full estimate', () => {
    expect(overallDiscount('percentage', 100, 3200)).toBe(3200);
  });

  test('₹0 flat discount → ₹0', () => {
    expect(overallDiscount('amount', 0, 3200)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// netPayable
// ---------------------------------------------------------------------------
describe('netPayable', () => {
  test('₹3200 estimate with ₹576 discount → ₹2624', () => {
    expect(netPayable(3200, 576)).toBe(2624);
  });

  test('never goes below 0: discount exceeds estimate', () => {
    expect(netPayable(500, 800)).toBe(0);
  });

  test('discount equal to estimate → ₹0', () => {
    expect(netPayable(1000, 1000)).toBe(0);
  });

  test('no discount applied → full estimate', () => {
    expect(netPayable(3200, 0)).toBe(3200);
  });

  test('small discount on large estimate', () => {
    expect(netPayable(5000, 200)).toBe(4800);
  });
});
