import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";

import { Button } from "./Button";
import styles from "./Button.module.css";

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

    it("puts the automatic spinner in place of a leading icon", () => {
      const { container } = render(
        <Button.Root loading>
          <Button.Icon>x</Button.Icon>
          Save
        </Button.Root>,
      );
      expect(container.querySelectorAll(`.${styles.spinner}`)).toHaveLength(1);
      expect(screen.getByRole("button", { name: "Save" })).not.toHaveAttribute(
        "data-loading-overlay",
      );
    });

    it("accepts size xs", () => {
      render(<Button.Root size="xs">Tiny</Button.Root>);
      expect(screen.getByRole("button", { name: "Tiny" })).toHaveAttribute("data-size", "xs");
    });
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
