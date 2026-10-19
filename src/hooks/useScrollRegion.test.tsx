import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type ScrollRegion, ScrollRegionContext, useScrollRegion } from "./useScrollRegion";

describe("useScrollRegion", () => {
  function Probe({ into }: { into: { current: ScrollRegion | null | undefined } }) {
    into.current = useScrollRegion();
    return null;
  }

  it("is null outside a scroll region", () => {
    const seen = { current: undefined as ScrollRegion | null | undefined };
    render(<Probe into={seen} />);
    expect(seen.current).toBeNull();
  });

  it("hands content the region around it", () => {
    const region: ScrollRegion = {
      element: () => null,
      atEnd: () => true,
      subscribe: () => () => {},
      scrollToEnd: vi.fn(),
      scrollToElement: vi.fn(),
      scrollToOffset: vi.fn(),
      hold: vi.fn(),
    };
    const seen = { current: undefined as ScrollRegion | null | undefined };
    render(
      <ScrollRegionContext.Provider value={region}>
        <Probe into={seen} />
      </ScrollRegionContext.Provider>,
    );
    expect(seen.current).toBe(region);
    seen.current?.hold("--prime-message-morph-duration");
    expect(region.hold).toHaveBeenCalledWith("--prime-message-morph-duration");
  });
});
