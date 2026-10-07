import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CodeBlock } from "./CodeBlock";

describe("CodeBlock", () => {
  it("renders highlighted code", () => {
    const { container } = render(<CodeBlock.Root code="const a = 1" colorScheme="light" />);
    const pre = container.querySelector("pre");
    expect(pre).toBeTruthy();
    expect(pre?.innerHTML).toContain("prime-tok-k");
  });

  it("follows the surrounding theme when colorScheme is omitted", () => {
    const { container } = render(<CodeBlock.Root code="const a = 1" />);
    const pre = container.querySelector("pre");
    expect(pre).not.toHaveAttribute("data-theme");
    expect(pre).toHaveAttribute("data-variant", "soft");
    expect(pre).toHaveAttribute("tabindex", "0");
  });

  it("ghost variant is not a tab stop", () => {
    const { container } = render(<CodeBlock.Root code="x" variant="ghost" colorScheme="dark" />);
    const pre = container.querySelector("pre");
    expect(pre).toHaveAttribute("data-variant", "ghost");
    expect(pre).toHaveAttribute("data-theme", "dark");
    expect(pre).not.toHaveAttribute("tabindex");
  });
});
