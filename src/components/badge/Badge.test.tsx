import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { iconBoxStyles } from "@/internal/iconBox";
import type { PaletteColor } from "@/internal/states";
import { cssRule, cssValue } from "@/test/css";
import { Badge } from "./Badge";
import styles from "./Badge.module.css";

const CSS = "src/components/badge/Badge.module.css";

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

/** The badge root around a text (the text itself sits in a `.text` span). */
const badgeOf = (text: string) => screen.getByText(text).closest(`.${styles.root}`);

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
        <Icon name="nav.home" data-testid="badge-icon" />
      </Badge.Root>,
    );
    expect(screen.getByTestId("badge-icon")).toHaveClass(iconBoxStyles.xl);
  });

  it('sets data-disabled="true" when disabled', () => {
    render(<Badge.Root disabled>off</Badge.Root>);
    expect(badgeOf("off")).toHaveAttribute("data-disabled", "true");
  });

  it("does not set data-disabled when not disabled", () => {
    render(<Badge.Root>on</Badge.Root>);
    expect(badgeOf("on")).not.toHaveAttribute("data-disabled");
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

  it("a standalone Dot takes the tier of the surrounding control", () => {
    const { container } = render(
      <>
        <Badge.Dot data-testid="plain" />
        <ControlSizeProvider value="l">
          <Badge.Dot data-testid="large" />
        </ControlSizeProvider>
      </>,
    );
    expect(screen.getByTestId("plain")).toHaveAttribute("data-size", "m");
    expect(screen.getByTestId("large")).toHaveAttribute("data-size", "l");
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
  });

  it("merges className on Root", () => {
    render(<Badge.Root className="custom-root">x</Badge.Root>);
    expect(badgeOf("x")).toHaveClass("custom-root");
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
    const el = badgeOf("d");
    expect(el).toHaveAttribute("data-color", "gray");
    expect(el).toHaveAttribute("data-variant", "soft");
    expect(el).toHaveAttribute("data-size", "m");
  });

  it.each(allColors)("exposes data-color for extended palette: %s", (color) => {
    render(<Badge.Root color={color}>c</Badge.Root>);
    expect(badgeOf("c")).toHaveAttribute("data-color", color);
  });

  it("a status tone takes the role colors instead of a hue; neutral is gray", () => {
    render(
      <>
        <Badge.Root tone="danger">Просрочен</Badge.Root>
        <Badge.Root tone="neutral">Черновик</Badge.Root>
      </>,
    );
    expect(badgeOf("Просрочен")).toHaveAttribute("data-tone", "danger");
    expect(badgeOf("Просрочен")).not.toHaveAttribute("data-color");
    expect(badgeOf("Черновик")).toHaveAttribute("data-color", "gray");
    expect(cssValue(cssRule(CSS, '.root[data-tone="danger"]'), "--badge-soft")).toBe(
      "var(--prime-color-danger-soft)",
    );
    // @ts-expect-error: a status tone and a category hue never go together
    const both = <Badge.Root tone="success" color="red" />;
    expect(both.props.tone).toBe("success");
  });

  it("shape square is a tile as wide as it is tall", () => {
    render(<Badge.Root shape="square">PDF</Badge.Root>);
    expect(badgeOf("PDF")).toHaveAttribute("data-shape", "square");
    expect(cssValue(cssRule(CSS, '.root[data-shape="square"]'), "width")).toBe("var(--chip-h)");
  });

  it("a Dot of its own hue paints the solid step", () => {
    const { container } = render(<Badge.Dot color="purple" />);
    const dot = container.querySelector(`.${styles.dot}`);
    expect(dot).toHaveAttribute("data-color", "purple");
    expect(cssValue(cssRule(CSS, ".dot[data-color]::before"), "background")).toBe(
      "var(--hue-solid)",
    );
  });

  it("an icon-only badge named by aria-label is an image of that name", () => {
    render(
      <Badge.Root aria-label="Почта">
        <Badge.Icon>
          <span>@</span>
        </Badge.Icon>
      </Badge.Root>,
    );
    expect(screen.getByRole("img", { name: "Почта" })).toHaveAttribute("data-icon-only", "true");
  });

  it("supports size xs", () => {
    render(<Badge.Root size="xs">9</Badge.Root>);
    const el = badgeOf("9");
    expect(el).toHaveAttribute("data-size", "xs");
    expect(el).toHaveAttribute("data-tier", "xs");
  });

  it("inside a control uses the badge tier one step down", () => {
    render(
      <ControlSizeProvider value="m">
        <Badge.Root>ctx</Badge.Root>
      </ControlSizeProvider>,
    );
    const el = badgeOf("ctx");
    expect(el).toHaveAttribute("data-size", "m");
    expect(el).toHaveAttribute("data-tier", "s");
  });

  it("explicit size wins over context", () => {
    render(
      <ControlSizeProvider value="xl">
        <Badge.Root size="m">own</Badge.Root>
      </ControlSizeProvider>,
    );
    expect(badgeOf("own")).toHaveAttribute("data-tier", "m");
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

    it("a read-only text badge stays one element that ellipsizes itself", () => {
      render(<Badge.Root data-testid="b">Москва {12}</Badge.Root>);
      const root = screen.getByTestId("b");
      expect(root.children).toHaveLength(0);
      expect(root).toHaveAttribute("data-text-only", "true");
      expect(root).toHaveTextContent("Москва 12");
      expect(screen.queryByRole("button")).toBeNull();
    });

    it("in a flex row a text run sits in one block span; its outer spaces stay outside", () => {
      render(
        <Badge.Root defaultPressed={false}>
          {"НЕ "}
          <span>billing</span>
        </Badge.Root>,
      );
      const button = screen.getByRole("button", { name: "НЕ billing" });
      expect(button.querySelector(`.${styles.text}`)).toHaveTextContent(/^НЕ$/);
      expect(button.closest(`.${styles.root}`)).not.toHaveAttribute("data-text-only");
    });

    it("the pressed triad makes the body a toggle button; controlled it only asks", async () => {
      const onPressedChange = vi.fn();
      render(
        <Badge.Root pressed onPressedChange={onPressedChange}>
          GET
        </Badge.Root>,
      );
      const button = screen.getByRole("button", { name: "GET" });
      expect(button).toHaveAttribute("aria-pressed", "true");
      expect(button.closest("[data-pressable]")).toHaveAttribute("data-pressed", "true");
      await userEvent.click(button);
      expect(onPressedChange).toHaveBeenCalledWith(false);
      expect(button).toHaveAttribute("aria-pressed", "true");
    });

    it("defaultPressed flips on click, Enter and Space", async () => {
      const onPressedChange = vi.fn();
      render(
        <Badge.Root defaultPressed={false} onPressedChange={onPressedChange}>
          Москва
        </Badge.Root>,
      );
      const button = screen.getByRole("button", { name: "Москва" });
      const root = button.closest(`.${styles.root}`);
      expect(button).toHaveAttribute("aria-pressed", "false");
      expect(root).not.toHaveAttribute("data-pressed");
      const user = userEvent.setup();
      await user.click(button);
      expect(button).toHaveAttribute("aria-pressed", "true");
      expect(root).toHaveAttribute("data-pressed", "true");
      await user.keyboard("{Enter}");
      expect(button).toHaveAttribute("aria-pressed", "false");
      await user.keyboard(" ");
      expect(button).toHaveAttribute("aria-pressed", "true");
      expect(onPressedChange.mock.calls).toEqual([[true], [false], [true]]);
    });

    it("a read-only badge has no button and takes no click handler", () => {
      // @ts-expect-error: a click on a span is no control; a pressable chip is the toggle
      render(<Badge.Root onClick={() => {}}>Черновик</Badge.Root>);
      expect(screen.queryByRole("button")).toBeNull();
    });

    it("Badge.Action sits outside the text and reports reveal or persistent", async () => {
      const onHide = vi.fn();
      const { rerender } = render(
        <Badge.Root defaultPressed={false} data-testid="b">
          billing
          <Badge.Action label="Скрыть billing" onClick={onHide} />
        </Badge.Root>,
      );
      expect(screen.getByTestId("b")).toHaveAttribute("data-action", "reveal");
      expect(screen.getByRole("button", { name: "billing" })).not.toHaveTextContent("Скрыть");
      await userEvent.click(screen.getByRole("button", { name: "Скрыть billing" }));
      expect(onHide).toHaveBeenCalledTimes(1);
      rerender(
        <Badge.Root defaultPressed={false} data-testid="b">
          billing
          <Badge.Action label="Скрыть billing" onClick={onHide} persistent disabled />
        </Badge.Root>,
      );
      expect(screen.getByTestId("b")).toHaveAttribute("data-action", "persistent");
      expect(screen.getByRole("button", { name: "Скрыть billing" })).toBeDisabled();
    });

    it("tab order: body, then the action", async () => {
      render(
        <Badge.Root defaultPressed={false}>
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

describe("Badge async onRemove", () => {
  function deferred() {
    let resolve: () => void = () => {};
    let reject: (reason: unknown) => void = () => {};
    const promise = new Promise<void>((done, fail) => {
      resolve = done;
      reject = fail;
    });
    return { promise, resolve, reject };
  }

  it("waits busy with a spinner in the segment and takes no second press", async () => {
    const save = deferred();
    const onRemove = vi.fn(() => save.promise);
    render(
      <Badge.Root data-testid="b" labels={{ remove: "Убрать «Москва»" }} onRemove={onRemove}>
        Москва
      </Badge.Root>,
    );
    const button = screen.getByRole("button", { name: "Убрать «Москва»" });
    await userEvent.click(button);
    const badge = screen.getByTestId("b");
    expect(badge).toHaveAttribute("aria-busy", "true");
    expect(badge).toHaveAttribute("data-pending", "true");
    expect(button).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(button);
    expect(onRemove).toHaveBeenCalledTimes(1);

    await act(async () => {
      save.resolve();
    });
    expect(badge).not.toHaveAttribute("aria-busy");
  });

  it("reject keeps the badge and announces the failure", async () => {
    const save = deferred();
    render(
      <Badge.Root
        data-testid="b"
        labels={{ remove: "Убрать «Москва»", removeFailed: "Фильтр «Москва» не убран" }}
        onRemove={() => save.promise}
      >
        Москва
      </Badge.Root>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Убрать «Москва»" }));
    await act(async () => {
      save.reject(new Error("offline"));
    });
    expect(screen.getByTestId("b")).not.toHaveAttribute("aria-busy");
    expect(screen.getByRole("status")).toHaveTextContent("Фильтр «Москва» не убран");
  });

  it("resolve after the owner took it out: the badge is gone", async () => {
    function Filters() {
      const [shown, setShown] = React.useState(true);
      return shown ? (
        <Badge.Root
          labels={{ remove: "Убрать «Москва»" }}
          onRemove={async () => {
            await Promise.resolve();
            setShown(false);
          }}
        >
          Москва
        </Badge.Root>
      ) : null;
    }
    render(<Filters />);
    await userEvent.click(screen.getByRole("button", { name: "Убрать «Москва»" }));
    expect(screen.queryByText("Москва")).toBeNull();
  });
});
