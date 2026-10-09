import { readFileSync } from "node:fs";
import path from "node:path";
import { render } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { RING_DATA_STROKE, RING_PATH, Ring } from "./ring";

const css = readFileSync(path.resolve(process.cwd(), "src/internal/ring.module.css"), "utf8");

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

  it("clamps the share and hides an empty arc at rest", () => {
    const { container, rerender } = render(<Ring value={1.7} />);
    expect(svgOf(container).style.getPropertyValue("--ring-value")).toBe("1");
    rerender(<Ring value={0} />);
    expect(svgOf(container)).toHaveAttribute("data-empty", "true");
    // Turning, even 0% shows: the arc's least length takes over.
    rerender(<Ring value={0} spin />);
    expect(svgOf(container)).not.toHaveAttribute("data-empty");
    expect(css).toMatch(
      /\.ring\[data-spin\] \{\s*--ring-arc: max\(var\(--ring-value, 0\), 0\.08\)/,
    );
  });

  it("null: a quarter arc that always turns", () => {
    const { container } = render(<Ring value={null} />);
    const svg = svgOf(container);
    expect(svg.style.getPropertyValue("--ring-value")).toBe("0.25");
    expect(svg).toHaveAttribute("data-spin", "true");
  });

  it("turns as a transform of the svg, 3 loops a turn; reduced motion slows it, never stops it", () => {
    expect(css).toMatch(
      /animation: ringTurn calc\(var\(--prime-motion-loop\) \* 3\) linear infinite/,
    );
    expect(css).toMatch(/@keyframes ringTurn \{\s*to \{\s*transform: rotate\(1turn\);/);
    expect(css).toMatch(
      /prefers-reduced-motion: reduce\) \{\s*\.ring\[data-spin\] \{\s*animation-duration: calc\(var\(--prime-motion-loop\) \* 6\)/,
    );
    // The share glides on the arc alone.
    expect(css).toMatch(/stroke-dashoffset var\(--prime-motion-duration-base\)/);
  });

  it("weights: the line weight (two borders) and the data weight (1/12, never thinner)", () => {
    expect(css).toMatch(/--ring-stroke: calc\(var\(--prime-border-width\) \* 2\)/);
    expect(css).toMatch(
      /\[data-weight="data"\] \{\s*--ring-stroke: max\(calc\(100% \/ 12\), calc\(var\(--prime-border-width\) \* 2\)\)/,
    );
    // 1/12 of the diameter along a circle of 11/12 of it, in percent of that circle.
    expect(RING_DATA_STROKE).toBeCloseTo(100 / (11 * Math.PI));
  });

  it("live: the host writes the share, so the ring sets none and does not glide", () => {
    const ref = React.createRef<SVGSVGElement>();
    const { container } = render(<Ring ref={ref} value={0.5} live track={false} />);
    const svg = svgOf(container);
    expect(ref.current).toBe(svg);
    expect(svg.style.getPropertyValue("--ring-value")).toBe("");
    expect(svg).toHaveAttribute("data-live", "true");
    expect(svg.querySelectorAll("circle")).toHaveLength(1);
    expect(css).toMatch(/\.ring\[data-live\] \.arc \{\s*transition: none;/);
  });

  it("takes a role from its host and then is no longer hidden", () => {
    const { container } = render(<Ring value={0.3} role="progressbar" aria-label="Импорт" />);
    expect(svgOf(container)).not.toHaveAttribute("aria-hidden");
    expect(svgOf(container)).toHaveAttribute("role", "progressbar");
  });
});
