import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useEdgeOverflow } from "./useEdgeOverflow";

/*
 * jsdom has no layout: the scroll geometry of an element comes from its `data-*` attributes
 * (`data-scroll-height`, `data-client-height`, `data-scroll-top` and their inline-axis pairs).
 */
const GEOMETRY = [
  "scrollHeight",
  "clientHeight",
  "scrollTop",
  "scrollWidth",
  "clientWidth",
  "scrollLeft",
] as const;

beforeEach(() => {
  for (const key of GEOMETRY) {
    vi.spyOn(HTMLElement.prototype, key, "get").mockImplementation(function (this: HTMLElement) {
      return Number(this.dataset[key] ?? 0);
    });
  }
});

afterEach(() => {
  vi.restoreAllMocks();
});

type Axis = Parameters<typeof useEdgeOverflow>[1];

function Region({ axis, depth = false }: { axis: Axis; depth?: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const overflow = useEdgeOverflow(ref, axis, depth);
  const hidden = (Object.keys(overflow) as (keyof typeof overflow)[]).filter((e) => overflow[e]);
  return (
    <div
      ref={ref}
      data-testid="region"
      data-hidden={hidden.join(" ")}
      data-scroll-height="300"
      data-client-height="100"
      data-scroll-width="500"
      data-client-width="200"
      style={{ "--scroll-fade-depth": "32px" } as React.CSSProperties}
    >
      <p>Счёт №1024</p>
    </div>
  );
}

const region = () => screen.getByTestId("region");

function scrollTo(node: HTMLElement, { top = 0, left = 0 }) {
  node.dataset.scrollTop = String(top);
  node.dataset.scrollLeft = String(left);
  fireEvent.scroll(node);
}

describe("useEdgeOverflow", () => {
  it("reports the block edges that hide content as the region scrolls", async () => {
    render(<Region axis="vertical" />);
    expect(region().dataset.hidden).toBe("bottom");
    scrollTo(region(), { top: 100 });
    await waitFor(() => expect(region().dataset.hidden).toBe("top bottom"));
    scrollTo(region(), { top: 200 });
    await waitFor(() => expect(region().dataset.hidden).toBe("top"));
  });

  it("measures only the axes it is given", async () => {
    const { rerender } = render(<Region axis="horizontal" />);
    expect(region().dataset.hidden).toBe("end");
    scrollTo(region(), { top: 100, left: 300 });
    await waitFor(() => expect(region().dataset.hidden).toBe("start"));
    rerender(<Region axis="both" />);
    expect(region().dataset.hidden).toBe("start top bottom");
    rerender(<Region axis={null} />);
    expect(region().dataset.hidden).toBe("");
  });

  // RTL: scrollLeft runs from 0 at the start to negative values toward the end.
  it("reads a negative scrollLeft as the distance from the start", async () => {
    render(<Region axis="horizontal" />);
    scrollTo(region(), { left: -300 });
    await waitFor(() => expect(region().dataset.hidden).toBe("start"));
  });

  it("with depth writes the hidden distance on each side, capped at --scroll-fade-depth", async () => {
    const { unmount } = render(<Region axis="vertical" depth />);
    const node = region();
    expect(node.style.getPropertyValue("--edge-top")).toBe("0px");
    expect(node.style.getPropertyValue("--edge-bottom")).toBe("32px");
    scrollTo(node, { top: 190 });
    await waitFor(() => expect(node.style.getPropertyValue("--edge-bottom")).toBe("10px"));
    expect(node.style.getPropertyValue("--edge-top")).toBe("32px");
    expect(node.style.getPropertyValue("--edge-start")).toBe("");
    unmount();
    expect(node.style.getPropertyValue("--edge-top")).toBe("");
    expect(node.style.getPropertyValue("--edge-bottom")).toBe("");
  });
});
