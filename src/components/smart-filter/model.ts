/**
 * The filter model. An options field has two lists, what to show and what to hide; a range field
 * has its two bounds. Pure functions with no state; the owner keeps the value
 * (`SmartFilter.Root value / onValueChange`).
 */

export type SmartFilterSelection = {
  /** Values to show. Empty means "any". */
  include: string[];
  /** Values to hide. */
  exclude: string[];
};

/** Bounds of a `range` (numbers) or `date-range` (dates) field, both inclusive; `null` — open. */
export type SmartFilterRange<T extends number | Date = number | Date> = {
  from: T | null;
  to: T | null;
};

/** What one field holds: a selection (options field) or bounds (range fields). */
export type SmartFilterFieldValue =
  | SmartFilterSelection
  | SmartFilterRange<number>
  | SmartFilterRange<Date>;

/** Value per field key. Fields without a filter are absent. */
export type SmartFilterValue = Record<string, SmartFilterFieldValue>;

export type SmartFilterMode = "include" | "exclude";

const EMPTY: SmartFilterSelection = { include: [], exclude: [] };

/** Whether a field's value is a range (`from` / `to`) rather than a selection. */
export function isSmartFilterRange(
  entry: SmartFilterFieldValue | undefined,
): entry is SmartFilterRange<number> | SmartFilterRange<Date> {
  return entry !== undefined && "from" in entry;
}

/** The selection of an options field (`undefined` for a range or no filter). */
export function selectionOf(
  entry: SmartFilterFieldValue | undefined,
): SmartFilterSelection | undefined {
  return entry && !isSmartFilterRange(entry) ? entry : undefined;
}

export function selectionModeOf(
  selection: SmartFilterSelection | undefined,
  value: string,
): SmartFilterMode | null {
  if (!selection) return null;
  if (selection.include.includes(value)) return "include";
  if (selection.exclude.includes(value)) return "exclude";
  return null;
}

/** Sets the mode of a value; asking for the mode it already has clears it. A value is never in both lists. */
export function toggleSelectionMode(
  selection: SmartFilterSelection | undefined,
  value: string,
  mode: SmartFilterMode,
): SmartFilterSelection {
  const { include, exclude } = removeSelectionValue(selection, value);
  if (selectionModeOf(selection, value) === mode) return { include, exclude };
  return mode === "include"
    ? { include: [...include, value], exclude }
    : { include, exclude: [...exclude, value] };
}

/** A field with one value: pressing a value selects only it; pressing it again clears it. */
export function toggleSingleValue(
  selection: SmartFilterSelection | undefined,
  value: string,
): SmartFilterSelection {
  return selection?.include.includes(value)
    ? { include: [], exclude: [] }
    : { include: [value], exclude: [] };
}

/** Drops a value from both lists. */
export function removeSelectionValue(
  selection: SmartFilterSelection | undefined,
  value: string,
): SmartFilterSelection {
  const current = selection ?? EMPTY;
  return {
    include: current.include.filter((v) => v !== value),
    exclude: current.exclude.filter((v) => v !== value),
  };
}

/** How many filters a field adds: each selected value, or one for a range with a bound. */
export function entrySize(entry: SmartFilterFieldValue | undefined): number {
  if (!entry) return 0;
  if (isSmartFilterRange(entry)) return entry.from !== null || entry.to !== null ? 1 : 0;
  return entry.include.length + entry.exclude.length;
}

/** Sets one field's value; an empty selection or an open range removes the field from the value. */
export function withFieldValue(
  value: SmartFilterValue,
  key: string,
  entry: SmartFilterFieldValue | undefined,
): SmartFilterValue {
  const { [key]: _removed, ...rest } = value;
  return entrySize(entry) > 0 && entry ? { ...rest, [key]: entry } : rest;
}

/**
 * For a field with a fixed set of values: whether `value` can be hidden without hiding everything.
 * "Everything hidden" is an empty result, so it is not allowed.
 */
export function canExcludeValue(
  selection: SmartFilterSelection | undefined,
  value: string,
  all: readonly string[],
): boolean {
  if (selectionModeOf(selection, value) === "exclude") return true;
  const excluded = new Set(selection?.exclude ?? []);
  excluded.add(value);
  return all.some((v) => !excluded.has(v));
}

const DAY_MS = 24 * 60 * 60 * 1000;
const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/**
 * Whether an item's value passes a field's filter. A selection: `include` empty means any,
 * `exclude` rejects. A range: both bounds inclusive; dates compare by whole days (`to` takes its
 * whole day). An item with no value passes only an empty filter.
 */
export function matchesSmartFilter(
  entry: SmartFilterFieldValue | undefined,
  item: string | number | Date | null | undefined,
): boolean {
  if (!entry || entrySize(entry) === 0) return true;
  if (item === null || item === undefined) return false;
  if (isSmartFilterRange(entry)) {
    if (item instanceof Date) {
      const t = item.getTime();
      if (entry.from instanceof Date && t < startOfDay(entry.from)) return false;
      if (entry.to instanceof Date && t >= startOfDay(entry.to) + DAY_MS) return false;
      return true;
    }
    if (typeof item !== "number") return false;
    if (typeof entry.from === "number" && item < entry.from) return false;
    if (typeof entry.to === "number" && item > entry.to) return false;
    return true;
  }
  const text = String(item);
  if (entry.include.length > 0 && !entry.include.includes(text)) return false;
  return !entry.exclude.includes(text);
}

/**
 * Turns a selection over a fixed set of values into the list to ask a server for: "hide" becomes
 * "all except". An empty array means no filter (also when the selection covers every value, and
 * for a range field).
 */
export function resolveSmartFilterValues(
  entry: SmartFilterFieldValue | undefined,
  all: readonly string[],
): string[] {
  const selection = selectionOf(entry);
  if (!selection || entrySize(selection) === 0) return [];
  const base = selection.include.length
    ? all.filter((v) => selection.include.includes(v))
    : [...all];
  const result = base.filter((v) => !selection.exclude.includes(v));
  return result.length === all.length ? [] : result;
}
