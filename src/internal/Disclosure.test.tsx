import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Disclosure } from "./Disclosure";

describe("Disclosure", () => {
  it("keeps its content mounted and flips only its state", () => {
    const { rerender } = render(
      <Disclosure open={false} data-testid="slot">
        <p>Расшифровка</p>
      </Disclosure>,
    );
    const slot = screen.getByTestId("slot");
    const text = screen.getByText("Расшифровка");
    expect(slot).toHaveAttribute("data-state", "closed");
    rerender(
      <Disclosure open data-testid="slot">
        <p>Расшифровка</p>
      </Disclosure>,
    );
    expect(slot).toHaveAttribute("data-state", "open");
    expect(screen.getByText("Расшифровка")).toBe(text);
    rerender(
      <Disclosure open={false} data-testid="slot">
        <p>Расшифровка</p>
      </Disclosure>,
    );
    // Closing keeps the node: it fades and folds with the height, then hides.
    expect(screen.getByText("Расшифровка")).toBe(text);
    expect(slot).toHaveAttribute("data-state", "closed");
  });
});
