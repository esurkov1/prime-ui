import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
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

  it("turns an icon at an edge into a segment and leaves middle and icon-only alone", () => {
    const { container } = render(
      <>
        <Badge.Root data-testid="lead">
          <Badge.Icon>
            <svg />
          </Badge.Icon>
          Готово
        </Badge.Root>
        <Badge.Root data-testid="trail">
          Ссылка
          <Badge.Icon>
            <svg />
          </Badge.Icon>
        </Badge.Root>
        <Badge.Root data-testid="only">
          <Badge.Icon>
            <svg />
          </Badge.Icon>
        </Badge.Root>
      </>,
    );
    const lead = screen.getByTestId("lead");
    expect(lead).toHaveAttribute("data-icon-start", "true");
    expect(lead.querySelector("[data-edge]")).toHaveAttribute("data-edge", "start");
    const trail = screen.getByTestId("trail");
    expect(trail).toHaveAttribute("data-icon-end", "true");
    expect(trail.querySelector("[data-edge]")).toHaveAttribute("data-edge", "end");
    const only = screen.getByTestId("only");
    expect(only).toHaveAttribute("data-icon-only", "true");
    expect(only).not.toHaveAttribute("data-icon-start");
    expect(container.querySelectorAll("[data-edge]")).toHaveLength(2);
  });

  describe("interactive", () => {
    it("onRemove adds a named remove segment; disabled disables it", async () => {
      const onRemove = vi.fn();
      const { rerender } = render(
        <Badge.Root data-testid="b" labels={{ remove: "Убрать «Москва»" }} onRemove={onRemove}>
          Москва
        </Badge.Root>,
      );
      expect(screen.getByTestId("b")).toHaveAttribute("data-removable", "true");
      await userEvent.click(screen.getByRole("button", { name: "Убрать «Москва»" }));
      expect(onRemove).toHaveBeenCalledTimes(1);
      rerender(
        <Badge.Root disabled onRemove={onRemove}>
          Москва
        </Badge.Root>,
      );
      expect(screen.getByRole("button", { name: "Удалить" })).toBeDisabled();
    });

    it("a read-only badge stays one element", () => {
      render(<Badge.Root data-testid="b">12</Badge.Root>);
      expect(screen.getByTestId("b").children).toHaveLength(0);
      expect(screen.queryByRole("button")).toBeNull();
    });

    it("onPress makes the body a toggle button with aria-pressed", async () => {
      const onPress = vi.fn();
      render(
        <Badge.Root onPress={onPress} pressed>
          GET
        </Badge.Root>,
      );
      const button = screen.getByRole("button", { name: "GET" });
      expect(button).toHaveAttribute("aria-pressed", "true");
      expect(button.closest("[data-pressable]")).toHaveAttribute("data-pressed", "true");
      await userEvent.click(button);
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("Badge.Action sits outside the text and reports reveal or persistent", async () => {
      const onHide = vi.fn();
      const { rerender } = render(
        <Badge.Root onPress={() => {}} data-testid="b">
          billing
          <Badge.Action label="Скрыть billing" onClick={onHide} />
        </Badge.Root>,
      );
      expect(screen.getByTestId("b")).toHaveAttribute("data-action", "reveal");
      expect(screen.getByRole("button", { name: "billing" })).not.toHaveTextContent("Скрыть");
      await userEvent.click(screen.getByRole("button", { name: "Скрыть billing" }));
      expect(onHide).toHaveBeenCalledTimes(1);
      rerender(
        <Badge.Root onPress={() => {}} data-testid="b">
          billing
          <Badge.Action label="Скрыть billing" onClick={onHide} persistent disabled />
        </Badge.Root>,
      );
      expect(screen.getByTestId("b")).toHaveAttribute("data-action", "persistent");
      expect(screen.getByRole("button", { name: "Скрыть billing" })).toBeDisabled();
    });

    it("tab order: body, then the action", async () => {
      render(
        <Badge.Root onPress={() => {}}>
          GET
          <Badge.Action label="Скрыть GET" onClick={() => {}} />
        </Badge.Root>,
      );
      await userEvent.tab();
      expect(screen.getByRole("button", { name: "GET" })).toHaveFocus();
      await userEvent.tab();
      expect(screen.getByRole("button", { name: "Скрыть GET" })).toHaveFocus();
    });

    it("a leading icon is a start segment; the end edge belongs to remove", () => {
      render(
        <Badge.Root data-testid="b" onRemove={() => {}}>
          <Badge.Icon>
            <svg />
          </Badge.Icon>
          Почта
          <Badge.Icon>
            <svg />
          </Badge.Icon>
        </Badge.Root>,
      );
      const badge = screen.getByTestId("b");
      expect(badge).toHaveAttribute("data-icon-start", "true");
      expect(badge).not.toHaveAttribute("data-icon-end");
      expect(badge).not.toHaveAttribute("data-icon-only");
      expect(badge.querySelectorAll("[data-edge]")).toHaveLength(1);
    });
  });

  it("a leading dot is a start segment too", () => {
    render(
      <Badge.Root data-testid="b" color="green">
        <Badge.Dot />
        Оплачен
      </Badge.Root>,
    );
    const badge = screen.getByTestId("b");
    expect(badge).toHaveAttribute("data-icon-start", "true");
    expect(badge.querySelector("[data-edge]")).toHaveAttribute("aria-hidden", "true");
  });
});
