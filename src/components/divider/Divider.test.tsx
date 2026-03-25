import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Divider } from "./Divider";

describe("Divider", () => {
  it("renders horizontal by default", () => {
    render(<Divider.Root />);

    const el = screen.getByRole("separator");
    expect(el).toHaveAttribute("data-orientation", "horizontal");
    expect(el).toHaveAttribute("data-size", "m");
    expect(el).not.toHaveAttribute("aria-orientation");
  });

  it("sets data-size from the size prop", () => {
    render(<Divider.Root size="xl" />);
    expect(screen.getByRole("separator")).toHaveAttribute("data-size", "xl");
  });

  it("renders with text children", () => {
    render(<Divider.Root>Label</Divider.Root>);

    expect(screen.getByText("Label")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("renders vertical orientation", () => {
    render(<Divider.Root orientation="vertical" />);

    const el = screen.getByRole("separator");
    expect(el).toHaveAttribute("data-orientation", "vertical");
    expect(el).toHaveAttribute("aria-orientation", "vertical");
  });

  it("sets data-align for start, center, and end", () => {
    const { rerender } = render(<Divider.Root align="start">A</Divider.Root>);
    expect(screen.getByRole("separator")).toHaveAttribute("data-align", "start");

    rerender(<Divider.Root align="center">A</Divider.Root>);
    expect(screen.getByRole("separator")).toHaveAttribute("data-align", "center");

    rerender(<Divider.Root align="end">A</Divider.Root>);
    expect(screen.getByRole("separator")).toHaveAttribute("data-align", "end");
  });

  it("exposes role separator", () => {
    render(<Divider.Root />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("merges className", () => {
    render(<Divider.Root className="custom-divider" />);
    expect(screen.getByRole("separator")).toHaveClass("custom-divider");
  });

  it("variant line-spacing sets data-variant", () => {
    render(<Divider.Root variant="line-spacing" />);
    expect(screen.getByRole("separator")).toHaveAttribute("data-variant", "line-spacing");
  });

  it("variant text defaults align to start", () => {
    render(<Divider.Root variant="text">Section</Divider.Root>);
    const el = screen.getByRole("separator");
    expect(el).toHaveAttribute("data-variant", "text");
    expect(el).toHaveAttribute("data-align", "start");
  });
});
