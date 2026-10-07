import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { AnchorRectProvider, type AnchorRectResolver } from "@/internal/AnchorRectContext";

import { computeFloatingPosition, type PositionSide, usePosition } from "./usePosition";

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
