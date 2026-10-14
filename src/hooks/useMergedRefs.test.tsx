import { renderHook } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { useMergedRefs } from "./useMergedRefs";

describe("useMergedRefs", () => {
  it("writes to callback and object refs", () => {
    const callback = vi.fn();
    const object = React.createRef<HTMLDivElement>();
    const { result } = renderHook(() => useMergedRefs<HTMLDivElement>(callback, object));
    const node = document.createElement("div");
    result.current(node);
    expect(callback).toHaveBeenCalledWith(node);
    expect(object.current).toBe(node);
    result.current(null);
    expect(object.current).toBeNull();
  });

  it("a node that leaves after its successor arrived keeps the successor in an object ref", () => {
    const callback = vi.fn();
    const object = React.createRef<HTMLDivElement>();
    const { result } = renderHook(() => useMergedRefs<HTMLDivElement>(callback, object));
    const leaving = document.createElement("div");
    const arriving = document.createElement("div");
    const releaseLeaving = result.current(leaving);
    const releaseArriving = result.current(arriving);
    if (typeof releaseLeaving !== "function" || typeof releaseArriving !== "function") {
      throw new Error("expected cleanups");
    }
    releaseLeaving();
    expect(object.current).toBe(arriving);
    expect(callback).toHaveBeenLastCalledWith(null);
    releaseArriving();
    expect(object.current).toBeNull();
  });

  it("keeps its identity until a ref changes", () => {
    const a = vi.fn();
    const b = vi.fn();
    const { result, rerender } = renderHook(({ second }) => useMergedRefs(a, second), {
      initialProps: { second: b },
    });
    const first = result.current;
    rerender({ second: b });
    expect(result.current).toBe(first);
    rerender({ second: vi.fn() });
    expect(result.current).not.toBe(first);
  });
});
