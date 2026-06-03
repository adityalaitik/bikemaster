// Pure offer application logic extracted from the discount modal

function applyOffer(
  offer: { offerType: string; discountValue: number },
  estimate: number,
) {
  if (offer.offerType === 'percentage') {
    return {
      type: 'percentage' as const,
      value: offer.discountValue,
      amount: (estimate * offer.discountValue) / 100,
    };
  }
  return {
    type: 'amount' as const,
    value: offer.discountValue,
    amount: offer.discountValue,
  };
}

describe('applyOffer', () => {
  describe('percentage offer', () => {
    test('10% on ₹3200 → amount ₹320, type "percentage"', () => {
      const result = applyOffer({ offerType: 'percentage', discountValue: 10 }, 3200);
      expect(result.type).toBe('percentage');
      expect(result.value).toBe(10);
      expect(result.amount).toBe(320);
    });

    test('0% offer → amount ₹0', () => {
      const result = applyOffer({ offerType: 'percentage', discountValue: 0 }, 3200);
      expect(result.type).toBe('percentage');
      expect(result.amount).toBe(0);
    });

    test('100% offer → amount equals estimate', () => {
      const result = applyOffer({ offerType: 'percentage', discountValue: 100 }, 2000);
      expect(result.type).toBe('percentage');
      expect(result.amount).toBe(2000);
    });
  });

  describe('fixed amount offer', () => {
    test('₹100 flat → amount ₹100, type "amount"', () => {
      const result = applyOffer({ offerType: 'amount', discountValue: 100 }, 3200);
      expect(result.type).toBe('amount');
      expect(result.value).toBe(100);
      expect(result.amount).toBe(100);
    });

    test('amount offer is independent of estimate', () => {
      const result1 = applyOffer({ offerType: 'amount', discountValue: 500 }, 1000);
      const result2 = applyOffer({ offerType: 'amount', discountValue: 500 }, 9999);
      expect(result1.amount).toBe(500);
      expect(result2.amount).toBe(500);
    });

    test('₹0 flat offer → amount ₹0', () => {
      const result = applyOffer({ offerType: 'amount', discountValue: 0 }, 3200);
      expect(result.type).toBe('amount');
      expect(result.amount).toBe(0);
    });
  });

  describe('free_part offer type (falls back to amount)', () => {
    test('offerType "free_part" → type "amount"', () => {
      const result = applyOffer({ offerType: 'free_part', discountValue: 250 }, 3200);
      expect(result.type).toBe('amount');
    });

    test('offerType "free_part" → amount equals discountValue', () => {
      const result = applyOffer({ offerType: 'free_part', discountValue: 250 }, 3200);
      expect(result.amount).toBe(250);
    });

    test('any unknown offerType falls back to amount', () => {
      const result = applyOffer({ offerType: 'unknown_type', discountValue: 75 }, 1000);
      expect(result.type).toBe('amount');
      expect(result.amount).toBe(75);
    });
  });
});
