import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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

  it("disabled keeps id, aria-label and ref, drops href and swallows the click", () => {
    const onClick = vi.fn();
    const ref = { current: null as HTMLAnchorElement | null };
    render(
      <LinkButton ref={ref} href="/here" id="gone" aria-label="Ушла" disabled onClick={onClick}>
        Gone
      </LinkButton>,
    );
    const link = screen.getByRole("link", { name: "Ушла" });
    expect(link).toHaveAttribute("id", "gone");
    expect(link).not.toHaveAttribute("href");
    expect(ref.current).toBe(link);
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    fireEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
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

  it("asChild puts the link look on a button that keeps its role and click", () => {
    const onClick = vi.fn();
    render(
      <LinkButton asChild size="s">
        <button type="button" onClick={onClick}>
          Отправить ещё раз
        </button>
      </LinkButton>,
    );
    const button = screen.getByRole("button", { name: "Отправить ещё раз" });
    expect(button).toHaveAttribute("data-size", "s");
    expect(button).toHaveAttribute("data-tone", "accent");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("asChild + disabled marks aria-disabled and swallows the click", () => {
    const onClick = vi.fn();
    render(
      <LinkButton asChild disabled onClick={onClick}>
        <a href="#x">Счета</a>
      </LinkButton>,
    );
    const link = screen.getByRole("link", { name: "Счета" });
    expect(link).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });
});
