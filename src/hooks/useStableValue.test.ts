import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useStableValue } from "./useStableValue";

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

  it("compares arrays by items and objects by own keys by default", () => {
    const stable = (first: unknown, next: unknown) => {
      const { result, rerender } = renderHook(({ value }) => useStableValue(value), {
        initialProps: { value: first },
      });
      const kept = result.current;
      rerender({ value: next });
      return result.current === kept;
    };
    expect(stable([1, "a"], [1, "a"])).toBe(true);
    expect(stable([1], [1, 2])).toBe(false);
    expect(stable({ a: 1, b: undefined }, { a: 1, b: undefined })).toBe(true);
    expect(stable({ a: 1, b: undefined }, { a: 1, c: undefined })).toBe(false);
    expect(stable({ a: {} }, { a: {} })).toBe(false);
    expect(stable([1], { 0: 1 })).toBe(false);
    expect(stable(null, {})).toBe(false);
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
