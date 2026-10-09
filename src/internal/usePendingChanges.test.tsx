import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { isPromiseLike, usePendingChanges } from "./usePendingChanges";

const add = (value: readonly string[], item: string) =>
  value.includes(item) ? value : [...value, item];

function deferred() {
  let resolve: () => void = () => {};
  let reject: (reason: unknown) => void = () => {};
  const promise = new Promise<void>((done, fail) => {
    resolve = done;
    reject = fail;
  });
  return { promise, resolve, reject };
}

describe("usePendingChanges", () => {
  it("draws pending changes over the value in order and drops each as it settles", async () => {
    const first = deferred();
    const second = deferred();
    const onResolve = vi.fn();
    const onReject = vi.fn();
    const { result } = renderHook(() => usePendingChanges<readonly string[], string>(["a"], add));
    act(() => {
      result.current.track("b", first.promise, { onResolve });
      result.current.track("c", second.promise, { onReject });
    });
    expect(result.current.shown).toEqual(["a", "b", "c"]);
    expect(result.current.pending).toEqual(["b", "c"]);

    await act(async () => {
      second.reject(new Error("refused"));
    });
    expect(result.current.shown).toEqual(["a", "b"]);
    expect(onReject).toHaveBeenCalledWith(new Error("refused"));

    await act(async () => {
      first.resolve();
    });
    expect(onResolve).toHaveBeenCalledTimes(1);
    expect(result.current.pending).toEqual([]);
    expect(result.current.shown).toEqual(["a"]);
  });

  it("tells a promise from a plain answer", () => {
    expect(isPromiseLike(Promise.resolve())).toBe(true);
    expect(isPromiseLike(undefined)).toBe(false);
    expect(isPromiseLike({ ok: false })).toBe(false);
  });
});
