import { renderHook } from "@testing-library/react";
import type * as React from "react";
import { describe, expect, it } from "vitest";
import { ControlSizeProvider } from "./ControlSizeContext";
import { useChipTier } from "./chipTier";

const inside =
  (size: "xs" | "l") =>
  ({ children }: { children: React.ReactNode }) => (
    <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
  );

describe("useChipTier", () => {
  it("uses an explicit size as is, inside a host too", () => {
    const { result } = renderHook(() => useChipTier("s"), { wrapper: inside("l") });
    expect(result.current).toEqual({ size: "s", tier: "s" });
  });

  it("follows the host one tier down, never below xs", () => {
    expect(
      renderHook(() => useChipTier(undefined), { wrapper: inside("l") }).result.current,
    ).toEqual({ size: "l", tier: "m" });
    expect(
      renderHook(() => useChipTier(undefined), { wrapper: inside("xs") }).result.current,
    ).toEqual({ size: "xs", tier: "xs" });
  });

  it("is m without a host", () => {
    expect(renderHook(() => useChipTier(undefined)).result.current).toEqual({
      size: "m",
      tier: "m",
    });
  });
});
