import { render } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { cssRule, cssValue } from "@/test/css";

import { RING_DATA_STROKE, RING_PATH, Ring } from "./ring";

const CSS = "src/internal/ring.module.css";

const svgOf = (container: HTMLElement) => container.querySelector("svg") as SVGSVGElement;

describe("Ring", () => {
  it("draws a track and an arc from 12 o'clock, both a hundred long, decorative by default", () => {
    const { container } = render(<Ring value={0.4} />);
    const svg = svgOf(container);
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg.style.getPropertyValue("--ring-value")).toBe("0.4");
    const circles = svg.querySelectorAll("circle");
    expect(circles).toHaveLength(2);
    for (const circle of circles) expect(circle).toHaveAttribute("pathLength", String(RING_PATH));
    expect(svg).toHaveAttribute("data-weight", "line");
    expect(svg).not.toHaveAttribute("data-spin");
  });

  it("draws the track of a surface with track surface, and no track with false", () => {
    const { container, rerender } = render(<Ring value={0.4} track="surface" />);
    expect(svgOf(container)).toHaveAttribute("data-track", "surface");
    expect(svgOf(container).querySelectorAll("circle")).toHaveLength(2);
    rerender(<Ring value={0.4} />);
    expect(svgOf(container)).not.toHaveAttribute("data-track");
    rerender(<Ring value={0.4} track={false} />);
    expect(svgOf(container).querySelectorAll("circle")).toHaveLength(1);
  });

  it("clamps the share and hides an empty arc at rest", () => {
    const { container, rerender } = render(<Ring value={1.7} />);
    expect(svgOf(container).style.getPropertyValue("--ring-value")).toBe("1");
    rerender(<Ring value={0} />);
    expect(svgOf(container)).toHaveAttribute("data-empty", "true");
    // Turning, even 0% shows: the arc's least length takes over.
    rerender(<Ring value={0} spin />);
    expect(svgOf(container)).not.toHaveAttribute("data-empty");
    expect(cssValue(cssRule(CSS, ".ring[data-spin]"), "--ring-arc")).toBe(
      "max(var(--ring-value, 0), 0.08)",
    );
  });

  it("null: a quarter arc that always turns", () => {
    const { container } = render(<Ring value={null} />);
    const svg = svgOf(container);
    expect(svg.style.getPropertyValue("--ring-value")).toBe("0.25");
    expect(svg).toHaveAttribute("data-spin", "true");
  });

  it("turns its inner group, 3 loops a turn, so the svg keeps a host's own animation", () => {
    const { container } = render(<Ring value={null} className="host" />);
    const svg = svgOf(container);
    expect(svg.firstElementChild?.tagName.toLowerCase()).toBe("g");
    expect(cssValue(cssRule(CSS, ".ring[data-spin] > .turn"), "animation")).toBe(
      "ringTurn calc(var(--prime-motion-loop) * 3) linear infinite",
    );
    expect(() => cssValue(cssRule(CSS, ".ring[data-spin]"), "animation")).toThrow();
    // Reduced motion slows the turn, never stops it.
    expect(
      cssValue(
        cssRule(CSS, ".ring[data-spin] > .turn", ["@media (prefers-reduced-motion: reduce)"]),
        "animation-duration",
      ),
    ).toBe("calc(var(--prime-motion-loop) * 6)");
    // The share glides on the arc alone.
    expect(cssValue(cssRule(CSS, ".arc"), "transition")).toContain(
      "stroke-dashoffset var(--prime-motion-duration-base)",
    );
  });

  it("weights: line (two borders), data (1/12, never thinner) and band (one spacing step)", () => {
    expect(cssValue(cssRule(CSS, ".ring"), "--ring-stroke")).toBe(
      "calc(var(--prime-border-width) * 2)",
    );
    expect(cssValue(cssRule(CSS, '.ring[data-weight="data"]'), "--ring-stroke")).toBe(
      "max(calc(100% / 12), calc(var(--prime-border-width) * 2))",
    );
    expect(cssValue(cssRule(CSS, '.ring[data-weight="band"]'), "--ring-stroke")).toBe(
      "var(--prime-space-1)",
    );
    const { container } = render(<Ring value={0.2} weight="band" />);
    expect(svgOf(container)).toHaveAttribute("data-weight", "band");
    // 1/12 of the diameter along a circle of 11/12 of it, in percent of that circle.
    expect(RING_DATA_STROKE).toBeCloseTo(100 / (11 * Math.PI));
  });

  it("live: the host writes the share, so the ring sets none and does not glide", () => {
    const ref = React.createRef<SVGSVGElement>();
    const { container } = render(<Ring ref={ref} value={0.5} live track="none" />);
    const svg = svgOf(container);
    expect(ref.current).toBe(svg);
    expect(svg.style.getPropertyValue("--ring-value")).toBe("");
    expect(svg).toHaveAttribute("data-live", "true");
    expect(svg.querySelectorAll("circle")).toHaveLength(1);
    expect(cssValue(cssRule(CSS, ".ring[data-live] .arc"), "transition")).toBe("none");
  });

  it("draws a fainter track for a loading cue (`faint`), the line tint by default", () => {
    const { container } = render(<Ring value={null} track="faint" />);
    const svg = svgOf(container);
    expect(svg).toHaveAttribute("data-track", "faint");
    expect(svg.querySelectorAll("circle")).toHaveLength(2);
    expect(cssValue(cssRule(CSS, '.ring[data-track="faint"]'), "--ring-track")).toContain(
      "var(--prime-tint-hover)",
    );
    expect(cssValue(cssRule(CSS, ".ring"), "--ring-track")).toContain("var(--prime-tint-line)");
  });

  it("takes a role from its host and then is no longer hidden", () => {
    const { container } = render(<Ring value={0.3} role="progressbar" aria-label="Импорт" />);
    expect(svgOf(container)).not.toHaveAttribute("aria-hidden");
    expect(svgOf(container)).toHaveAttribute("role", "progressbar");
  });
});
