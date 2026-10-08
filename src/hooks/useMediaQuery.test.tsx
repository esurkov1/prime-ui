import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { COMPACT_QUERY, useMediaQuery } from "./useMediaQuery";

const original = window.matchMedia;

/** A controllable media query list: `set(true)` fires its change listeners. */
function stubMatchMedia(initial: boolean) {
  let matches = initial;
  const listeners = new Set<() => void>();
  window.matchMedia = (query: string) =>
    ({
      get matches() {
        return matches;
      },
      media: query,
      addEventListener: (_: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
    }) as unknown as MediaQueryList;
  return (next: boolean) => {
    matches = next;
    for (const listener of listeners) listener();
  };
}

describe("useMediaQuery", () => {
  afterEach(() => {
    window.matchMedia = original;
  });

  it("follows the query as the viewport changes", () => {
    const set = stubMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery(COMPACT_QUERY));
    expect(result.current).toBe(false);
    act(() => set(true));
    expect(result.current).toBe(true);
  });

  it("stays false while disabled", () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery(COMPACT_QUERY, false));
    expect(result.current).toBe(false);
  });
});
