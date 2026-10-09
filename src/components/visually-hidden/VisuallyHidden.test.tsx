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

  it("serves as a polite live region", () => {
    render(
      <VisuallyHidden role="status" aria-live="polite">
        Сохранено
      </VisuallyHidden>,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Сохранено");
  });
});
