import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cssRule, cssValue } from "@/test/css";

import { Divider } from "./Divider";

const CSS = "src/components/divider/Divider.module.css";

describe("Divider", () => {
  it("renders horizontal by default", () => {
    render(<Divider />);

    const el = screen.getByRole("separator");
    expect(el).toHaveAttribute("data-orientation", "horizontal");
    expect(el).toHaveAttribute("data-size", "m");
    expect(el).not.toHaveAttribute("aria-orientation");
  });

  it("sets data-size from the size prop", () => {
    render(<Divider size="xl" />);
    expect(screen.getByRole("separator")).toHaveAttribute("data-size", "xl");
  });

  it("renders with text children", () => {
    render(<Divider>Label</Divider>);

    expect(screen.getByText("Label")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("renders vertical orientation", () => {
    render(<Divider orientation="vertical" />);

    const el = screen.getByRole("separator");
    expect(el).toHaveAttribute("data-orientation", "vertical");
    expect(el).toHaveAttribute("aria-orientation", "vertical");
  });

  it("sets data-align for start, center, and end", () => {
    const { rerender } = render(<Divider align="start">A</Divider>);
    expect(screen.getByRole("separator")).toHaveAttribute("data-align", "start");

    rerender(<Divider align="center">A</Divider>);
    expect(screen.getByRole("separator")).toHaveAttribute("data-align", "center");

    rerender(<Divider align="end">A</Divider>);
    expect(screen.getByRole("separator")).toHaveAttribute("data-align", "end");
  });

  it("takes a role override and forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(<Divider ref={ref} role="presentation" />);
    expect(screen.queryByRole("separator")).toBeNull();
    expect(ref.current).toBe(container.firstChild);
  });

  it("merges className", () => {
    render(<Divider className="custom-divider" />);
    expect(screen.getByRole("separator")).toHaveClass("custom-divider");
  });

  it("false, null and empty children draw a plain line, with no label box", () => {
    const { container, rerender } = render(<Divider>{false}</Divider>);
    expect(container.firstElementChild).toBeEmptyDOMElement();
    rerender(<Divider>{""}</Divider>);
    expect(container.firstElementChild).toBeEmptyDOMElement();
    rerender(<Divider>{[null, false]}</Divider>);
    expect(container.firstElementChild).toBeEmptyDOMElement();
    expect(screen.getByRole("separator")).not.toHaveAttribute("aria-labelledby");
  });

  it("a labelled separator is named by its label; an explicit name wins", () => {
    const { rerender } = render(<Divider>или</Divider>);
    expect(screen.getByRole("separator", { name: "или" })).toBeInTheDocument();
    rerender(<Divider aria-label="Безопасность">🔒</Divider>);
    const separator = screen.getByRole("separator", { name: "Безопасность" });
    expect(separator).not.toHaveAttribute("aria-labelledby");
  });

  it("takes the host tier without its own size", () => {
    render(
      <ControlSizeProvider value="s">
        <Divider>Раздел</Divider>
      </ControlSizeProvider>,
    );
    expect(screen.getByRole("separator")).toHaveAttribute("data-size", "s");
  });

  it("inset: a vertical line one text line tall with the tier gap around it", () => {
    render(<Divider orientation="vertical" inset />);
    expect(screen.getByRole("separator")).toHaveAttribute("data-inset", "true");
    const rule = cssRule(CSS, '.root[data-inset="true"][data-orientation="vertical"]');
    expect(cssValue(rule, "height")).toBe("var(--field-lh)");
    expect(cssValue(rule, "margin-inline")).toBe("var(--field-gap)");
  });

  it("a host bleeds the line across its padding through --divider-bleed", () => {
    const root = cssRule(CSS, ".root");
    expect(cssValue(root, "--divider-bleed-size")).toBe(
      "var(--divider-bleed, var(--prime-space-0))",
    );
    expect(
      cssValue(cssRule(CSS, '.root:not([data-orientation="vertical"])'), "margin-inline"),
    ).toBe("calc(var(--prime-space-0) - var(--divider-bleed-size))");
  });

  it("defaults align to center and does not set data-variant", () => {
    render(<Divider>Section</Divider>);
    const el = screen.getByRole("separator");
    expect(el).toHaveAttribute("data-align", "center");
    expect(el).not.toHaveAttribute("data-variant");
  });
});
