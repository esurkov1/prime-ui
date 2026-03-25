import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IconHouse } from "@/icons";
import iconStyles from "@/icons/Icon.module.css";
import type { BadgeColor, BadgeVariant } from "./Badge";
import { Badge } from "./Badge";
import styles from "./Badge.module.css";

const colorsForMatrix: BadgeColor[] = ["gray", "red", "blue", "green", "orange"];
const allColors: BadgeColor[] = [
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
const pillVariants: BadgeVariant[] = ["filled", "light", "lighter", "stroke"];

describe("Badge", () => {
  it("renders", () => {
    render(<Badge.Root>Label</Badge.Root>);
    expect(screen.getByText("Label")).toBeInTheDocument();
  });

  it.each(colorsForMatrix)("sets data-color=%s", (color) => {
    render(<Badge.Root color={color}>x</Badge.Root>);
    expect(screen.getByText("x").closest("div")).toHaveAttribute("data-color", color);
  });

  it.each(pillVariants)("sets data-variant=%s", (variant) => {
    render(<Badge.Root variant={variant}>x</Badge.Root>);
    expect(screen.getByText("x").closest("div")).toHaveAttribute("data-variant", variant);
  });

  it("variant status sets role=status and data-status", () => {
    render(
      <Badge.Root variant="status" status="busy" label="User is busy">
        Busy
      </Badge.Root>,
    );
    const el = screen.getByRole("status", { name: "User is busy" });
    expect(el).toHaveAttribute("data-variant", "status");
    expect(el).toHaveAttribute("data-status", "busy");
  });

  it.each(["online", "offline", "away", "busy"] as const)("variant status: data-status=%s", (s) => {
    render(
      <Badge.Root variant="status" status={s}>
        {s}
      </Badge.Root>,
    );
    expect(screen.getByText(s)).toHaveAttribute("data-status", s);
  });

  it("variant status defaults data-status to online when status omitted", () => {
    render(<Badge.Root variant="status">On</Badge.Root>);
    expect(screen.getByText("On")).toHaveAttribute("data-status", "online");
  });

  it.each(["s", "m", "l", "xl"] as const)("variant status sets data-size=%s", (size) => {
    render(
      <Badge.Root variant="status" size={size}>
        x
      </Badge.Root>,
    );
    expect(screen.getByText("x")).toHaveAttribute("data-size", size);
  });

  it("variant status passes ControlSizeProvider to children for Icon", () => {
    const { rerender } = render(
      <Badge.Root variant="status" size="xl">
        <IconHouse data-testid="status-icon" />
      </Badge.Root>,
    );
    expect(screen.getByTestId("status-icon")).toHaveClass(iconStyles.sizeXl);
    rerender(
      <Badge.Root variant="status" size="s">
        <IconHouse data-testid="status-icon" />
      </Badge.Root>,
    );
    expect(screen.getByTestId("status-icon")).toHaveClass(iconStyles.sizeS);
  });

  it("variant status merges className", () => {
    render(
      <Badge.Root variant="status" status="offline" className="sb-custom">
        Off
      </Badge.Root>,
    );
    expect(screen.getByText("Off")).toHaveClass("sb-custom");
  });

  it.each(["s", "m", "l", "xl"] as const)("sets data-size=%s", (size) => {
    render(<Badge.Root size={size}>x</Badge.Root>);
    expect(screen.getByText("x")).toHaveAttribute("data-size", size);
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

  it("defaults: gray, light, m", () => {
    render(<Badge.Root>d</Badge.Root>);
    const el = screen.getByText("d");
    expect(el).toHaveAttribute("data-color", "gray");
    expect(el).toHaveAttribute("data-variant", "light");
    expect(el).toHaveAttribute("data-size", "m");
  });

  it.each(allColors)("exposes data-color for extended palette: %s", (color) => {
    render(<Badge.Root color={color}>c</Badge.Root>);
    expect(screen.getByText("c")).toHaveAttribute("data-color", color);
  });
});
