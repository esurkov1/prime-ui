/**
 * Fills a `{token}` label template (`"{current} из {max} символов"`): every `{name}` takes its
 * value from `values`, every occurrence; a missing or `undefined` value becomes empty and the
 * result is trimmed (`"Выбрать строку {label}"` without a label reads "Выбрать строку").
 */
export function formatLabel(
  template: string,
  values: Readonly<Record<string, string | number | undefined>>,
): string {
  return template
    .replace(/\{(\w+)\}/g, (_, name: string) =>
      Object.hasOwn(values, name) ? String(values[name] ?? "") : "",
    )
    .trim();
}
