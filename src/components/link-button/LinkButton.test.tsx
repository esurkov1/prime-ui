import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LinkButton } from "./LinkButton";

describe("LinkButton", () => {
  it("renders", () => {
    render(<LinkButton href="/x">Label</LinkButton>);
    expect(screen.getByRole("link", { name: "Label" })).toBeInTheDocument();
  });

  it("passes href", () => {
    render(<LinkButton href="https://example.com/path">External</LinkButton>);
    expect(screen.getByRole("link", { name: "External" })).toHaveAttribute(
      "href",
      "https://example.com/path",
    );
  });

  it("sets aria-disabled and tabIndex when disabled", () => {
    render(
      <LinkButton href="/here" disabled>
        Gone
      </LinkButton>,
    );
    const link = screen.getByRole("link", { name: "Gone" });
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabIndex", "-1");
    expect(link).toHaveAttribute("data-disabled", "true");
  });

  it("applies size data attributes", () => {
    const { rerender } = render(<LinkButton href="/s">S</LinkButton>);
    expect(screen.getByRole("link", { name: "S" })).toHaveAttribute("data-size", "m");

    rerender(
      <LinkButton href="/m" size="l">
        M
      </LinkButton>,
    );
    expect(screen.getByRole("link", { name: "M" })).toHaveAttribute("data-size", "l");

    rerender(
      <LinkButton href="/l" size="xl">
        L
      </LinkButton>,
    );
    expect(screen.getByRole("link", { name: "L" })).toHaveAttribute("data-size", "xl");
  });

  it("merges className", () => {
    render(
      <LinkButton href="/c" className="extra">
        C
      </LinkButton>,
    );
    expect(screen.getByRole("link", { name: "C" })).toHaveClass("extra");
  });

  it("renders children", () => {
    render(
      <LinkButton href="/kids">
        <span>Nested</span>
      </LinkButton>,
    );
    expect(screen.getByText("Nested")).toBeInTheDocument();
  });

  it("defaults tone to accent and accepts neutral", () => {
    const { rerender } = render(<LinkButton href="/t">T</LinkButton>);
    expect(screen.getByRole("link", { name: "T" })).toHaveAttribute("data-tone", "accent");
    rerender(
      <LinkButton href="/t" tone="neutral">
        T
      </LinkButton>,
    );
    expect(screen.getByRole("link", { name: "T" })).toHaveAttribute("data-tone", "neutral");
  });
});
