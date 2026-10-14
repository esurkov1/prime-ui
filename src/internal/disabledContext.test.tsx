import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DisabledProvider, useInheritedDisabled } from "./disabledContext";

function Probe({ own }: { own?: boolean }) {
  return <span data-testid="probe">{String(useInheritedDisabled(own))}</span>;
}

describe("disabledContext", () => {
  it("is the control's own disabled outside a group", () => {
    const { rerender } = render(<Probe />);
    expect(screen.getByTestId("probe")).toHaveTextContent("false");
    rerender(<Probe own />);
    expect(screen.getByTestId("probe")).toHaveTextContent("true");
  });

  it("a disabled group disables everything inside; an enabled one never re-enables", () => {
    const { rerender } = render(
      <DisabledProvider disabled>
        <Probe />
      </DisabledProvider>,
    );
    expect(screen.getByTestId("probe")).toHaveTextContent("true");
    rerender(
      <DisabledProvider disabled>
        <DisabledProvider disabled={false}>
          <Probe />
        </DisabledProvider>
      </DisabledProvider>,
    );
    expect(screen.getByTestId("probe")).toHaveTextContent("true");
  });
});
