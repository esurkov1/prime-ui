import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { VisuallyHidden } from "@/components";

describe("VisuallyHidden (public)", () => {
  it("keeps the text in the accessible name and forwards attributes", () => {
    render(
      <button type="button">
        <svg aria-hidden="true" />
        <VisuallyHidden data-testid="hidden">Удалить счёт</VisuallyHidden>
      </button>,
    );
    expect(screen.getByRole("button", { name: "Удалить счёт" })).toBeInTheDocument();
    expect(screen.getByTestId("hidden").tagName).toBe("SPAN");
  });

  it("live: a polite status or an assertive alert, read as a whole", () => {
    const { rerender } = render(<VisuallyHidden live="polite">Сохранено</VisuallyHidden>);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Сохранено");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveAttribute("aria-atomic", "true");
    rerender(<VisuallyHidden live="assertive">Не удалось сохранить</VisuallyHidden>);
    expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "assertive");
  });

  it("owns the region attributes: a hand-set role or aria-live never overrides live", () => {
    // The props type has no role / aria-live / aria-atomic / aria-relevant; untyped spread still loses.
    const loose = { role: "note", "aria-live": "off", "aria-atomic": false } as object;
    render(
      <VisuallyHidden live="polite" {...loose}>
        Счёт сохранён
      </VisuallyHidden>,
    );
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveAttribute("aria-atomic", "true");
  });

  it("is no region without live", () => {
    render(<VisuallyHidden>Три счёта ждут оплаты</VisuallyHidden>);
    expect(screen.getByText("Три счёта ждут оплаты")).not.toHaveAttribute("role");
    expect(screen.getByText("Три счёта ждут оплаты")).not.toHaveAttribute("aria-live");
  });
});
