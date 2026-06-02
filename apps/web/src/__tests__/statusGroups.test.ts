// Pure status group definitions extracted from page.tsx
const IN_PROGRESS_STATUSES = new Set([
  "Under Servicing",
  "Client Agreed",
  "Work in Progress",
  "Work on Hold",
  "Work Completed",
  "Draft",
]);

const READY_STATUSES = new Set([
  "Ready for Delivery",
  "Out for Delivery",
  "Next Day Delivery",
  "Upcoming Delivery",
]);

const PAYMENT_STATUSES = new Set(["Payment Processing"]);

const COMPLETED_STATUSES = new Set(["Completed", "Delivered"]);

const ALL_SETS = [IN_PROGRESS_STATUSES, READY_STATUSES, PAYMENT_STATUSES, COMPLETED_STATUSES];

const ALL_KNOWN_STATUSES = new Set([
  "Under Servicing",
  "Client Agreed",
  "Work in Progress",
  "Work on Hold",
  "Work Completed",
  "Draft",
  "Ready for Delivery",
  "Out for Delivery",
  "Next Day Delivery",
  "Upcoming Delivery",
  "Payment Processing",
  "Completed",
  "Delivered",
]);

// Helper: count how many sets contain a given status
function countMemberships(status: string): number {
  return ALL_SETS.filter((s) => s.has(status)).length;
}

describe('IN_PROGRESS_STATUSES', () => {
  const statuses = [
    "Under Servicing",
    "Client Agreed",
    "Work in Progress",
    "Work on Hold",
    "Work Completed",
    "Draft",
  ];

  test.each(statuses)('contains "%s"', (status) => {
    expect(IN_PROGRESS_STATUSES.has(status)).toBe(true);
  });
});

describe('READY_STATUSES', () => {
  const statuses = [
    "Ready for Delivery",
    "Out for Delivery",
    "Next Day Delivery",
    "Upcoming Delivery",
  ];

  test.each(statuses)('contains "%s"', (status) => {
    expect(READY_STATUSES.has(status)).toBe(true);
  });
});

describe('PAYMENT_STATUSES', () => {
  test('contains "Payment Processing"', () => {
    expect(PAYMENT_STATUSES.has("Payment Processing")).toBe(true);
  });
});

describe('COMPLETED_STATUSES', () => {
  test('contains "Completed"', () => {
    expect(COMPLETED_STATUSES.has("Completed")).toBe(true);
  });

  test('contains "Delivered"', () => {
    expect(COMPLETED_STATUSES.has("Delivered")).toBe(true);
  });
});

describe('No status appears in more than one set', () => {
  test('each known status belongs to exactly one set', () => {
    ALL_KNOWN_STATUSES.forEach((status) => {
      expect(countMemberships(status)).toBe(1);
    });
  });
});

describe('All known statuses are covered', () => {
  test('union of all sets equals the full known set', () => {
    const union = new Set<string>();
    ALL_SETS.forEach((s) => s.forEach((v) => union.add(v)));

    ALL_KNOWN_STATUSES.forEach((status) => {
      expect(union.has(status)).toBe(true);
    });

    expect(union.size).toBe(ALL_KNOWN_STATUSES.size);
  });
});

describe('Unknown statuses do not appear in any set', () => {
  const unknownStatuses = [
    "Pending",
    "Cancelled",
    "Rejected",
    "In Queue",
    "Inspection",
    "",
    "random status",
  ];

  test.each(unknownStatuses)('"%s" is not in any set', (status) => {
    expect(countMemberships(status)).toBe(0);
  });
});
