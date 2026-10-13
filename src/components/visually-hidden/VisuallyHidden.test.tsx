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
});
