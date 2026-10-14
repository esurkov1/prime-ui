import * as React from "react";

/**
 * Shallow equality: the same value, or two arrays / plain objects whose items or own keys are the
 * same values (`Object.is`).
 */
export function shallowEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((item, index) => Object.is(item, b[index]));
  }
  const left = Object.entries(a);
  if (left.length !== Object.keys(b).length) return false;
  return left.every(
    ([key, value]) =>
      Object.hasOwn(b, key) && Object.is(value, (b as Record<string, unknown>)[key]),
  );
}

/**
 * The value, kept as the same reference while it stays equal to the last one: an inline object or
 * array of the owner (new on every render) becomes a dependency that changes only with its content.
 * `isEqual` defaults to `shallowEqual`; pass one that compares what matters (rows by key).
 */
export function useStableValue<T>(
  value: T,
  isEqual: (previous: T, next: T) => boolean = shallowEqual,
): T {
  const ref = React.useRef(value);
  if (!isEqual(ref.current, value)) ref.current = value;
  return ref.current;
}
