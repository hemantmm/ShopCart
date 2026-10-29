import { ProductVariant } from '../types/product';

/**
 * Returns default selected variants for a product (the first in-stock option of each variant type).
 */
export function getDefaultVariants(product: {
  variants?: ProductVariant[];
}): Record<string, string> {
  const result: Record<string, string> = {};
  if (!product.variants || product.variants.length === 0) {
    return result;
  }

  for (const variant of product.variants) {
    if (variant.options.length > 0) {
      const inStockOption = variant.options.find((opt) => opt.inStock);
      result[variant.type] = (inStockOption || variant.options[0]).value;
    }
  }

  return result;
}

/**
 * Computes the unit price of a product including any priceDelta adjustments from selected variants.
 */
export function getProductPrice(
  product: { price: number; variants?: ProductVariant[] },
  selectedVariants?: Record<string, string>
): number {
  let finalPrice = product.price;
  if (!selectedVariants || !product.variants) return finalPrice;

  for (const variant of product.variants) {
    const selectedValue = selectedVariants[variant.type];
    if (selectedValue) {
      const match = variant.options.find((opt) => opt.value === selectedValue);
      if (match?.priceDelta) {
        finalPrice += match.priceDelta;
      }
    }
  }

  return Math.max(0, finalPrice);
}

/**
 * Checks whether two sets of selected variants are identical.
 */
export function areVariantsEqual(
  a?: Record<string, string>,
  b?: Record<string, string>
): boolean {
  if (!a && !b) return true;
  if (!a || !b) {
    const nonNull = a || b;
    return Object.keys(nonNull || {}).length === 0;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) => a[key] === b[key]);
}

/**
 * Checks whether any of the currently selected variants is marked as out of stock.
 */
export function isAnyVariantOutOfStock(
  variants?: ProductVariant[],
  selectedVariants?: Record<string, string>
): boolean {
  if (!variants || !selectedVariants) return false;

  for (const variant of variants) {
    const selectedVal = selectedVariants[variant.type];
    if (selectedVal) {
      const opt = variant.options.find((o) => o.value === selectedVal);
      if (opt && !opt.inStock) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Formats variant key-value pairs into a clean readable string (e.g. "Size: US 9 • Color: Chicago Red").
 */
export function formatVariantsSummary(
  selectedVariants?: Record<string, string>
): string {
  if (!selectedVariants) return '';
  const entries = Object.entries(selectedVariants).filter(([, val]) => Boolean(val));
  if (entries.length === 0) return '';

  return entries
    .map(([type, val]) => {
      const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
      return `${formattedType}: ${val}`;
    })
    .join(' • ');
}

/**
 * Maps common product color names to a CSS visual swatch background.
 */
export function getColorSwatch(colorName: string): { bg: string; border?: string } {
  const normalized = colorName.trim().toLowerCase();

  switch (normalized) {
    case 'chicago red':
    case 'solar red':
      return { bg: '#dc2626' };
    case 'product red':
      return { bg: '#e11d48' };
    case 'shadow grey':
    case 'carbon grey':
      return { bg: '#475569' };
    case 'royal blue':
      return { bg: '#2563eb' };
    case 'university blue':
      return { bg: '#38bdf8' };
    case 'core black':
    case 'carbon black':
    case 'black titanium':
      return { bg: '#18181b', border: '1px solid #3f3f46' };
    case 'cloud white':
    case 'white titanium':
    case 'triple white':
      return { bg: '#f8fafc', border: '1px solid #cbd5e1' };
    case 'natural titanium':
      return { bg: '#c4beba' };
    case 'blue titanium':
      return { bg: '#334155' };
    case 'bred retro':
      return { bg: 'linear-gradient(135deg, #18181b 50%, #dc2626 50%)' };
    case 'panda white/black':
      return { bg: 'linear-gradient(135deg, #ffffff 50%, #18181b 50%)', border: '1px solid #cbd5e1' };
    case 'signal green':
      return { bg: '#22c55e' };
    case 'midnight':
      return { bg: '#0f172a' };
    case 'starlight':
      return { bg: '#f8f4eb', border: '1px solid #e2e8f0' };
    case 'deep purple':
      return { bg: '#581c87' };
    case 'space gray':
      return { bg: '#4b5563' };
    case 'silver':
    case 'platinum silver':
      return { bg: '#cbd5e1', border: '1px solid #94a3b8' };
    default:
      return { bg: '#6366f1' };
  }
}
