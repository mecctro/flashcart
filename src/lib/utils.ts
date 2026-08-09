/**
 * Shared utility functions for FlashCart.
 * Money formatting, price helpers, debounce, etc.
 */

/**
 * Formats a cent-based integer price into a localized currency string.
 *
 * @example formatPrice(1999, 'USD') → "$19.99"
 * @example formatPrice(4999, 'EUR') → "€49.99"
 */
export function formatPrice(
  cents: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

/**
 * Converts a dollar amount (float) to cents (integer) — use before
 * storing in the database or sending to Stripe.
 *
 * @example toCents(19.99) → 1999
 */
export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Converts cents back to a dollar float — for display-only use.
 *
 * @example toDollars(1999) → 19.99
 */
export function toDollars(cents: number): number {
  return Math.round(cents) / 100;
}

/**
 * Calculates the discount percentage from original and sale prices.
 *
 * @example calculateDiscountPercent(10000, 7500) → 25
 */
export function calculateDiscountPercent(
  originalPrice: number,
  salePrice: number
): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

/**
 * Calculates a simple tax amount for a given subtotal and rate.
 *
 * @example calculateTax(10000, 0.08) → 800 (8% of $100.00)
 */
export function calculateTax(subtotal: number, taxRate: number): number {
  return Math.round(subtotal * taxRate);
}

/**
 * Returns the Stripe publishable key from env, or an empty string.
 * Throws in development if missing — catches misconfiguration early.
 */
export function getStripePublishableKey(): string {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!key) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. ' +
          'Copy .env.example to .env.local and add your Stripe key.'
      );
    }
    return '';
  }

  return key;
}

/**
 * Returns the PayPal client ID from env.
 */
export function getPayPalClientId(): string {
  return process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '';
}

/**
 * Debounce — returns a function that delays invoking `fn` until `wait` ms
 * have elapsed since the last call. Useful for search-as-you-type.
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), wait);
  };
}

/**
 * Clamps a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generates a URL-friendly slug from a string.
 *
 * @example slugify('Red Leather Jacket!') → "red-leather-jacket"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncates a string to a maximum length, appending "…" if truncated.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1).trimEnd() + '…';
}

/**
 * Deep-merges two objects (shallow on circular references, typed).
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const output = { ...target } as Record<string, unknown>;

  for (const key of Object.keys(source)) {
    const targetVal = output[key];
    const sourceVal = source[key];

    if (
      typeof targetVal === 'object' &&
      targetVal !== null &&
      !Array.isArray(targetVal) &&
      typeof sourceVal === 'object' &&
      sourceVal !== null &&
      !Array.isArray(sourceVal)
    ) {
      output[key] = deepMerge(
        targetVal as Record<string, unknown>,
        sourceVal as Record<string, unknown>
      );
    } else if (sourceVal !== undefined) {
      output[key] = sourceVal;
    }
  }

  return output as T;
}

/**
 * Returns true if the object is empty (no own keys).
 */
export function isEmpty(obj: unknown): boolean {
  if (!obj || typeof obj !== 'object') return true;
  return Object.keys(obj as Record<string, unknown>).length === 0;
}

/**
 * Class name utility — similar to clsx, but dependency-free.
 */
export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
