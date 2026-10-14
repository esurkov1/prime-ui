import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { shallowEqual, useStableValue } from "./useStableValue";

describe("shallowEqual", () => {
  it("compares arrays by items and objects by own keys", () => {
    expect(shallowEqual([1, "a"], [1, "a"])).toBe(true);
    expect(shallowEqual([1], [1, 2])).toBe(false);
    expect(shallowEqual({ a: 1, b: undefined }, { a: 1, b: undefined })).toBe(true);
    expect(shallowEqual({ a: 1, b: undefined }, { a: 1, c: undefined })).toBe(false);
    expect(shallowEqual({ a: {} }, { a: {} })).toBe(false);
    expect(shallowEqual([1], { 0: 1 })).toBe(false);
    expect(shallowEqual(null, {})).toBe(false);
  });
});

describe("useStableValue", () => {
  it("keeps the reference while the content is equal", () => {
    const { result, rerender } = renderHook(({ value }) => useStableValue(value), {
      initialProps: { value: ["a", "b"] },
    });
    const first = result.current;
    rerender({ value: ["a", "b"] });
    expect(result.current).toBe(first);
    rerender({ value: ["a", "c"] });
    expect(result.current).toEqual(["a", "c"]);
    expect(result.current).not.toBe(first);
  });

  it("takes an own equality", () => {
    type Row = { key: string; text: string };
    const byKey = (a: Row[], b: Row[]) =>
      a.length === b.length && a.every((row, index) => row.key === b[index]?.key);
    const { result, rerender } = renderHook(({ rows }) => useStableValue(rows, byKey), {
      initialProps: { rows: [{ key: "1", text: "Счёт" }] },
    });
    const first = result.current;
    rerender({ rows: [{ key: "1", text: "Счёт 2" }] });
    expect(result.current).toBe(first);
  });
});
