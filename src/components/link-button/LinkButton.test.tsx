import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("disabled drops href, so the link leaves the Tab order", async () => {
    render(
      <>
        <LinkButton href="/here" disabled>
          Gone
        </LinkButton>
        <LinkButton href="/next">Next</LinkButton>
      </>,
    );
    const link = screen.getByRole("link", { name: "Gone" });
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).not.toHaveAttribute("href");
    expect(link).toHaveAttribute("data-disabled", "true");
    await userEvent.tab();
    expect(screen.getByRole("link", { name: "Next" })).toHaveFocus();
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

  it("defaults tone to accent and accepts neutral and muted", () => {
    const { rerender } = render(<LinkButton href="/t">T</LinkButton>);
    expect(screen.getByRole("link", { name: "T" })).toHaveAttribute("data-tone", "accent");
    for (const tone of ["neutral", "muted"] as const) {
      rerender(
        <LinkButton href="/t" tone={tone}>
          T
        </LinkButton>,
      );
      expect(screen.getByRole("link", { name: "T" })).toHaveAttribute("data-tone", tone);
    }
  });

  it("inline marks the link for running text", () => {
    const { rerender } = render(<LinkButton href="/t">T</LinkButton>);
    expect(screen.getByRole("link", { name: "T" })).not.toHaveAttribute("data-inline");
    rerender(
      <LinkButton href="/t" inline>
        T
      </LinkButton>,
    );
    expect(screen.getByRole("link", { name: "T" })).toHaveAttribute("data-inline", "true");
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
    expect(link).not.toHaveAttribute("href");
    expect(link).toHaveAttribute("tabIndex", "-1");
    fireEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("asChild needs one element child", () => {
    expect(() =>
      render(
        // @ts-expect-error: asChild takes one element, not text
        <LinkButton asChild>Счета</LinkButton>,
      ),
    ).toThrow("LinkButton asChild needs a single element child");
  });
});
