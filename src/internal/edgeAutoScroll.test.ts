import { describe, expect, it } from "vitest";

import { autoScrollStep, EDGE_ZONE_PX, edgeSpeed, MAX_SPEED_PX_PER_MS } from "./edgeAutoScroll";

function scroller(overflowX: string, overflowY: string) {
  const node = document.createElement("div");
  node.style.overflowX = overflowX;
  node.style.overflowY = overflowY;
  node.getBoundingClientRect = () =>
    ({ left: 0, top: 0, right: 200, bottom: 200, width: 200, height: 200 }) as DOMRect;
  document.body.append(node);
  return node;
}

describe("edgeAutoScroll", () => {
  it("speed grows toward the edge and is zero outside the zone", () => {
    expect(edgeSpeed(EDGE_ZONE_PX + 1)).toBe(0);
    expect(edgeSpeed(0)).toBe(MAX_SPEED_PX_PER_MS);
    expect(edgeSpeed(EDGE_ZONE_PX / 2)).toBeCloseTo(MAX_SPEED_PX_PER_MS / 2);
  });

  it("scrolls toward the edge near the pointer, only along the axes asked for and allowed", () => {
    const node = scroller("auto", "auto");
    expect(autoScrollStep([node], { x: 100, y: 199 }, 16)).toBe(true);
    expect(node.scrollTop).toBeGreaterThan(0);
    node.scrollTop = 0;
    // A list's drag scrolls only up and down.
    autoScrollStep([node], { x: 199, y: 100 }, 16, { x: false, y: true });
    expect(node.scrollLeft).toBe(0);
    // A locked or fitting region (`overflow: hidden`) never moves.
    const locked = scroller("hidden", "hidden");
    expect(autoScrollStep([locked], { x: 199, y: 199 }, 16)).toBe(false);
  });
});
