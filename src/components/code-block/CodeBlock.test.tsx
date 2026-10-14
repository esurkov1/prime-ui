import { render } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { CodeBlock } from "./CodeBlock";

describe("CodeBlock", () => {
  it("renders highlighted code as text in spans", () => {
    const { container } = render(<CodeBlock code="const a = 1" colorScheme="light" />);
    const pre = container.querySelector("pre");
    expect(pre?.querySelector("code")?.textContent).toBe("const a = 1");
    const spans = Array.from(pre?.querySelectorAll("code > span") ?? []);
    expect(spans.map((span) => span.textContent)).toEqual(["const", "1"]);
  });

  it("never turns the source into markup", () => {
    const { container } = render(<CodeBlock code={'const x = "<img src=x onerror=alert(1)>"'} />);
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("code")?.textContent).toContain("<img");
  });

  it("a soft block scrolls through ScrollContainer and keeps its pre", () => {
    const { container } = render(<CodeBlock code="const a = 1" />);
    const pre = container.querySelector("pre");
    expect(pre?.parentElement).toBe(container);
    expect(pre).toHaveAttribute("data-variant", "soft");
  });

  it("follows the surrounding theme when colorScheme is omitted", () => {
    const { container } = render(<CodeBlock code="const a = 1" />);
    const pre = container.querySelector("pre");
    expect(pre).not.toHaveAttribute("data-theme");
    expect(pre).toHaveAttribute("data-variant", "soft");
    expect(pre).toHaveAttribute("tabindex", "0");
  });

  it("ghost variant is not a tab stop", () => {
    const { container } = render(<CodeBlock code="x" variant="ghost" colorScheme="dark" />);
    const pre = container.querySelector("pre");
    expect(pre).toHaveAttribute("data-variant", "ghost");
    expect(pre).toHaveAttribute("data-theme", "dark");
    expect(pre).not.toHaveAttribute("tabindex");
  });

  it("forwards ref to the pre", () => {
    const ref = React.createRef<HTMLPreElement>();
    const { container } = render(<CodeBlock ref={ref} code="x" />);
    expect(ref.current).toBe(container.querySelector("pre"));
  });
});
