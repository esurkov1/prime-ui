import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  isPromiseLike,
  usePendingAction,
  usePendingChanges,
  usePendingKeys,
  usePendingValue,
} from "./usePendingChanges";

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

describe("usePendingKeys", () => {
  it("holds a key while its promise is pending and returns the outcome", async () => {
    const save = deferred();
    const { result } = renderHook(() => usePendingKeys<string>());
    let outcome: unknown;
    act(() => {
      outcome = result.current.track("row-1", save.promise);
    });
    expect(outcome).toBe(save.promise);
    expect(result.current.pending.has("row-1")).toBe(true);
    await act(async () => {
      save.resolve();
      await save.promise;
    });
    expect(result.current.pending.size).toBe(0);
  });

  it("drops the key on a rejection and holds nothing for a sync outcome", async () => {
    const save = deferred();
    const { result } = renderHook(() => usePendingKeys<string>());
    act(() => {
      result.current.track("row-1", undefined);
      result.current.track("row-2", save.promise);
    });
    expect([...result.current.pending]).toEqual(["row-2"]);
    await act(async () => {
      save.reject(new Error("Нет связи"));
      await save.promise.catch(() => {});
    });
    expect(result.current.pending.size).toBe(0);
  });
});

describe("usePendingAction", () => {
  it("runs once at a time and is pending until the promise settles", async () => {
    const load = deferred();
    const handler = vi.fn(() => load.promise);
    const { result } = renderHook(() => usePendingAction(handler));
    act(() => {
      result.current.run?.();
      result.current.run?.();
    });
    expect(handler).toHaveBeenCalledTimes(1);
    expect(result.current.pending).toBe(true);
    await act(async () => {
      load.reject(new Error("Нет связи"));
      await load.promise.catch(() => {});
    });
    expect(result.current.pending).toBe(false);
    act(() => result.current.run?.());
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it("has no run without a handler and never pends for a sync one", () => {
    const { result, rerender } = renderHook(
      ({ handler }: { handler?: () => void }) => usePendingAction(handler),
      { initialProps: {} },
    );
    expect(result.current.run).toBeUndefined();
    const sync = vi.fn();
    rerender({ handler: sync });
    act(() => result.current.run?.());
    expect(sync).toHaveBeenCalledTimes(1);
    expect(result.current.pending).toBe(false);
  });
});

describe("usePendingValue", () => {
  it("stores a plain answer at once", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => usePendingValue({ defaultValue: "a", onChange }));
    act(() => result.current.commit("b"));
    expect(onChange).toHaveBeenCalledWith("b");
    expect(result.current.value).toBe("b");
    expect(result.current.saving).toBe(false);
  });

  it("shows a pending change, keeps it on resolve and rolls it back on reject", async () => {
    const accept = deferred();
    const refuse = deferred();
    const onReject = vi.fn();
    const answers = [accept.promise, refuse.promise];
    const { result } = renderHook(() =>
      usePendingValue({ defaultValue: "a", onChange: () => answers.shift() }),
    );

    act(() => result.current.commit("b"));
    expect(result.current.value).toBe("b");
    expect(result.current.saving).toBe(true);
    await act(async () => {
      accept.resolve();
      await accept.promise;
    });
    expect(result.current.value).toBe("b");
    expect(result.current.saving).toBe(false);

    act(() => result.current.commit("c", { onReject }));
    expect(result.current.value).toBe("c");
    await act(async () => {
      refuse.reject(new Error("Нет прав"));
      await refuse.promise.catch(() => {});
    });
    expect(result.current.value).toBe("b");
    expect(result.current.saving).toBe(false);
    expect(onReject).toHaveBeenCalledWith(new Error("Нет прав"));
  });
});
