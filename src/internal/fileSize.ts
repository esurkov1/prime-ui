import { formatNumber } from "@/internal/formatNumber";

const SIZE_UNITS = ["Б", "КБ", "МБ", "ГБ"];

/** Digits after the comma in `unit`: one from a megabyte on. */
const fractionDigits = (unit: number) => (unit >= 2 ? 1 : 0);

/**
 * «820 КБ», «1,2 МБ»: Russian digits, one decimal from a megabyte on. The value is rounded before
 * its unit is final, so a size that rounds up to 1024 moves to the next unit («1 МБ», never
 * «1 024 КБ»).
 */
export function formatFileSize(bytes: number): string {
  let value = Math.max(0, bytes);
  let unit = 0;
  const rounded = () => {
    const scale = 10 ** fractionDigits(unit);
    return Math.round(value * scale) / scale;
  };
  while (rounded() >= 1024 && unit < SIZE_UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${formatNumber(rounded(), fractionDigits(unit))} ${SIZE_UNITS[unit]}`;
}
