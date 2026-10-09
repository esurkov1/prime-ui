/**
 * How the rows on screen changed (`source="server"`): `same` — the same rows (maybe a new array);
 * `append` — the previous rows stay first and more follow (infinite scroll); `replace` — another
 * page, sort or filter result took their place. Rows are compared by id (`getRowKey`), else by
 * identity. A first fill from no rows is no replacement: the body state swap covers it.
 */
export type RowsChange = "same" | "append" | "replace";

export function rowsChange<T>(previous: readonly T[], next: readonly T[]): RowsChange {
  if (previous.length === 0 || next.length === 0) return "same";
  if (next.length < previous.length) return "replace";
  for (let i = 0; i < previous.length; i += 1) {
    if (!Object.is(previous[i], next[i])) return "replace";
  }
  return next.length === previous.length ? "same" : "append";
}
