import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import styles from "./Icon.module.css";
import { Icon, type IconName, iconRegistry } from "./index";

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
    expect(el).toHaveClass(styles.sizeL);
    expect(el).not.toHaveClass(styles.inherit);
  });

  it("without size follows the nearest control tier", () => {
    render(
      <ControlSizeProvider value="xs">
        <Icon name="action.close" data-testid="i" />
      </ControlSizeProvider>,
    );
    const el = screen.getByTestId("i");
    expect(el).toHaveClass(styles.sizeXs);
    expect(el).toHaveClass(styles.inherit);
  });

  it("defaults to the m control icon outside any control", () => {
    render(<Icon name="action.close" data-testid="i" />);
    const el = screen.getByTestId("i");
    expect(el).toHaveClass(styles.sizeM);
    expect(el).toHaveClass(styles.inherit);
    expect(el).toHaveAttribute("aria-hidden", "true");
  });
});
