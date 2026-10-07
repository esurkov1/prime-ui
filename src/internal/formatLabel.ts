/**
 * Fills a `{token}` label template (`"{current} из {max} символов"`): every `{name}` with a value
 * in `values` is replaced, every occurrence; unknown tokens stay as written.
 */
export function formatLabel(
  template: string,
  values: Readonly<Record<string, string | number>>,
): string {
  return template.replace(/\{(\w+)\}/g, (token, name: string) =>
    Object.hasOwn(values, name) ? String(values[name]) : token,
  );
}
