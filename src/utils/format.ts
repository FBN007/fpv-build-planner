/** Parse user number input. Accepts "15,5" as well as "15.5". Empty or invalid → null. */
export function parseNumber(text: string): number | null {
  const cleaned = text.trim().replace(',', '.');
  if (cleaned === '') return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/** Split a weight into a readout value and unit: 612 → "612" g, 1240 → "1.24" kg. */
export function weightParts(grams: number): { value: string; unit: string } {
  if (!Number.isFinite(grams) || grams <= 0) return { value: '0', unit: 'g' };
  if (grams < 1000) return { value: String(Math.round(grams)), unit: 'g' };
  return { value: (grams / 1000).toFixed(2), unit: 'kg' };
}

export function formatWeight(grams: number): string {
  const { value, unit } = weightParts(grams);
  return `${value} ${unit}`;
}

const formatters = new Map<string, Intl.NumberFormat>();

export function formatCost(amount: number, currency: string): string {
  const value = Number.isFinite(amount) ? amount : 0;
  const decimals = Number.isInteger(value) ? 0 : 2;
  const key = `${currency}:${decimals}`;
  try {
    let fmt = formatters.get(key);
    if (!fmt) {
      fmt = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      formatters.set(key, fmt);
    }
    return fmt.format(value);
  } catch {
    return `${value.toFixed(decimals)} ${currency}`;
  }
}

/** "just now", "12 min ago", "3 h ago", "yesterday", "5 days ago", then a date. */
export function formatRelative(iso: string, now = new Date()): string {
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  if (!Number.isFinite(diffMs)) return '';
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'yesterday';
  if (d < 7) return `${d} days ago`;
  try {
    return then.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return then.toISOString().slice(0, 10);
  }
}
