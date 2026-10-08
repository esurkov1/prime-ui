/**
 * The filter model: every field has two lists, what to show and what to hide. Pure functions with
 * no state; the owner keeps the value (`SmartFilter.Root value / onValueChange`).
 */

export type SmartFilterSelection = {
  /** Values to show. Empty means "any". */
  include: string[];
  /** Values to hide. */
  exclude: string[];
};

/** Selection per field key. Fields without a selection are absent. */
export type SmartFilterValue = Record<string, SmartFilterSelection>;

export type SmartFilterMode = "include" | "exclude";

const EMPTY: SmartFilterSelection = { include: [], exclude: [] };

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

export function selectionSize(selection: SmartFilterSelection | undefined): number {
  return selection ? selection.include.length + selection.exclude.length : 0;
}

/** Sets one field's selection; an empty selection removes the field from the value. */
export function withSelection(
  value: SmartFilterValue,
  key: string,
  selection: SmartFilterSelection,
): SmartFilterValue {
  const { [key]: _removed, ...rest } = value;
  return selectionSize(selection) > 0 ? { ...rest, [key]: selection } : rest;
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

/** Whether a value passes a selection: `include` empty means any, `exclude` rejects. */
export function matchesSmartFilter(
  selection: SmartFilterSelection | undefined,
  value: string,
): boolean {
  if (!selection) return true;
  if (selection.include.length > 0 && !selection.include.includes(value)) return false;
  return !selection.exclude.includes(value);
}

/**
 * Turns a selection over a fixed set of values into the list to ask a server for: "hide" becomes
 * "all except". An empty array means no filter (also when the selection covers every value).
 */
export function resolveSmartFilterValues(
  selection: SmartFilterSelection | undefined,
  all: readonly string[],
): string[] {
  if (!selection || selectionSize(selection) === 0) return [];
  const base = selection.include.length
    ? all.filter((v) => selection.include.includes(v))
    : [...all];
  const result = base.filter((v) => !selection.exclude.includes(v));
  return result.length === all.length ? [] : result;
}
