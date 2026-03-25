import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LinkButton } from "./LinkButton";

describe("LinkButton", () => {
  it("renders", () => {
    render(<LinkButton.Root href="/x">Label</LinkButton.Root>);
    expect(screen.getByRole("link", { name: "Label" })).toBeInTheDocument();
  });

  it("passes href", () => {
    render(<LinkButton.Root href="https://example.com/path">External</LinkButton.Root>);
    expect(screen.getByRole("link", { name: "External" })).toHaveAttribute(
      "href",
      "https://example.com/path",
    );
  });

  it("sets aria-disabled and tabIndex when disabled", () => {
    render(
      <LinkButton.Root href="/here" disabled>
        Gone
      </LinkButton.Root>,
    );
    const link = screen.getByRole("link", { name: "Gone" });
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabIndex", "-1");
    expect(link).toHaveAttribute("data-disabled", "true");
  });

  it("applies size data attributes", () => {
    const { rerender } = render(
      <LinkButton.Root href="/s" size="m">
        S
      </LinkButton.Root>,
    );
    expect(screen.getByRole("link", { name: "S" })).toHaveAttribute("data-size", "m");

    rerender(
      <LinkButton.Root href="/m" size="l">
        M
      </LinkButton.Root>,
    );
    expect(screen.getByRole("link", { name: "M" })).toHaveAttribute("data-size", "l");

    rerender(
      <LinkButton.Root href="/l" size="xl">
        L
      </LinkButton.Root>,
    );
    expect(screen.getByRole("link", { name: "L" })).toHaveAttribute("data-size", "xl");
  });

  it("merges className", () => {
    render(
      <LinkButton.Root href="/c" className="extra">
        C
      </LinkButton.Root>,
    );
    expect(screen.getByRole("link", { name: "C" })).toHaveClass("extra");
  });

  it("renders children", () => {
    render(
      <LinkButton.Root href="/kids">
        <span>Nested</span>
      </LinkButton.Root>,
    );
    expect(screen.getByText("Nested")).toBeInTheDocument();
  });
});
