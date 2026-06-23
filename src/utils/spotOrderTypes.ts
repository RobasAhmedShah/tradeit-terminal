export function normalizeSpotOrderType(value: unknown): string {
  return String(value ?? 'Market').trim();
}

/** Limit and stop-limit orders stay open until the exchange fills them. */
export function isPendingSpotOrderType(value: unknown): boolean {
  const type = normalizeSpotOrderType(value).toLowerCase();
  return type === 'limit' || type === 'stop limit';
}
