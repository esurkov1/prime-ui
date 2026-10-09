const SIZE_UNITS = ["Б", "КБ", "МБ", "ГБ"];

/** «820 КБ», «1,2 МБ»: Russian digits, one decimal from a megabyte on. */
export function formatFileSize(bytes: number): string {
  let value = Math.max(0, bytes);
  let unit = 0;
  while (value >= 1024 && unit < SIZE_UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const digits = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: unit >= 2 ? 1 : 0 });
  return `${digits.format(value)} ${SIZE_UNITS[unit]}`;
}
