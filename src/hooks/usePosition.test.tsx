import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { AnchorRectProvider, type AnchorRectResolver } from "@/internal/AnchorRectContext";

import { computeFloatingPosition } from "./floatingPosition";
import { type AnchorPoint, type PositionSide, usePosition } from "./usePosition";

const OFFSET = 8;
const PAD = 8;
const MIN_MAX_HEIGHT = 120;

function rect(partial: Record<string, number>): DOMRectReadOnly {
  const base = { x: 0, y: 0, width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0 };
  return { ...base, ...partial, toJSON: () => ({}) } as DOMRectReadOnly;
}

const place = (anchor: DOMRectReadOnly, side: PositionSide, vh: number) =>
  computeFloatingPosition(anchor, 200, 0, 1024, vh, {
    side,
    align: "start",
    offset: OFFSET,
    viewportPad: PAD,
    flip: false,
    matchAnchorWidth: false,
  });

describe("anchored panel max height", () => {
  it("on the bottom side, caps by the room below the anchor (gap + pad)", () => {
    const anchor = rect({ top: 40, bottom: 72 });
    expect(place(anchor, "bottom", 600).maxHeight).toBe(
      Math.floor(Math.max(MIN_MAX_HEIGHT, 600 - anchor.bottom - OFFSET - PAD)),
    );
  });

  it("on the top side, caps by the room above the anchor", () => {
    const anchor = rect({ top: 400, bottom: 432 });
    expect(place(anchor, "top", 800).maxHeight).toBe(
      Math.floor(Math.max(MIN_MAX_HEIGHT, anchor.top - OFFSET - PAD)),
    );
  });

  it("on a left / right side, caps by the viewport height", () => {
    const anchor = rect({ top: 400, bottom: 432, left: 500, right: 600 });
    expect(place(anchor, "right", 800).maxHeight).toBe(800 - PAD * 2);
  });
});

const arrowInset = () => 6;

function Anchored({
  open,
  matchAnchorWidth,
  withArrow = false,
}: {
  open: boolean;
  matchAnchorWidth: boolean;
  withArrow?: boolean;
}) {
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const layerRef = React.useRef<HTMLDivElement>(null);
  const { side, attachLayer } = usePosition(open, anchorRef, layerRef, {
    side: "bottom",
    align: "start",
    matchAnchorWidth,
    arrowInset: withArrow ? arrowInset : undefined,
  });
  return (
    <>
      <button ref={anchorRef} type="button">
        anchor
      </button>
      <div ref={attachLayer} data-testid="layer" data-side={side} />
    </>
  );
}

describe("usePosition", () => {
  it("places the layer fixed while enabled and reports the side", () => {
    render(<Anchored open matchAnchorWidth={false} />);
    const layer = screen.getByTestId("layer");
    expect(layer.style.position).toBe("fixed");
    expect(layer).toHaveAttribute("data-side", "bottom");
    expect(layer.style.getPropertyValue("--float-min-w")).toBe("");
    expect(layer.style.getPropertyValue("--float-arrow")).toBe("");
  });

  it("writes the anchor width only when asked", () => {
    render(<Anchored open matchAnchorWidth />);
    expect(screen.getByTestId("layer").style.getPropertyValue("--float-min-w")).not.toBe("");
  });

  it("writes the arrow position when an arrow inset is given", () => {
    render(<Anchored open matchAnchorWidth={false} withArrow />);
    expect(screen.getByTestId("layer").style.getPropertyValue("--float-arrow")).toMatch(/px$/);
  });

  it("does nothing while disabled", () => {
    render(<Anchored open={false} matchAnchorWidth={false} />);
    expect(screen.getByTestId("layer").style.position).toBe("");
  });

  it("anchors to the visible part of the anchor when a layout narrows it", () => {
    const seen: HTMLElement[] = [];
    const narrow: AnchorRectResolver = (anchor) => {
      seen.push(anchor);
      return { top: 100, bottom: 136, left: 8, right: 48, width: 40, height: 36 };
    };
    render(
      <AnchorRectProvider value={narrow}>
        <Anchored open matchAnchorWidth />
      </AnchorRectProvider>,
    );
    const layer = screen.getByTestId("layer");
    expect(seen[0]).toBe(screen.getByRole("button", { name: "anchor" }));
    expect(layer.style.left).toBe("8px");
    expect(layer.style.getPropertyValue("--float-min-w")).toBe("40px");
  });
});

