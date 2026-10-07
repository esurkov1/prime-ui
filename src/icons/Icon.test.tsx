import { render, screen } from "@testing-library/react";
import { Bike } from "lucide-react";
import { describe, expect, it } from "vitest";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { iconBoxStyles } from "@/internal/iconBox";
import { createIcon, Icon, type IconName } from "./index";
import { iconRegistry } from "./registry";

describe("Icon", () => {
  it("renders every registry name as a hidden svg", () => {
    for (const name of Object.keys(iconRegistry) as IconName[]) {
      const { container, unmount } = render(<Icon name={name} />);
      const svg = container.querySelector("svg");
      expect(svg, name).not.toBeNull();
      expect(svg).toHaveAttribute("aria-hidden", "true");
      unmount();
    }
  });

  it("explicit size uses the global icon scale", () => {
    render(<Icon name="action.close" size="l" data-testid="i" />);
    const el = screen.getByTestId("i");
    expect(el).toHaveClass(iconBoxStyles.l);
    expect(el).not.toHaveClass(iconBoxStyles.inherit);
  });

  it("without size follows the nearest control tier", () => {
    render(
      <ControlSizeProvider value="xs">
        <Icon name="action.close" data-testid="i" />
      </ControlSizeProvider>,
    );
    const el = screen.getByTestId("i");
    expect(el).toHaveClass(iconBoxStyles.xs);
    expect(el).toHaveClass(iconBoxStyles.inherit);
  });

  it("defaults to the m control icon outside any control", () => {
    render(<Icon name="action.close" data-testid="i" />);
    const el = screen.getByTestId("i");
    expect(el).toHaveClass(iconBoxStyles.m);
    expect(el).toHaveClass(iconBoxStyles.inherit);
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("forwards ref to the svg and sets data-tone only for a non-default tone", () => {
    const ref = { current: null as SVGSVGElement | null };
    const { rerender } = render(<Icon name="action.close" ref={ref} data-testid="i" />);
    expect(ref.current).toBe(screen.getByTestId("i"));
    expect(screen.getByTestId("i")).not.toHaveAttribute("data-tone");
    rerender(<Icon name="action.close" tone="danger" data-testid="i" />);
    expect(screen.getByTestId("i")).toHaveAttribute("data-tone", "danger");
  });
});

describe("createIcon", () => {
  const IconBike = createIcon(Bike);

  it("gives a domain glyph the kit sizing, tone and hidden state", () => {
    render(
      <ControlSizeProvider value="l">
        <IconBike tone="muted" data-testid="bike" />
      </ControlSizeProvider>,
    );
    const el = screen.getByTestId("bike");
    expect(el.tagName.toLowerCase()).toBe("svg");
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el).toHaveAttribute("data-tone", "muted");
    expect(el).toHaveClass(iconBoxStyles.l);
    expect(el).toHaveClass(iconBoxStyles.inherit);
  });
});
