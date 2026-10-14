import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { type AnchorPoint, ChartTooltip } from "./ChartTooltip";

const PLOT_RECT = { left: 100, top: 50, right: 500, bottom: 290, width: 400, height: 240 };

function Plot({ point, onDismiss }: { point: AnchorPoint | null; onDismiss?: () => void }) {
  const plotRef = React.useRef<HTMLDivElement>(null);
  return (
    <div
      ref={(node) => {
        plotRef.current = node;
        if (node) node.getBoundingClientRect = () => PLOT_RECT as DOMRect;
      }}
      data-testid="plot"
    >
      <ChartTooltip anchorRef={plotRef} point={point} label="Неделя 41" onDismiss={onDismiss}>
        <span>61 клиент</span>
      </ChartTooltip>
    </div>
  );
}

const shown = () => document.body.querySelector("[data-side][data-state='open']");

describe("ChartTooltip", () => {
  it("renders in place without an anchor: a floating surface with the label over the content", () => {
    render(
      <ChartTooltip label="8 окт" data-testid="body">
        <span>Выручка: 120 000 ₽</span>
      </ChartTooltip>,
    );
    const body = screen.getByTestId("body");
    expect(body).toHaveAttribute("data-depth", "floating");
    expect(body.firstElementChild).toHaveTextContent("8 окт");
    expect(body).toHaveTextContent("Выручка: 120 000 ₽");
  });

  it("drops an empty label", () => {
    render(
      <ChartTooltip label={null} data-testid="body">
        <span>Выручка</span>
      </ChartTooltip>,
    );
    expect(screen.getByTestId("body").children).toHaveLength(1);
  });

  it("floats beside the point, out of the plot and hidden from assistive tech", () => {
    const { rerender } = render(<Plot point={null} />);
    expect(shown()).toBeNull();
    rerender(<Plot point={{ x: 40, y: 100 }} />);
    const tooltip = shown() as HTMLElement;
    expect(tooltip).toHaveTextContent("Неделя 4161 клиент");
    expect(screen.getByTestId("plot").contains(tooltip)).toBe(false);
    expect(tooltip).toHaveAttribute("aria-hidden", "true");
    expect(tooltip).toHaveAttribute("data-side", "right");
    // Vertically centred on the point: the plot top 50 + the point's y 100.
    expect(tooltip.style.top).toBe("150px");
  });

  it("Escape hides it for this point; the next point shows it again", async () => {
    const onDismiss = vi.fn();
    const { rerender } = render(<Plot point={{ x: 40, y: 100 }} onDismiss={onDismiss} />);
    expect(shown()).not.toBeNull();
    await userEvent.keyboard("{Escape}");
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(shown()).toBeNull();
    rerender(<Plot point={{ x: 40, y: 100 }} onDismiss={onDismiss} />);
    expect(shown()).toBeNull();
    rerender(<Plot point={{ x: 60, y: 100 }} onDismiss={onDismiss} />);
    expect(shown()).toHaveTextContent("Неделя 41");
  });
});
