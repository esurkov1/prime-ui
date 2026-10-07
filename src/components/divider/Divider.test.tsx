import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Divider } from "./Divider";

describe("Divider", () => {
  it("renders horizontal by default", () => {
    render(<Divider />);

    const el = screen.getByRole("separator");
    expect(el).toHaveAttribute("data-orientation", "horizontal");
    expect(el).toHaveAttribute("data-size", "m");
    expect(el).not.toHaveAttribute("aria-orientation");
  });

  it("sets data-size from the size prop", () => {
    render(<Divider size="xl" />);
    expect(screen.getByRole("separator")).toHaveAttribute("data-size", "xl");
  });

  it("renders with text children", () => {
    render(<Divider>Label</Divider>);

    expect(screen.getByText("Label")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("renders vertical orientation", () => {
    render(<Divider orientation="vertical" />);

    const el = screen.getByRole("separator");
    expect(el).toHaveAttribute("data-orientation", "vertical");
    expect(el).toHaveAttribute("aria-orientation", "vertical");
  });

  it("sets data-align for start, center, and end", () => {
    const { rerender } = render(<Divider align="start">A</Divider>);
    expect(screen.getByRole("separator")).toHaveAttribute("data-align", "start");

    rerender(<Divider align="center">A</Divider>);
    expect(screen.getByRole("separator")).toHaveAttribute("data-align", "center");

    rerender(<Divider align="end">A</Divider>);
    expect(screen.getByRole("separator")).toHaveAttribute("data-align", "end");
  });

  it("takes a role override and forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(<Divider ref={ref} role="presentation" />);
    expect(screen.queryByRole("separator")).toBeNull();
    expect(ref.current).toBe(container.firstChild);
  });

  it("merges className", () => {
    render(<Divider className="custom-divider" />);
    expect(screen.getByRole("separator")).toHaveClass("custom-divider");
  });

  it("defaults align to center and does not set data-variant", () => {
    render(<Divider>Section</Divider>);
    const el = screen.getByRole("separator");
    expect(el).toHaveAttribute("data-align", "center");
    expect(el).not.toHaveAttribute("data-variant");
  });
});
