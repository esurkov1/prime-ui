import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { cssRule, cssValue } from "@/test/css";

import { SwitcherScroller } from "./SwitcherScroller";

describe("SwitcherScroller", () => {
  it("is a sideways scroller with a hidden bar and faded edges by default", () => {
    render(
      <SwitcherScroller role="tablist" aria-label="Разделы">
        <button type="button">Заказы</button>
      </SwitcherScroller>,
    );
    const row = screen.getByRole("tablist", { name: "Разделы" });
    expect(row).toHaveAttribute("data-edges", "fade");
    expect(row).not.toHaveAttribute("data-snap");
  });

  it("takes plain edges for a switcher that draws its own overlays, and forwards its ref", () => {
    const ref = React.createRef<HTMLElement>();
    render(
      <SwitcherScroller ref={ref} edges="none" data-testid="row">
        <button type="button">Неделя</button>
      </SwitcherScroller>,
    );
    expect(screen.getByTestId("row")).not.toHaveAttribute("data-edges");
    expect(ref.current).toBe(screen.getByTestId("row"));
  });

  it("is the positioned box of one row that never wraps; the host lays it out", () => {
    const rule = cssRule("src/internal/SwitcherScroller.module.css", ":where(.root)");
    expect(cssValue(rule, "position")).toBe("relative");
    expect(cssValue(rule, "flex-wrap")).toBe("nowrap");
  });
});
