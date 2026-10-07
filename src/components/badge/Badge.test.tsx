import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IconHouse } from "@/icons";
import iconStyles from "@/icons/Icon.module.css";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import type { PaletteColor } from "@/internal/states";
import { Badge } from "./Badge";
import styles from "./Badge.module.css";

const colorsForMatrix: PaletteColor[] = ["gray", "red", "blue", "green", "orange"];
const allColors: PaletteColor[] = [
  "gray",
  "red",
  "blue",
  "green",
  "orange",
  "yellow",
  "purple",
  "sky",
  "pink",
  "teal",
];
const pillVariants = ["solid", "soft", "outline"] as const;

describe("Badge", () => {
  it("renders", () => {
    render(<Badge.Root>Label</Badge.Root>);
    expect(screen.getByText("Label")).toBeInTheDocument();
  });

  it.each(colorsForMatrix)("sets data-color=%s", (color) => {
    render(<Badge.Root color={color}>x</Badge.Root>);
    expect(screen.getByText("x").closest("[data-color]")).toHaveAttribute("data-color", color);
  });

  it.each(pillVariants)("sets data-variant=%s", (variant) => {
    render(<Badge.Root variant={variant}>x</Badge.Root>);
    expect(screen.getByText("x").closest("[data-variant]")).toHaveAttribute(
      "data-variant",
      variant,
    );
  });

  it("passes the badge tier to nested Icon via ControlSizeProvider", () => {
    render(
      <Badge.Root size="xl">
        <IconHouse data-testid="badge-icon" />
      </Badge.Root>,
    );
    expect(screen.getByTestId("badge-icon")).toHaveClass(iconStyles.sizeXl);
  });

  it('sets data-disabled="true" when disabled', () => {
    render(<Badge.Root disabled>off</Badge.Root>);
    expect(screen.getByText("off")).toHaveAttribute("data-disabled", "true");
  });

  it("does not set data-disabled when not disabled", () => {
    render(<Badge.Root>on</Badge.Root>);
    expect(screen.getByText("on")).not.toHaveAttribute("data-disabled");
  });

  it("renders Icon", () => {
    render(
      <Badge.Root>
        <Badge.Icon>
          <svg data-testid="icon-svg" viewBox="0 0 1 1" />
        </Badge.Icon>
        Text
      </Badge.Root>,
    );
    expect(screen.getByTestId("icon-svg")).toBeInTheDocument();
  });

  it("renders Dot", () => {
    const { container } = render(
      <Badge.Root>
        <Badge.Dot />
        Live
      </Badge.Root>,
    );
    expect(container.querySelector(`.${styles.dot}`)).toBeInTheDocument();
  });

  it("merges className on Root", () => {
    render(<Badge.Root className="custom-root">x</Badge.Root>);
    expect(screen.getByText("x")).toHaveClass("custom-root");
  });

  it("merges className on Icon", () => {
    render(
      <Badge.Root>
        <Badge.Icon className="custom-icon">
          <span>i</span>
        </Badge.Icon>
      </Badge.Root>,
    );
    expect(screen.getByText("i").parentElement).toHaveClass("custom-icon");
  });

  it("merges className on Dot", () => {
    const { container } = render(
      <Badge.Root>
        <Badge.Dot className="custom-dot" />
      </Badge.Root>,
    );
    expect(container.querySelector(".custom-dot")).toBeInTheDocument();
  });

  it("defaults: gray, soft, m", () => {
    render(<Badge.Root>d</Badge.Root>);
    const el = screen.getByText("d");
    expect(el).toHaveAttribute("data-color", "gray");
    expect(el).toHaveAttribute("data-variant", "soft");
    expect(el).toHaveAttribute("data-size", "m");
  });

  it.each(allColors)("exposes data-color for extended palette: %s", (color) => {
    render(<Badge.Root color={color}>c</Badge.Root>);
    expect(screen.getByText("c")).toHaveAttribute("data-color", color);
  });

  it("supports size xs", () => {
    render(<Badge.Root size="xs">9</Badge.Root>);
    const el = screen.getByText("9");
    expect(el).toHaveAttribute("data-size", "xs");
    expect(el).toHaveAttribute("data-tier", "xs");
  });

  it("inside a control uses the badge tier one step down", () => {
    render(
      <ControlSizeProvider value="m">
        <Badge.Root>ctx</Badge.Root>
      </ControlSizeProvider>,
    );
    const el = screen.getByText("ctx");
    expect(el).toHaveAttribute("data-size", "m");
    expect(el).toHaveAttribute("data-tier", "s");
  });

  it("explicit size wins over context", () => {
    render(
      <ControlSizeProvider value="xl">
        <Badge.Root size="m">own</Badge.Root>
      </ControlSizeProvider>,
    );
    expect(screen.getByText("own")).toHaveAttribute("data-tier", "m");
  });

  it("marks icon-only badges", () => {
    render(
      <Badge.Root data-testid="io">
        <Badge.Icon>
          <span>i</span>
        </Badge.Icon>
      </Badge.Root>,
    );
    expect(screen.getByTestId("io")).toHaveAttribute("data-icon-only", "true");
  });
});
