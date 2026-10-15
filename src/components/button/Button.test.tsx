import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { DisabledProvider } from "@/internal/disabledContext";
import press from "@/internal/press.module.css";
import { cssRule, cssValue } from "@/test/css";

import { Button } from "./Button";
import styles from "./Button.module.css";

const CSS = "src/components/button/Button.module.css";

describe("Button", () => {
  it("takes the host tier without its own size; an explicit size wins", () => {
    render(
      <ControlSizeProvider value="s">
        <Button.Root>Host</Button.Root>
        <Button.Root size="l">Own</Button.Root>
      </ControlSizeProvider>,
    );
    expect(screen.getByRole("button", { name: "Host" })).toHaveAttribute("data-size", "s");
    expect(screen.getByRole("button", { name: "Own" })).toHaveAttribute("data-size", "l");
  });

  it("defaults to m outside a host", () => {
    render(<Button.Root>Save</Button.Root>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("data-size", "m");
  });

  it("renders and handles click", () => {
    const onClick = vi.fn();
    render(<Button.Root onClick={onClick}>Save</Button.Root>);

    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("defaults to variant solid, tone accent, size m", () => {
    render(<Button.Root>Save</Button.Root>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("data-variant", "solid");
    expect(button).toHaveAttribute("data-tone", "accent");
    expect(button).toHaveAttribute("data-size", "m");
  });

  it("takes the host's text color with tone inherit and stays a keyboard button", () => {
    const onClick = vi.fn();
    render(
      <Button.Root variant="ghost" tone="inherit" aria-label="Закрыть" onClick={onClick}>
        <Button.Icon>x</Button.Icon>
      </Button.Root>,
    );
    const button = screen.getByRole("button", { name: "Закрыть" });
    expect(button).toHaveAttribute("data-tone", "inherit");
    expect(button).toHaveAttribute("data-variant", "ghost");
    button.focus();
    expect(button).toHaveFocus();
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("allows tone inherit only without the solid treatment", () => {
    render(
      <>
        <Button.Root variant="soft" tone="inherit">
          Soft
        </Button.Root>
        {/* @ts-expect-error inherit has no solid fill: a currentColor wash cannot be a solid */}
        <Button.Root variant="solid" tone="inherit">
          Solid
        </Button.Root>
      </>,
    );
    expect(screen.getByRole("button", { name: "Soft" })).toHaveAttribute("data-variant", "soft");
  });

  it("sets data-disabled when disabled", () => {
    render(<Button.Root disabled>Off</Button.Root>);
    expect(screen.getByRole("button", { name: "Off" })).toHaveAttribute("data-disabled", "true");
  });

  it("is disabled while loading", () => {
    render(<Button.Root loading>Submitting</Button.Root>);

    const button = screen.getByRole("button", { name: "Submitting" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("data-loading", "true");
    expect(button).toHaveAttribute("aria-busy", "true");
    // Busy, not unavailable: no disabled look while loading.
    expect(button).not.toHaveAttribute("data-disabled");
  });

  it("supports explicit submit type", () => {
    render(<Button.Root type="submit">Submit form</Button.Root>);
    expect(screen.getByRole("button", { name: "Submit form" })).toHaveAttribute("type", "submit");
  });

  it("renders icon with aria-label when no visible label", () => {
    render(
      <Button.Root aria-label="Icon button">
        <Button.Icon>
          <span aria-hidden="true">x</span>
        </Button.Icon>
      </Button.Root>,
    );

    expect(screen.getByRole("button", { name: "Icon button" })).toBeInTheDocument();
  });

  it("sets data-full-width when fullWidth is true", () => {
    render(<Button.Root fullWidth>Wide</Button.Root>);

    expect(screen.getByRole("button", { name: "Wide" })).toHaveAttribute("data-full-width", "true");
  });

  it("renders the Spinner only while loading, hidden from screen readers", () => {
    const { rerender, container } = render(<Button.Root>Send</Button.Root>);
    expect(container.querySelector(`.${styles.spinner}`)).toBeNull();

    rerender(<Button.Root loading>Send</Button.Root>);
    expect(container.querySelector(`.${styles.spinner}`)).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  it("Button.Icon renders icon wrapper with aria-hidden", () => {
    const { container } = render(
      <Button.Root>
        <Button.Icon>→</Button.Icon>
        Send
      </Button.Root>,
    );
    const icon = container.querySelector(`.${styles.icon}`);
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });
});

describe("Button asChild", () => {
  it("renders as <a> when child is an anchor", () => {
    render(
      <Button.Root asChild>
        <a href="/path">Go</a>
      </Button.Root>,
    );
    const link = screen.getByRole("link", { name: "Go" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/path");
  });

  it("wraps the link's text in the label part, so a host can fold it to its icon", () => {
    render(
      <div data-button-label="icon">
        <Button.Root asChild>
          <a href="/export">
            <Button.Icon>
              <svg />
            </Button.Icon>
            Экспорт
          </a>
        </Button.Root>
      </div>,
    );
    const link = screen.getByRole("link", { name: "Экспорт" });
    expect(link).toHaveAttribute("data-leading-icon", "true");
    // The fold hides the element children beside the icon: no bare text node stays painted.
    const bare = [...link.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE);
    expect(bare).toEqual([]);
    expect(link.lastElementChild).toHaveTextContent("Экспорт");
    expect(link.lastElementChild).not.toHaveClass(styles.icon);
  });

  it("merges Button className onto the child", () => {
    const { container } = render(
      <Button.Root asChild className="extra">
        <a href="/">Link</a>
      </Button.Root>,
    );
    const link = container.querySelector("a");
    expect(link).toHaveClass(styles.root);
    expect(link).toHaveClass("extra");
  });

  it("forwards data-variant, data-tone, data-size to the child", () => {
    render(
      <Button.Root variant="outline" tone="danger" asChild size="l">
        <a href="/">Link</a>
      </Button.Root>,
    );
    const link = screen.getByRole("link", { name: "Link" });
    expect(link).toHaveAttribute("data-variant", "outline");
    expect(link).toHaveAttribute("data-tone", "danger");
    expect(link).toHaveAttribute("data-size", "l");
  });

  it("sets aria-disabled (not disabled attr) when disabled", () => {
    render(
      <Button.Root asChild disabled>
        <a href="/">Disabled</a>
      </Button.Root>,
    );
    const link = screen.getByRole("link", { name: "Disabled" });
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).not.toHaveAttribute("disabled");
  });

  it("prevents navigation click when disabled", () => {
    render(
      <Button.Root asChild disabled>
        <a href="/path">Disabled Link</a>
      </Button.Root>,
    );
    const prevented = !fireEvent.click(screen.getByRole("link", { name: "Disabled Link" }));
    expect(prevented).toBe(true);
  });

  it("does not call user onClick when disabled", () => {
    const onClick = vi.fn();
    render(
      <Button.Root asChild disabled onClick={onClick}>
        <a href="/">Disabled</a>
      </Button.Root>,
    );
    fireEvent.click(screen.getByRole("link", { name: "Disabled" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("calls user onClick when not disabled", () => {
    const onClick = vi.fn();
    render(
      <Button.Root asChild onClick={onClick}>
        <a href="/">Link</a>
      </Button.Root>,
    );
    fireEvent.click(screen.getByRole("link", { name: "Link" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("sets aria-disabled + aria-busy when loading", () => {
    render(
      <Button.Root asChild loading>
        <a href="/">Loading</a>
      </Button.Root>,
    );
    const link = screen.getByRole("link", { name: "Loading" });
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("aria-busy", "true");
    expect(link).toHaveAttribute("data-loading", "true");
  });

  it("does not forward type attribute to child", () => {
    render(
      <Button.Root asChild type="submit">
        <a href="/">Link</a>
      </Button.Root>,
    );
    expect(screen.getByRole("link", { name: "Link" })).not.toHaveAttribute("type");
  });

  it("takes none of the long-action modes and needs one element child", () => {
    const progress = (
      // @ts-expect-error: progress needs a <button>
      <Button.Root asChild progress={0.5}>
        <a href="/">Link</a>
      </Button.Root>
    );
    const hold = (
      // @ts-expect-error: holdToConfirm needs a <button>
      <Button.Root asChild holdToConfirm>
        <a href="/">Link</a>
      </Button.Root>
    );
    expect(progress.props.asChild).toBe(true);
    expect(hold.props.asChild).toBe(true);
    expect(() =>
      render(
        // @ts-expect-error: asChild takes one element, not text
        <Button.Root asChild>Ссылка</Button.Root>,
      ),
    ).toThrow("Button.Root asChild needs a single element child");
  });

  it("a disabled link child leaves the Tab order and loses its href", async () => {
    render(
      <>
        <Button.Root asChild disabled>
          <a href="/reports">Отчёты</a>
        </Button.Root>
        <Button.Root>Дальше</Button.Root>
      </>,
    );
    const link = screen.getByRole("link", { name: "Отчёты" });
    expect(link).not.toHaveAttribute("href");
    expect(link).toHaveAttribute("tabIndex", "-1");
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Дальше" })).toHaveFocus();
  });

  describe("Button layout", () => {
    it("marks icon-only, leading and trailing icon layouts", () => {
      render(
        <>
          <Button.Root aria-label="Only">
            <Button.Icon>x</Button.Icon>
          </Button.Root>
          <Button.Root>
            <Button.Icon>x</Button.Icon>
            Lead
          </Button.Root>
          <Button.Root>
            Trail
            <Button.Icon>x</Button.Icon>
          </Button.Root>
        </>,
      );
      expect(screen.getByRole("button", { name: "Only" })).toHaveAttribute(
        "data-icon-only",
        "true",
      );
      const lead = screen.getByRole("button", { name: "Lead" });
      expect(lead).toHaveAttribute("data-leading-icon", "true");
      expect(lead).not.toHaveAttribute("data-trailing-icon");
      const trail = screen.getByRole("button", { name: "Trail" });
      expect(trail).toHaveAttribute("data-trailing-icon", "true");
      expect(trail).not.toHaveAttribute("data-icon-only");
    });

    it("renders the spinner over the label when loading without a leading icon", () => {
      const { container } = render(<Button.Root loading>Save</Button.Root>);
      const button = screen.getByRole("button", { name: "Save" });
      expect(container.querySelectorAll(`.${styles.spinner}`)).toHaveLength(1);
      expect(button).toHaveAttribute("data-loading-overlay", "true");
    });

    it("the leading icon's glyph cross-fades into the spinner and back", () => {
      const { container, rerender } = render(
        <Button.Root>
          <Button.Icon>
            <svg data-testid="glyph" />
          </Button.Icon>
          Save
        </Button.Root>,
      );
      const icon = container.querySelector(`.${styles.icon}`);
      rerender(
        <Button.Root loading>
          <Button.Icon>
            <svg data-testid="glyph" />
          </Button.Icon>
          Save
        </Button.Root>,
      );
      const button = screen.getByRole("button", { name: "Save" });
      // The same icon box holds the spinner: the width never changes, no overlay spinner.
      expect(container.querySelector(`.${styles.icon}`)).toBe(icon);
      expect(icon?.querySelector('[role="status"]')).not.toBeNull();
      expect(container.querySelector(`.${styles.spinner}`)).toBeNull();
      expect(button).not.toHaveAttribute("data-loading-overlay");
      rerender(
        <Button.Root>
          <Button.Icon>
            <svg data-testid="glyph" />
          </Button.Icon>
          Save
        </Button.Root>,
      );
      expect(icon?.querySelector("[data-entering] [data-testid='glyph']")).not.toBeNull();
    });

    it("accepts size xs", () => {
      render(<Button.Root size="xs">Tiny</Button.Root>);
      expect(screen.getByRole("button", { name: "Tiny" })).toHaveAttribute("data-size", "xs");
    });
  });
});

describe("Button shape circle", () => {
  const circle = (props: Partial<React.ComponentProps<typeof Button.Root>> = {}) => (
    <Button.Root shape="circle" aria-label="Обновить" {...(props as object)}>
      <Button.Icon>
        <svg aria-hidden="true" />
      </Button.Icon>
    </Button.Root>
  );

  it("is a disk named by aria-label, in every tier, tone and variant", () => {
    render(circle({ variant: "soft", tone: "neutral", size: "s" }));
    const button = screen.getByRole("button", { name: "Обновить" });
    expect(button).toHaveAttribute("data-shape", "circle");
    expect(button).toHaveAttribute("data-icon-only", "true");
    expect(button).toHaveAttribute("data-size", "s");
    expect(button).toHaveAttribute("data-variant", "soft");
  });

  it("is reached by Tab and pressed by Enter and Space", async () => {
    const onClick = vi.fn();
    render(circle({ onClick }));
    const user = userEvent.setup();
    await user.tab();
    const button = screen.getByRole("button", { name: "Обновить" });
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("follows the circle: full radius, compact press, round touch area, focus ring outline", () => {
    render(circle());
    const button = screen.getByRole("button", { name: "Обновить" });
    expect(button).toHaveClass(press.pressCompact);
    expect(button).not.toHaveClass(press.press);
    const disk = cssRule(CSS, '.root[data-shape="circle"]');
    expect(cssValue(disk, "width")).toBe("var(--btn-h)");
    expect(cssValue(disk, "border-radius")).toBe("var(--prime-radius-full)");
    expect(
      cssValue(
        cssRule(CSS, '.root[data-shape="circle"]::after', ["@media (pointer: coarse)"]),
        "border-radius",
      ),
    ).toBe("var(--prime-radius-full)");
    expect(cssValue(cssRule(CSS, ".root:focus-visible"), "outline")).toMatch(
      /^var\(--prime-focus-width\) solid/,
    );
  });

  it("asChild makes a round link", () => {
    render(
      <Button.Root asChild shape="circle" size="xl" aria-label="Скачать Счёт-2381.pdf">
        <a href="/files/2381.pdf" download>
          <Button.Icon>
            <svg aria-hidden="true" />
          </Button.Icon>
        </a>
      </Button.Root>,
    );
    const link = screen.getByRole("link", { name: "Скачать Счёт-2381.pdf" });
    expect(link).toHaveAttribute("data-shape", "circle");
    expect(link).toHaveAttribute("data-icon-only", "true");
    expect(link).toHaveAttribute("data-size", "xl");
    expect(link).toHaveAttribute("href", "/files/2381.pdf");
  });

  it("variant shade: the media shade with a blur; danger turns the danger disk", () => {
    render(circle({ variant: "shade", tone: "danger" }));
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", "shade");
    const shade = cssRule(CSS, '.root[data-variant="shade"]');
    expect(cssValue(shade, "--btn-bg")).toBe("var(--prime-color-media-disk)");
    expect(cssValue(shade, "backdrop-filter")).toBe("blur(var(--prime-media-disk-blur))");
    expect(
      cssValue(cssRule(CSS, '.root[data-variant="shade"][data-tone="danger"]'), "--btn-bg"),
    ).toBe("var(--prime-color-danger-default)");
  });

  it("variant glass: the glass of a floating bar, solid where transparency is reduced", () => {
    render(circle({ variant: "glass", tone: "neutral" }));
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", "glass");
    const glass = cssRule(CSS, '.root[data-variant="glass"]');
    expect(cssValue(glass, "--btn-bg")).toBe("var(--prime-color-bg-glass)");
    expect(cssValue(glass, "backdrop-filter")).toMatch(/^blur\(var\(--prime-glass-blur\)\)/);
    const solid = cssRule(CSS, '.root[data-variant="glass"]', [
      "@media (prefers-reduced-transparency: reduce)",
    ]);
    expect(cssValue(solid, "--btn-bg")).toBe("var(--prime-color-bg-glass-solid)");
    expect(cssValue(solid, "backdrop-filter")).toBe("none");
  });

  it("a changed icon cross-fades in Button.Icon", () => {
    const { rerender, container } = render(
      <Button.Root shape="circle" aria-label="Воспроизвести">
        <Button.Icon>
          <svg key="play" aria-hidden="true" />
        </Button.Icon>
      </Button.Root>,
    );
    rerender(
      <Button.Root shape="circle" aria-label="Пауза">
        <Button.Icon>
          <svg key="pause" aria-hidden="true" />
        </Button.Icon>
      </Button.Root>,
    );
    expect(container.querySelector(`.${styles.glyph}[data-entering]`)).not.toBeNull();
  });
});

describe("Button motion", () => {
  describe("progress", () => {
    it("marks the button busy and drives the fill, then lets it go", () => {
      const { rerender } = render(<Button.Root progress={0.42}>Скачивание 42%</Button.Root>);
      const button = screen.getByRole("button", { name: "Скачивание 42%" });
      expect(button).toHaveAttribute("aria-busy", "true");
      expect(button).toHaveAttribute("data-progress", "true");
      expect(button.style.getPropertyValue("--btn-progress")).toBe("0.42");
      expect(button.querySelector(`.${styles.fill}`)).not.toBeNull();

      rerender(<Button.Root>Открыть файл</Button.Root>);
      const done = screen.getByRole("button", { name: "Открыть файл" });
      expect(done).not.toHaveAttribute("aria-busy");
      expect(done).not.toHaveAttribute("data-progress");
      // The fill stays mounted so its exit can play.
      expect(done.querySelector(`.${styles.fill}`)).not.toBeNull();
    });

    it("clamps the value to 0…1 and stays clickable", () => {
      const onClick = vi.fn();
      render(
        <Button.Root progress={1.7} onClick={onClick}>
          Скачивание
        </Button.Root>,
      );
      const button = screen.getByRole("button", { name: "Скачивание" });
      expect(button.style.getPropertyValue("--btn-progress")).toBe("1");
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("null on a square: a spinner marks it, the button stays pressable and busy", () => {
      const onClick = vi.fn();
      const { container } = render(
        <Button.Root progress={null} onClick={onClick}>
          Импорт
        </Button.Root>,
      );
      const button = screen.getByRole("button", { name: "Импорт" });
      expect(button).toHaveAttribute("aria-busy", "true");
      expect(button).toHaveAttribute("data-loading-overlay", "true");
      expect(button).not.toHaveAttribute("data-progress");
      expect(button).not.toBeDisabled();
      expect(container.querySelector(`.${styles.spinner}`)).not.toBeNull();
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("circle progress", () => {
    const disk = (progress?: number | null) => (
      <Button.Root shape="circle" aria-label="Отменить отправку" progress={progress}>
        <Button.Icon>
          <svg aria-hidden="true" />
        </Button.Icon>
      </Button.Root>
    );
    const ringOf = (button: HTMLElement) =>
      button.querySelector<SVGSVGElement>(`svg.${styles.ring}`);

    it("draws a turning ring along the inner edge instead of a fill, pressable and busy", () => {
      render(disk(0.4));
      const button = screen.getByRole("button", { name: "Отменить отправку" });
      expect(button).toHaveAttribute("aria-busy", "true");
      expect(button).not.toBeDisabled();
      expect(button.querySelector(`.${styles.fill}`)).toBeNull();
      const ring = ringOf(button);
      expect(ring).toHaveAttribute("aria-hidden", "true");
      expect(ring).toHaveAttribute("data-spin", "true");
      expect(ring).toHaveAttribute("data-weight", "line");
      expect(ring).toHaveAttribute("data-shown", "true");
      expect(ring?.style.getPropertyValue("--ring-value")).toBe("0.4");
    });

    it("null turns a quarter arc; removed, the ring fades where it is", () => {
      const { rerender } = render(disk(null));
      const button = screen.getByRole("button");
      expect(ringOf(button)?.style.getPropertyValue("--ring-value")).toBe("0.25");
      rerender(disk(0.8));
      expect(ringOf(button)?.style.getPropertyValue("--ring-value")).toBe("0.8");
      rerender(disk());
      expect(button).not.toHaveAttribute("aria-busy");
      expect(ringOf(button)).toHaveAttribute("data-shown", "false");
      expect(ringOf(button)?.style.getPropertyValue("--ring-value")).toBe("0.8");
    });
  });

  describe("holdToConfirm", () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it("confirms only after a full hold", () => {
      vi.useFakeTimers();
      const onConfirm = vi.fn();
      render(
        <Button.Root tone="danger" holdToConfirm onConfirm={onConfirm}>
          Удалить проект
        </Button.Root>,
      );
      const button = screen.getByRole("button", { name: "Удалить проект" });

      fireEvent.pointerDown(button, { button: 0 });
      expect(button).toHaveAttribute("data-hold", "holding");
      act(() => vi.advanceTimersByTime(600));
      fireEvent.pointerUp(button);
      // Released early: the fill rolls back.
      expect(button).toHaveAttribute("data-hold", "cancel");
      act(() => vi.advanceTimersByTime(2000));
      expect(onConfirm).not.toHaveBeenCalled();

      fireEvent.pointerDown(button, { button: 0 });
      act(() => vi.advanceTimersByTime(1200));
      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(button).toHaveAttribute("data-hold", "done");
      fireEvent.pointerUp(button);
      // Completed: the fill fades where it is, no roll back.
      expect(button).toHaveAttribute("data-hold", "idle");
    });

    it("async onConfirm: loading with a full fill until it settles; resolve fades, reject rolls back", async () => {
      vi.useFakeTimers();
      let settle: { resolve: () => void; reject: (reason: unknown) => void } = {
        resolve: () => {},
        reject: () => {},
      };
      const onConfirm = vi.fn(
        () =>
          new Promise<void>((resolve, reject) => {
            settle = { resolve, reject };
          }),
      );
      render(
        <Button.Root tone="danger" holdToConfirm onConfirm={onConfirm}>
          Удалить проект
        </Button.Root>,
      );
      const button = screen.getByRole("button", { name: "Удалить проект" });

      fireEvent.pointerDown(button, { button: 0 });
      act(() => vi.advanceTimersByTime(1200));
      expect(button).toHaveAttribute("data-hold", "confirming");
      expect(button).toHaveAttribute("aria-busy", "true");
      expect(button).toHaveAttribute("data-loading", "true");
      expect(button).toBeDisabled();
      // The release does not end a confirm in flight.
      fireEvent.pointerUp(button);
      expect(button).toHaveAttribute("data-hold", "confirming");

      await act(async () => {
        settle.reject(new Error("offline"));
      });
      expect(button).toHaveAttribute("data-hold", "cancel");
      expect(button).not.toHaveAttribute("aria-busy");

      fireEvent.pointerDown(button, { button: 0 });
      act(() => vi.advanceTimersByTime(1200));
      expect(onConfirm).toHaveBeenCalledTimes(2);
      await act(async () => {
        settle.resolve();
      });
      expect(button).toHaveAttribute("data-hold", "idle");
      expect(button).not.toBeDisabled();
    });

    it("holds from the keyboard with Space and Enter; key repeat does not restart", () => {
      vi.useFakeTimers();
      const onConfirm = vi.fn();
      render(
        <Button.Root holdToConfirm onConfirm={onConfirm}>
          Удалить
        </Button.Root>,
      );
      const button = screen.getByRole("button", { name: "Удалить" });

      fireEvent.keyDown(button, { key: " " });
      act(() => vi.advanceTimersByTime(700));
      fireEvent.keyDown(button, { key: " ", repeat: true });
      act(() => vi.advanceTimersByTime(500));
      expect(onConfirm).toHaveBeenCalledTimes(1);
      fireEvent.keyUp(button, { key: " " });

      fireEvent.keyDown(button, { key: "Enter" });
      fireEvent.keyUp(button, { key: "Enter" });
      act(() => vi.advanceTimersByTime(2000));
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it("leaving the button or losing focus cancels", () => {
      vi.useFakeTimers();
      const onConfirm = vi.fn();
      render(
        <Button.Root holdToConfirm onConfirm={onConfirm}>
          Удалить
        </Button.Root>,
      );
      const button = screen.getByRole("button", { name: "Удалить" });
      fireEvent.pointerDown(button, { button: 0 });
      fireEvent.pointerLeave(button);
      fireEvent.keyDown(button, { key: "Enter" });
      fireEvent.blur(button);
      act(() => vi.advanceTimersByTime(2000));
      expect(onConfirm).not.toHaveBeenCalled();
    });

    it("describes the gesture outside the button name; labels override it", () => {
      render(
        <Button.Root holdToConfirm labels={{ holdHint: "Удерживайте 1 секунду" }}>
          Удалить
        </Button.Root>,
      );
      const button = screen.getByRole("button", { name: "Удалить" });
      expect(button).toHaveAccessibleDescription("Удерживайте 1 секунду");
    });

    it("a disabled button does not hold", () => {
      vi.useFakeTimers();
      const onConfirm = vi.fn();
      render(
        <Button.Root holdToConfirm disabled onConfirm={onConfirm}>
          Удалить
        </Button.Root>,
      );
      const button = screen.getByRole("button", { name: "Удалить" });
      fireEvent.keyDown(button, { key: " " });
      act(() => vi.advanceTimersByTime(2000));
      expect(onConfirm).not.toHaveBeenCalled();
    });
  });

  describe("label morph", () => {
    const motion = (reduce: boolean) =>
      vi.stubGlobal(
        "matchMedia",
        vi.fn((query: string) => ({
          matches: reduce && query.includes("reduce"),
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          onchange: null,
          dispatchEvent: vi.fn(),
        })),
      );

    afterEach(() => {
      vi.unstubAllGlobals();
      vi.useRealTimers();
    });

    it("plays the letters of a new label, keeps one accessible name, then settles to text", () => {
      vi.useFakeTimers();
      motion(false);
      const { rerender } = render(<Button.Root>Продолжить</Button.Root>);
      rerender(<Button.Root>Подтвердить</Button.Root>);
      const button = screen.getByRole("button", { name: "Подтвердить" });
      expect(button.querySelectorAll("[style*='--morph-i']").length).toBeGreaterThan(0);
      act(() => vi.advanceTimersByTime(1000));
      expect(button.querySelectorAll("[style*='--morph-i']")).toHaveLength(0);
      expect(button).toHaveTextContent("Подтвердить");
    });

    it("changes in place when only digits change (a running percentage) and under reduced motion", () => {
      motion(false);
      const { rerender } = render(<Button.Root>Повторить через 59 с</Button.Root>);
      rerender(<Button.Root>Повторить через 58 с</Button.Root>);
      let button = screen.getByRole("button", { name: "Повторить через 58 с" });
      expect(button.querySelectorAll("[aria-hidden='true']")).toHaveLength(0);

      rerender(<Button.Root progress={0.3}>Скачивание 30%</Button.Root>);
      rerender(<Button.Root progress={0.4}>Скачивание 40%</Button.Root>);
      button = screen.getByRole("button", { name: "Скачивание 40%" });
      expect(button.querySelectorAll("[style*='--morph-i']")).toHaveLength(0);

      motion(true);
      rerender(<Button.Root>Готово</Button.Root>);
      button = screen.getByRole("button", { name: "Готово" });
      expect(button.querySelectorAll("[style*='--morph-i']")).toHaveLength(0);
    });
  });
});

describe("Button — pressed", () => {
  it("a toggle sets aria-pressed both ways and data-pressed only when on", () => {
    const { rerender } = render(
      <Button.Root variant="ghost" tone="neutral" pressed={false}>
        Закрепить
      </Button.Root>,
    );
    const button = screen.getByRole("button", { name: "Закрепить" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).not.toHaveAttribute("data-pressed");
    rerender(
      <Button.Root variant="ghost" tone="neutral" pressed>
        Закрепить
      </Button.Root>,
    );
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAttribute("data-pressed", "true");
  });

  it("an ordinary button has no aria-pressed; asChild passes it on", () => {
    render(
      <>
        <Button.Root>Сохранить</Button.Root>
        <Button.Root asChild pressed>
          <a href="/favorites">Избранное</a>
        </Button.Root>
      </>,
    );
    expect(screen.getByRole("button", { name: "Сохранить" })).not.toHaveAttribute("aria-pressed");
    expect(screen.getByRole("link", { name: "Избранное" })).toHaveAttribute("aria-pressed", "true");
  });

  it("defaultPressed toggles on click, Enter and Space and reports the new state", async () => {
    const onPressedChange = vi.fn();
    render(
      <Button.Root variant="ghost" tone="neutral" defaultPressed onPressedChange={onPressedChange}>
        Закрепить
      </Button.Root>,
    );
    const button = screen.getByRole("button", { name: "Закрепить" });
    expect(button).toHaveAttribute("aria-pressed", "true");
    const user = userEvent.setup();
    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).not.toHaveAttribute("data-pressed");
    await user.keyboard("{Enter}");
    expect(button).toHaveAttribute("aria-pressed", "true");
    await user.keyboard(" ");
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(onPressedChange.mock.calls).toEqual([[false], [true], [false]]);
  });

  it("controlled pressed only asks; an onClick that prevents default keeps the state", async () => {
    const onPressedChange = vi.fn();
    const onClick = (event: React.MouseEvent) => event.preventDefault();
    render(
      <>
        <Button.Root pressed={false} onPressedChange={onPressedChange}>
          Уведомления
        </Button.Root>
        <Button.Root defaultPressed={false} onClick={onClick}>
          Звук
        </Button.Root>
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Уведомления" }));
    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("button", { name: "Уведомления" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    await userEvent.click(screen.getByRole("button", { name: "Звук" }));
    expect(screen.getByRole("button", { name: "Звук" })).toHaveAttribute("aria-pressed", "false");
  });

  it("the selected look covers pressed and the current page", () => {
    const selected = cssRule(
      CSS,
      '.root:is([aria-pressed="true"], [data-current="true"], [aria-current="page"])[data-variant]',
    );
    expect(cssValue(selected, "--btn-bg")).toBe("var(--prime-color-accent-soft)");
  });
});

describe("Button — current, density, align, host height", () => {
  it("current marks the page of a set: aria-current and the selected look", () => {
    render(
      <>
        <Button.Root variant="ghost" tone="neutral" current density="tight" aria-label="Страница 3">
          3
        </Button.Root>
        <Button.Root variant="ghost" tone="neutral" density="tight" aria-label="Страница 4">
          4
        </Button.Root>
      </>,
    );
    const page = screen.getByRole("button", { name: "Страница 3" });
    expect(page).toHaveAttribute("aria-current", "page");
    expect(page).toHaveAttribute("data-current", "true");
    expect(page).toHaveAttribute("data-density", "tight");
    expect(screen.getByRole("button", { name: "Страница 4" })).not.toHaveAttribute("aria-current");
    const tight = cssRule(CSS, '.root[data-density="tight"]');
    expect(cssValue(tight, "padding-inline")).toBe("var(--prime-space-1)");
    expect(cssValue(tight, "font-variant-numeric")).toBe("tabular-nums");
  });

  it("density inline sits in a line of text; align start reads from the start edge", () => {
    render(
      <>
        <Button.Root variant="soft" tone="neutral" density="inline">
          1,5×
        </Button.Root>
        <Button.Root variant="ghost" tone="neutral" align="start" fullWidth>
          Последние 7 дней
        </Button.Root>
      </>,
    );
    expect(screen.getByRole("button", { name: "1,5×" })).toHaveAttribute("data-density", "inline");
    expect(screen.getByRole("button", { name: "Последние 7 дней" })).toHaveAttribute(
      "data-align",
      "start",
    );
    const inline = cssRule(CSS, '.root[data-density="inline"]');
    expect(cssValue(inline, "height")).toBe("auto");
    expect(cssValue(inline, "line-height")).toBe("inherit");
    expect(cssValue(cssRule(CSS, '.root[data-align="start"]'), "justify-content")).toBe(
      "flex-start",
    );
  });

  it("a host sets the height through --prime-control-height, else the tier", () => {
    const root = cssRule(CSS, ".root");
    expect(cssValue(root, "--btn-h")).toBe("var(--prime-control-height, var(--field-h))");
    expect(cssValue(root, "height")).toBe("var(--btn-h)");
  });
});

describe("Button — disabled group", () => {
  it("takes the disabled look from a disabled Fieldset around it", () => {
    render(
      <DisabledProvider disabled>
        <Button.Root>Сохранить</Button.Root>
      </DisabledProvider>,
    );
    const button = screen.getByRole("button", { name: "Сохранить" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("data-disabled");
  });
});
