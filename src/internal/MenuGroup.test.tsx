import { render, screen } from "@testing-library/react";

import { cssRule, cssValue } from "@/test/css";

import { ControlSizeProvider } from "./ControlSizeContext";
import { listRowStyles } from "./listRow";
import { MenuGroup, MenuRowCheck, menuRowProps, menuRowTier } from "./MenuGroup";

describe("MenuGroup", () => {
  it("a labelled group is named by its visible heading", () => {
    render(
      <MenuGroup label="Статус" data-testid="group">
        <div role="option" aria-selected="false" tabIndex={-1}>
          Оплачен
        </div>
      </MenuGroup>,
    );
    expect(screen.getByRole("group", { name: "Статус" })).toBe(screen.getByTestId("group"));
  });

  it("a group without a label has no heading and no name", () => {
    render(
      <MenuGroup>
        <div role="option" aria-selected="false" tabIndex={-1}>
          Черновик
        </div>
      </MenuGroup>,
    );
    expect(screen.getByRole("group")).not.toHaveAttribute("aria-labelledby");
  });

  it("carries the rows' tier, a tier below its panel", () => {
    render(
      <ControlSizeProvider value="l">
        <MenuGroup label="Статус" />
      </ControlSizeProvider>,
    );
    expect(screen.getByRole("group")).toHaveAttribute("data-size", "m");
  });
});

describe("menu rows", () => {
  it("stand a tier below their panel, never below xs", () => {
    expect(menuRowTier("m")).toBe("s");
    expect(menuRowTier("l")).toBe("m");
    expect(menuRowTier("xs")).toBe("xs");
  });

  it("are the list row and its hit element at the row's tier, with the row's states", () => {
    render(
      <>
        <div data-testid="plain" {...menuRowProps({ size: "s" })} />
        <div
          data-testid="states"
          {...menuRowProps({
            size: "s",
            lines: "two",
            highlighted: true,
            danger: true,
            checked: true,
            focusFill: true,
          })}
        />
        <div
          data-testid="disabled"
          {...menuRowProps({ size: "s", disabled: true, danger: true })}
        />
        <div data-testid="split" {...menuRowProps({ size: "s", hit: false, focusFill: true })} />
      </>,
    );
    const plain = screen.getByTestId("plain");
    expect(plain).toHaveClass(listRowStyles.row, listRowStyles.hit, listRowStyles.tier);
    expect(plain).toHaveAttribute("data-size", "s");
    expect(plain).toHaveAttribute("data-interactive", "");
    expect(plain).not.toHaveAttribute("data-lines");
    expect(plain).not.toHaveAttribute("data-highlighted");

    const states = screen.getByTestId("states");
    expect(states).toHaveAttribute("data-lines", "two");
    expect(states).toHaveAttribute("data-highlighted", "true");
    expect(states).toHaveAttribute("data-danger", "");
    expect(states).toHaveAttribute("data-checked", "true");
    expect(states).toHaveAttribute("data-focus", "fill");

    // A disabled row does nothing on a press and keeps the disabled ink.
    const disabled = screen.getByTestId("disabled");
    expect(disabled).toHaveAttribute("data-disabled", "true");
    expect(disabled).not.toHaveAttribute("data-interactive");
    expect(disabled).not.toHaveAttribute("data-danger");

    // Only the row: its hit element is a child, which takes the press and the focus.
    const split = screen.getByTestId("split");
    expect(split).toHaveClass(listRowStyles.row);
    expect(split).not.toHaveClass(listRowStyles.hit);
    expect(split).not.toHaveAttribute("data-interactive");
    expect(split).not.toHaveAttribute("data-focus");
  });

  it("hold the check's place while not chosen", () => {
    render(
      <>
        <span data-testid="off">
          <MenuRowCheck checked={false} />
        </span>
        <span data-testid="on">
          <MenuRowCheck checked />
        </span>
      </>,
    );
    const off = screen.getByTestId("off").firstElementChild as HTMLElement;
    expect(off).toHaveClass(listRowStyles.check);
    expect(off).toHaveAttribute("aria-hidden", "true");
    expect(off).toBeEmptyDOMElement();
    expect(screen.getByTestId("on").querySelector("svg")).not.toBeNull();
  });

  it("a row that takes real focus shows it as the fill, never a ring", () => {
    const css = "src/internal/listRow.module.css";
    expect(cssValue(cssRule(css, '.hit[data-focus="fill"]:focus-visible'), "outline")).toBe("none");
    expect(cssValue(cssRule(css, '.row.hit[data-focus="fill"]:focus-visible'), "background")).toBe(
      "var(--prime-color-fill-subtle)",
    );
  });
});
