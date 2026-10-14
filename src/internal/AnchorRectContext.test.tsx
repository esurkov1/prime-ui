import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  AnchorRectProvider,
  type AnchorRectResolver,
  FloatingBoundaryProvider,
  type FloatingBoundaryResolver,
  useAnchorRectResolver,
  useFloatingBoundaryResolver,
} from "./AnchorRectContext";

describe("anchor rect and boundary contexts", () => {
  it("have no resolver outside a layout that provides one", () => {
    expect(renderHook(() => useAnchorRectResolver()).result.current).toBeNull();
    expect(renderHook(() => useFloatingBoundaryResolver()).result.current).toBeNull();
  });

  it("give the nearest layout's resolvers", () => {
    const rail: AnchorRectResolver = (_anchor, rect) => ({
      ...rect,
      width: 40,
      right: rect.left + 40,
    });
    const region: FloatingBoundaryResolver = () => ({ top: 48, left: 0, right: 800, bottom: 600 });
    const { result } = renderHook(
      () => ({ anchor: useAnchorRectResolver(), boundary: useFloatingBoundaryResolver() }),
      {
        wrapper: ({ children }) => (
          <AnchorRectProvider value={rail}>
            <FloatingBoundaryProvider value={region}>{children}</FloatingBoundaryProvider>
          </AnchorRectProvider>
        ),
      },
    );
    expect(result.current.anchor).toBe(rail);
    expect(result.current.boundary).toBe(region);
  });
});
