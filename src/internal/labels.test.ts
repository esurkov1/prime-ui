import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useLabels } from "./labels";

type Labels = { empty: string; retry: string };

const DEFAULTS: Labels = { empty: "Нет данных", retry: "Повторить" };

describe("useLabels", () => {
  it("puts defined overrides over the defaults", () => {
    const { result } = renderHook(() =>
      useLabels(DEFAULTS, { retry: "Ещё раз", empty: undefined }),
    );
    expect(result.current).toEqual({ empty: "Нет данных", retry: "Ещё раз" });
  });

  it("returns the defaults themselves without overrides", () => {
    const { result } = renderHook(() => useLabels(DEFAULTS, undefined));
    expect(result.current).toBe(DEFAULTS);
  });

  it("keeps its identity while an inline object keeps its content", () => {
    const { result, rerender } = renderHook(
      ({ labels }: { labels?: Partial<Labels> }) => useLabels(DEFAULTS, labels),
      { initialProps: { labels: { retry: "Ещё раз" } as Partial<Labels> | undefined } },
    );
    const first = result.current;
    expect(first).toEqual({ empty: "Нет данных", retry: "Ещё раз" });
    rerender({ labels: { retry: "Ещё раз" } });
    expect(result.current).toBe(first);
    rerender({ labels: { retry: "Снова" } });
    expect(result.current.retry).toBe("Снова");
    rerender({ labels: undefined });
    expect(result.current).toBe(DEFAULTS);
  });
});
