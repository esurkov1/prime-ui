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
    const detach = result.current(node);
    expect(callback).toHaveBeenCalledWith(node);
    expect(object.current).toBe(node);
    if (typeof detach === "function") detach();
    expect(callback).toHaveBeenLastCalledWith(null);
    expect(object.current).toBeNull();
  });

  it("runs the cleanup a callback ref returns instead of calling it with null", () => {
    const cleanup = vi.fn();
    const callback = vi.fn(() => cleanup);
    const { result } = renderHook(() => useMergedRefs<HTMLDivElement>(callback));
    const detach = result.current(document.createElement("div"));
    if (typeof detach === "function") detach();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledTimes(1);
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
