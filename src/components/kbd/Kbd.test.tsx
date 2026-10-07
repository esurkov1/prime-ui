import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";

import { Kbd } from "./Kbd";

describe("Kbd", () => {
  it("renders children content", () => {
    render(<Kbd>Enter</Kbd>);
    expect(screen.getByText("Enter")).toBeInTheDocument();
  });

  it("merges className", () => {
    render(<Kbd className="custom-kbd">K</Kbd>);
    expect(screen.getByText("K")).toHaveClass("custom-kbd");
  });

  it("uses native kbd element and forwards ref", () => {
    const ref = React.createRef<HTMLElement>();
    const { container } = render(<Kbd ref={ref}>⌘</Kbd>);
    const kbd = container.querySelector("kbd");
    expect(kbd).toHaveTextContent("⌘");
    expect(ref.current).toBe(kbd);
  });

  it("defaults size to m via data-size", () => {
    render(<Kbd>K</Kbd>);
    expect(screen.getByText("K")).toHaveAttribute("data-size", "m");
  });

  it("sets data-size from size prop", () => {
    render(<Kbd size="s">K</Kbd>);
    expect(screen.getByText("K")).toHaveAttribute("data-size", "s");
  });

  it("inside a control uses the badge tier one step down", () => {
    render(
      <ControlSizeProvider value="s">
        <Kbd>K</Kbd>
      </ControlSizeProvider>,
    );
    const el = screen.getByText("K");
    expect(el).toHaveAttribute("data-size", "s");
    expect(el).toHaveAttribute("data-tier", "xs");
  });
});
