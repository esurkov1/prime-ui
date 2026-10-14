import { render, renderHook, screen } from "@testing-library/react";
import type * as React from "react";
import { describe, expect, it } from "vitest";

import {
  nextSurfaceDepth,
  type SurfaceDepth,
  SurfaceDepthProvider,
  useNestedSurfaceDepth,
  useSurfaceDepth,
} from "./surfaceDepth";

function Surface({ children }: { children?: React.ReactNode }) {
  const depth = useNestedSurfaceDepth();
  return (
    <section data-depth={depth} aria-label={`Слой ${depth}`}>
      <SurfaceDepthProvider value={depth}>{children}</SurfaceDepthProvider>
    </section>
  );
}

describe("surface depth", () => {
  it("steps one layer up the ladder per nested surface and stops at 4", () => {
    render(
      <Surface>
        <Surface>
          <Surface>
            <Surface>
              <Surface />
            </Surface>
          </Surface>
        </Surface>
      </Surface>,
    );
    const depths = screen.getAllByRole("region").map((node) => node.dataset.depth);
    expect(depths).toEqual(["1", "2", "3", "4", "4"]);
  });

  it("nests floating layers up to floating-2; a card on a tinted host is a card on the page", () => {
    const steps: SurfaceDepth[] = ["floating", "floating-1", "floating-2", "tinted"];
    expect(steps.map(nextSurfaceDepth)).toEqual(["floating-1", "floating-2", "floating-2", 1]);
  });

  it("reads the page outside any surface and the host's depth inside one", () => {
    expect(renderHook(() => useSurfaceDepth()).result.current).toBe(0);
    const { result } = renderHook(() => [useSurfaceDepth(), useNestedSurfaceDepth()], {
      wrapper: ({ children }) => (
        <SurfaceDepthProvider value="floating">{children}</SurfaceDepthProvider>
      ),
    });
    expect(result.current).toEqual(["floating", "floating-1"]);
  });
});