/** A layer at a point inside its anchor: the pointer over a chart. */
function AtPoint({ point }: { point: AnchorPoint | null }) {
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const layerRef = React.useRef<HTMLDivElement>(null);
  const { side, attachLayer } = usePosition(true, anchorRef, layerRef, {
    side: "right",
    align: "center",
    anchorPoint: point,
  });
  return (
    <>
      <div ref={anchorRef} data-testid="anchor" />
      <div ref={attachLayer} data-testid="layer" data-side={side} />
    </>
  );
}

describe("usePosition at an anchor point", () => {
  const anchorAt = () => {
    const anchor = screen.getByTestId("anchor");
    anchor.getBoundingClientRect = () =>
      rect({ left: 100, top: 200, right: 500, bottom: 280, width: 400, height: 80 });
  };

  it("places the layer against the point, not the anchor, and follows each new point", () => {
    const { rerender } = render(<AtPoint point={null} />);
    anchorAt();
    rerender(<AtPoint point={{ x: 40, y: 20 }} />);
    const layer = screen.getByTestId("layer");
    // jsdom has no tokens: the fallback panel offset (4) right of x = 140, centred on y = 220.
    expect(layer.style.left).toBe("144px");
    expect(layer.style.top).toBe("220px");
    rerender(<AtPoint point={{ x: 360, y: 60 }} />);
    expect(layer.style.left).toBe("464px");
    expect(layer.style.top).toBe("260px");
    expect(layer).toHaveAttribute("data-side", "right");
  });

  it("keeps its side past the middle and flips only where the side has no room", () => {
    // A 160 wide layer at x = 900 of a 1024 viewport: no room right (900 + 4 + 160 + 8 > 1024).
    const right = computeFloatingPosition(
      rect({ left: 600, right: 600, top: 300, bottom: 300 }),
      160,
      40,
      1024,
      768,
      {
        side: "right",
        align: "center",
        offset: 16,
        viewportPad: 8,
        flip: true,
        matchAnchorWidth: false,
      },
    );
    expect(right.side).toBe("right");
    expect(right.left).toBe(616);
    const flipped = computeFloatingPosition(
      rect({ left: 900, right: 900, top: 300, bottom: 300 }),
      160,
      40,
      1024,
      768,
      {
        side: "right",
        align: "center",
        offset: 16,
        viewportPad: 8,
        flip: true,
        matchAnchorWidth: false,
      },
    );
    expect(flipped.side).toBe("left");
    expect(flipped.left).toBe(900 - 16 - 160);
  });
});

/*
 * A Select panel: narrow by its content until `--float-min-w` makes it as wide as its anchor. With
 * `align="auto"` near the end of the screen the panel lines its end edge up — from its width. The
 * first placement must use the width the panel has once its limits are written, or the first frame
 * shows it out of place (to the right) until the next one corrects it.
 */
function AutoAligned() {
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const layerRef = React.useRef<HTMLDivElement>(null);
  const { attachLayer } = usePosition(true, anchorRef, layerRef, {
    align: "auto",
    matchAnchorWidth: true,
  });
  return (
    <>
      <button ref={anchorRef} type="button">
        anchor
      </button>
      <div ref={attachLayer} data-testid="layer" />
    </>
  );
}

describe("usePosition — the first placement uses the settled size", () => {
  it("writes the size limits first and places the layer by its final width", () => {
    const anchorRect = rect({ top: 100, bottom: 136, left: 700, right: 1000, width: 300 });
    const restore = [
      vi.spyOn(HTMLButtonElement.prototype, "getBoundingClientRect").mockReturnValue(anchorRect),
      // The layer is 120 wide by its content, or as wide as `--float-min-w` once it is written.
      vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (
        this: HTMLElement,
      ) {
        const min = Number.parseFloat(this.style.getPropertyValue("--float-min-w"));
        return Number.isFinite(min) ? Math.max(120, min) : 120;
      }),
      vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(200),
    ];
    const { innerWidth } = window;
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1024 });
    try {
      render(<AutoAligned />);
      const layer = screen.getByTestId("layer");
      // End edge lined up with a 300-wide panel: 1000 − 300. A 120-wide guess would give 880.
      expect(layer.style.left).toBe("700px");
      expect(layer.style.getPropertyValue("--float-min-w")).toBe("300px");
      expect(layer).not.toHaveAttribute("data-float-pending");
    } finally {
      for (const spy of restore) spy.mockRestore();
      Object.defineProperty(window, "innerWidth", { configurable: true, value: innerWidth });
    }
  });
});
