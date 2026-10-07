import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { computeFloatingPosition } from "@/hooks/usePosition";

import { useAnchoredPosition } from "./useAnchoredPosition";

const OFFSET = 8;
const PAD = 8;
const MIN_MAX_HEIGHT = 120;

function rect(partial: Record<string, number>): DOMRectReadOnly {
  const base = { x: 0, y: 0, width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0 };
  return { ...base, ...partial, toJSON: () => ({}) } as DOMRectReadOnly;
}

const place = (anchor: DOMRectReadOnly, side: "bottom" | "top", vh: number) =>
  computeFloatingPosition(anchor, 200, 0, 1024, vh, {
    preferredSide: side,
    align: "start",
    offset: OFFSET,
    viewportPad: PAD,
    flip: false,
    matchTriggerMinWidth: false,
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
});

function Anchored({ open, matchAnchorWidth }: { open: boolean; matchAnchorWidth: boolean }) {
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const layerRef = React.useRef<HTMLDivElement>(null);
  const { side, attachLayer } = useAnchoredPosition(open, anchorRef, layerRef, {
    side: "bottom",
    align: "start",
    matchAnchorWidth,
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

describe("useAnchoredPosition", () => {
  it("places the layer fixed while enabled and reports the side", () => {
    render(<Anchored open matchAnchorWidth={false} />);
    const layer = screen.getByTestId("layer");
    expect(layer.style.position).toBe("fixed");
    expect(layer).toHaveAttribute("data-side", "bottom");
    expect(layer.style.getPropertyValue("--float-min-w")).toBe("");
  });

  it("writes the anchor width only when asked", () => {
    render(<Anchored open matchAnchorWidth />);
    expect(screen.getByTestId("layer").style.getPropertyValue("--float-min-w")).not.toBe("");
  });

  it("does nothing while disabled", () => {
    render(<Anchored open={false} matchAnchorWidth={false} />);
    expect(screen.getByTestId("layer").style.position).toBe("");
  });
});
