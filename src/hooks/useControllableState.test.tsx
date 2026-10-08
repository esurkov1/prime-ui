import { act, renderHook } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { useControllableState } from "./useControllableState";
import { useMergedRefs } from "./useMergedRefs";

describe("useControllableState", () => {
  it("two functional updates in one handler chain on each other (uncontrolled)", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultValue: 0, onChange }));
    act(() => {
      result.current[1]((n) => n + 1);
      result.current[1]((n) => n + 1);
    });
    expect(result.current[0]).toBe(2);
    expect(onChange.mock.calls).toEqual([[1], [2]]);
  });

  it("two functional updates in one handler chain on each other (controlled)", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ value: 0, defaultValue: 0, onChange }),
    );
    act(() => {
      result.current[1]((n) => n + 1);
      result.current[1]((n) => n + 1);
    });
    expect(onChange.mock.calls).toEqual([[1], [2]]);
  });
});

describe("useMergedRefs", () => {
  it("keeps one callback while the refs stay the same, so the node is not re-attached", () => {
    const callback = vi.fn();
    const object = React.createRef<HTMLDivElement>();
    const { result, rerender } = renderHook(() => useMergedRefs(callback, object));
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);

    const node = document.createElement("div");
    act(() => first(node));
    expect(callback).toHaveBeenCalledWith(node);
    expect(object.current).toBe(node);
  });
});
