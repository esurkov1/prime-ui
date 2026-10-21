import { renderHook } from "@testing-library/react";
import type * as React from "react";
import { describe, expect, it } from "vitest";
import { ControlSizeProvider, useHostTier } from "./ControlSizeContext";
import { useChipTier } from "./chipTier";

const inside =
  (size: "xs" | "l") =>
  ({ children }: { children: React.ReactNode }) => (
    <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
  );

/** A sized host the way a root provides it: a card is a `surface`, a field a `control`. */
function Host({
  size,
  kind,
  children,
}: {
  size: "s" | "m";
  kind: "control" | "surface";
  children: React.ReactNode;
}) {
  return useHostTier(size, kind).provide(children);
}

const hosted =
  (size: "s" | "m", kind: "control" | "surface") =>
  ({ children }: { children: React.ReactNode }) => (
    <Host size={size} kind={kind}>
      {children}
    </Host>
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

  it("takes a surface's tier as is and steps down inside a control on it", () => {
    expect(
      renderHook(() => useChipTier(undefined), { wrapper: hosted("s", "surface") }).result.current,
    ).toEqual({ size: "s", tier: "s" });
    expect(
      renderHook(() => useChipTier(undefined), { wrapper: hosted("s", "control") }).result.current,
    ).toEqual({ size: "s", tier: "xs" });
    const controlOnSurface = ({ children }: { children: React.ReactNode }) => (
      <Host size="m" kind="surface">
        <ControlSizeProvider value="m">{children}</ControlSizeProvider>
      </Host>
    );
    expect(
      renderHook(() => useChipTier(undefined), { wrapper: controlOnSurface }).result.current,
    ).toEqual({ size: "m", tier: "s" });
  });

  it("is m without a host", () => {
    expect(renderHook(() => useChipTier(undefined)).result.current).toEqual({
      size: "m",
      tier: "m",
    });
  });
});
