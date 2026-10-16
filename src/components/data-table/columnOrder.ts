import { moveBefore } from "@/components/dnd/Dnd";

const idOf = (id: string) => id;

/**
 * `columns` in the order of `order`. An id `order` does not list (a column added to the code later)
 * stands right after the column that precedes it in `columns`, so a saved order never hides it;
 * ids of columns that are gone are skipped.
 */
export function orderColumns<C extends { id: string }>(
  columns: readonly C[],
  order: readonly string[],
): C[] {
  if (order.length === 0) return [...columns];
  const byId = new Map(columns.map((column) => [column.id, column]));
  const result = order.flatMap((id) => {
    const column = byId.get(id);
    return column ? [column] : [];
  });
  const placed = new Set(result.map((column) => column.id));
  columns.forEach((column, index) => {
    if (placed.has(column.id)) return;
    const previous = columns[index - 1];
    const at = previous ? result.findIndex((each) => each.id === previous.id) + 1 : 0;
    result.splice(at, 0, column);
    placed.add(column.id);
  });
  return result;
}

/**
 * The order of every column (hidden ones too) once the visible column `id` stands in front of the
 * visible column `before` — or right after the last visible one when `before` is null, so a hidden
 * column after it keeps its slot; `null` when that would shift a column that holds its place.
 */
export function placeColumn(
  order: readonly string[],
  visible: readonly string[],
  id: string,
  before: string | null,
  locked: ReadonlySet<string>,
): string[] | null {
  let anchor = before;
  if (anchor === null) {
    const last = visible.filter((each) => each !== id).at(-1);
    const rest = order.filter((each) => each !== id);
    anchor = last === undefined ? null : (rest[rest.indexOf(last) + 1] ?? null);
  }
  const next = moveBefore(order, id, anchor, idOf);
  for (const each of locked) if (order.indexOf(each) !== next.indexOf(each)) return null;
  return next;
}
