import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CheckMark } from "./CheckMark";

describe("CheckMark", () => {
  it("keeps both marks mounted so a state change draws in or retracts, hidden from assistive tech", () => {
    const { container, rerender } = render(<CheckMark state="unchecked" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg?.querySelectorAll("path")).toHaveLength(2);
    for (const state of ["checked", "indeterminate", "unchecked"] as const) {
      rerender(<CheckMark state={state} />);
      expect(container.querySelector("svg")).toBe(svg);
      expect(svg).toHaveAttribute("data-state", state);
    }
  });
});
