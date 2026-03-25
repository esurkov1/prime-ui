import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Kbd } from "./Kbd";

describe("Kbd", () => {
  it("renders", () => {
    render(<Kbd.Root>K</Kbd.Root>);
    expect(screen.getByText("K")).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(<Kbd.Root>Enter</Kbd.Root>);
    expect(screen.getByText("Enter")).toBeInTheDocument();
  });

  it("merges className", () => {
    render(<Kbd.Root className="custom-kbd">K</Kbd.Root>);
    expect(screen.getByText("K")).toHaveClass("custom-kbd");
  });

  it("uses native kbd element", () => {
    const { container } = render(<Kbd.Root>⌘</Kbd.Root>);
    expect(container.querySelector("kbd")).toBeTruthy();
    expect(container.querySelector("kbd")).toHaveTextContent("⌘");
  });

  it("defaults size to m via data-size", () => {
    render(<Kbd.Root>K</Kbd.Root>);
    expect(screen.getByText("K")).toHaveAttribute("data-size", "m");
  });

  it("sets data-size from size prop", () => {
    render(<Kbd.Root size="s">K</Kbd.Root>);
    expect(screen.getByText("K")).toHaveAttribute("data-size", "s");
  });
});
