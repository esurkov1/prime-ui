import {
  createEdgeAutoScroll,
  EDGE_ZONE_PX,
  edgeScrollers,
  edgeSpeed,
  MAX_SPEED_PX_PER_MS,
} from "./edgeAutoScroll";

function scroller(overflowX: string, overflowY: string, direction = "ltr", width = 200) {
  const node = document.createElement("div");
  node.style.overflowX = overflowX;
  node.style.overflowY = overflowY;
  node.style.direction = direction;
  node.getBoundingClientRect = () =>
    ({ left: 0, top: 0, right: width, bottom: 200, width, height: 200 }) as DOMRect;
  // jsdom has no layout: a scroll position is whatever was set, in any direction.
  let left = 0;
  Object.defineProperty(node, "scrollLeft", {
    configurable: true,
    get: () => left,
    set: (value: number) => {
      left = value;
    },
  });
  document.body.append(node);
  return node;
}

/** Runs `frames` animation frames, 16 ms apart. */
function frames(count: number) {
  for (let index = 0; index < count; index += 1) vi.advanceTimersByTime(16);
}

describe("edgeAutoScroll", () => {
  beforeEach(() => vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame"] }));
  afterEach(() => {
    vi.useRealTimers();
    document.body.replaceChildren();
  });

  it("speed grows toward the edge and is zero outside the zone", () => {
    expect(edgeSpeed(EDGE_ZONE_PX + 1)).toBe(0);
    expect(edgeSpeed(0)).toBe(MAX_SPEED_PX_PER_MS);
    expect(edgeSpeed(EDGE_ZONE_PX / 2)).toBeCloseTo(MAX_SPEED_PX_PER_MS / 2);
  });

  it("scrolls toward the edge near the pointer and reports each step", () => {
    const node = scroller("auto", "auto");
    const onScrolled = vi.fn();
    const auto = createEdgeAutoScroll({ scrollers: [node], onScrolled });
    auto.follow({ x: 100, y: 199 });
    frames(3);
    expect(node.scrollTop).toBeGreaterThan(0);
    expect(onScrolled).toHaveBeenCalled();
    auto.stop();
    const after = node.scrollTop;
    frames(3);
    expect(node.scrollTop).toBe(after);
  });

  it("scrolls only along the axes asked for and allowed; a locked region never moves", () => {
    const node = scroller("auto", "auto");
    const list = createEdgeAutoScroll({
      scrollers: [node],
      axes: { x: false, y: true },
      onScrolled: () => {},
    });
    list.follow({ x: 199, y: 100 });
    frames(3);
    expect(node.scrollLeft).toBe(0);
    list.stop();

    const column = scroller("hidden", "auto");
    const sideways = createEdgeAutoScroll({ scrollers: [column], onScrolled: () => {} });
    // Near the right edge of a column that scrolls only up and down: nothing moves.
    sideways.follow({ x: 198, y: 100 });
    frames(3);
    expect(column.scrollLeft).toBe(0);
    sideways.follow({ x: 100, y: 198 });
    frames(3);
    expect(column.scrollTop).toBeGreaterThan(0);
    sideways.stop();

    const locked = scroller("hidden", "hidden");
    const onScrolled = vi.fn();
    const still = createEdgeAutoScroll({ scrollers: [locked], onScrolled });
    still.follow({ x: 199, y: 199 });
    frames(3);
    expect(onScrolled).not.toHaveBeenCalled();
    still.stop();
  });

  it("starts the zone at an inset: the end of a pinned column, mirrored in right-to-left", () => {
    const ltr = scroller("auto", "hidden", "ltr", 400);
    const pinned = createEdgeAutoScroll({
      scrollers: [ltr],
      insets: () => ({ inlineStart: 100 }),
      onScrolled: () => {},
    });
    ltr.scrollLeft = 50;
    // Over the pinned column, far from its end: no move; at its end: back toward the start.
    pinned.follow({ x: 100 + EDGE_ZONE_PX + 1, y: 100 });
    frames(2);
    expect(ltr.scrollLeft).toBe(50);
    pinned.follow({ x: 101, y: 100 });
    frames(2);
    expect(ltr.scrollLeft).toBeLessThan(50);
    pinned.stop();

    const rtl = scroller("auto", "hidden", "rtl", 400);
    const mirrored = createEdgeAutoScroll({
      scrollers: [rtl],
      insets: () => ({ inlineStart: 100 }),
      onScrolled: () => {},
    });
    rtl.scrollLeft = -50;
    // The pinned column stands on the right: its end is 100 px in from the right edge.
    mirrored.follow({ x: 299, y: 100 });
    frames(2);
    expect(rtl.scrollLeft).toBeGreaterThan(-50);
    mirrored.stop();
  });

  it("finds the boxes a gesture may scroll, innermost first", () => {
    const outer = scroller("hidden", "auto");
    const inner = scroller("auto", "hidden");
    outer.append(inner);
    const leaf = document.createElement("span");
    inner.append(leaf);
    expect(edgeScrollers(leaf).slice(0, 2)).toEqual([inner, outer]);
  });
});
