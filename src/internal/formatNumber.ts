const formatters = new Map<number | undefined, Intl.NumberFormat>();

/**
 * The kit's default display of a number: Russian digit groups and a decimal comma (`12 480`,
 * `0,5`). `maximumFractionDigits` caps the decimals (a share: `1` → `12,5`); without it the
 * locale default (up to 3) applies.
 */
export function formatNumber(value: number, maximumFractionDigits?: number): string {
  let format = formatters.get(maximumFractionDigits);
  if (!format) {
    format = new Intl.NumberFormat("ru-RU", { maximumFractionDigits });
    formatters.set(maximumFractionDigits, format);
  }
  return format.format(value);
}
