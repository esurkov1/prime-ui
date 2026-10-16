import { act, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cssRule, cssValue } from "@/test/css";
import { withMotion } from "@/test/motion";

import { exitTimeoutMs } from "./motionTiming";
import { RegionSwap, useSwapIn } from "./RegionSwap";
import swapMotion from "./swapMotion.module.css";

const CSS = "src/internal/RegionSwap.module.css";

const layerOf = (text: string) => screen.getByText(text).parentElement as HTMLElement;
const rootOf = (container: HTMLElement) => container.firstElementChild as HTMLElement;

/** A transition end of the root's height (jsdom's TransitionEvent carries no property name). */
function heightEnd(root: HTMLElement) {
  act(() => {
    root.dispatchEvent(Object.assign(new Event("transitionend"), { propertyName: "height" }));
  });
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("RegionSwap", () => {
  it("renders the content still on the first render", () => {
    withMotion();
    const { container } = render(
      <RegionSwap state="loading" aria-busy="true">
        <p>Загрузка</p>
      </RegionSwap>,
    );
    expect(rootOf(container)).toHaveAttribute("aria-busy", "true");
    expect(rootOf(container).children).toHaveLength(1);
    expect(layerOf("Загрузка")).toHaveAttribute("data-state", "open");
    expect(layerOf("Загрузка")).not.toHaveClass(swapMotion.swapIn);
  });

  it("keeps the old state as a hidden fading layer and fades the new one in", () => {
    withMotion();
    const { rerender } = render(
      <RegionSwap state="empty">
        <p>Пусто</p>
      </RegionSwap>,
    );
    rerender(
      <RegionSwap state="ready">
        <p>Данные</p>
      </RegionSwap>,
    );
    const leaving = layerOf("Пусто");
    expect(leaving).toHaveAttribute("data-state", "closed");
    expect(leaving).toHaveAttribute("aria-hidden", "true");
    expect(leaving).toHaveAttribute("inert");
    expect(leaving).toHaveClass(swapMotion.swapOut);
    expect(layerOf("Данные")).toHaveAttribute("data-state", "open");
    expect(layerOf("Данные")).toHaveClass(swapMotion.swapIn);

    // Only the layer's own animation removes it, not one bubbling from its content.
    fireEvent.animationEnd(screen.getByText("Пусто"));
    expect(screen.getByText("Пусто")).toBeInTheDocument();
    fireEvent.animationEnd(leaving);
    expect(screen.queryByText("Пусто")).toBeNull();
  });

  it("updates the same state in place", () => {
    withMotion();
    const { container, rerender } = render(
      <RegionSwap state="ready">
        <p>3 платежа</p>
      </RegionSwap>,
    );
    rerender(
      <RegionSwap state="ready">
        <p>4 платежа</p>
      </RegionSwap>,
    );
    expect(rootOf(container).children).toHaveLength(1);
    expect(layerOf("4 платежа")).not.toHaveClass(swapMotion.swapIn);
  });

  it("does not remount the leaving content", () => {
    withMotion();
    const mounts = vi.fn();
    function Panel({ label }: { label: string }) {
      React.useEffect(() => mounts(label), [label]);
      return <p>{label}</p>;
    }
    const { rerender } = render(
      <RegionSwap state="error">
        <Panel label="Ошибка" />
      </RegionSwap>,
    );
    rerender(
      <RegionSwap state="ready">
        <Panel label="Данные" />
      </RegionSwap>,
    );
    expect(mounts.mock.calls).toEqual([["Ошибка"], ["Данные"]]);
  });

  it("removes the leaving layer after the exit timeout when no animationend arrives", () => {
    withMotion();
    vi.useFakeTimers();
    const { rerender } = render(
      <RegionSwap state="loading">
        <p>Загрузка</p>
      </RegionSwap>,
    );
    rerender(
      <RegionSwap state="empty">
        <p>Пусто</p>
      </RegionSwap>,
    );
    expect(screen.getByText("Загрузка")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(exitTimeoutMs("fast"));
    });
    expect(screen.queryByText("Загрузка")).toBeNull();
  });

  it("glides from the old content's height to the new one, then returns to auto", () => {
    withMotion();
    // The leaving layer holds the old content (100); the root in flow holds the new one (140).
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      const height = this.dataset.state === "closed" ? 100 : 140;
      return { height, width: 200, top: 0, left: 0, right: 200, bottom: height } as DOMRect;
    });
    const { container, rerender } = render(
      <RegionSwap state="ready">
        <p>Данные</p>
      </RegionSwap>,
    );
    const root = rootOf(container);
    const setProperty = vi.spyOn(root.style, "setProperty");
    rerender(
      <RegionSwap state="empty">
        <p>Пусто</p>
      </RegionSwap>,
    );
    expect(root).toHaveAttribute("data-resizing", "true");
    expect(setProperty.mock.calls).toEqual([
      ["--swap-height", "100px"],
      ["--swap-height", "140px"],
    ]);
    heightEnd(root);
    expect(root).not.toHaveAttribute("data-resizing");
    expect(root.style.getPropertyValue("--swap-height")).toBe("");
  });

  it("a swap during a glide starts from the height on screen", () => {
    withMotion();
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      // Mid-glide the root is drawn at 120; laid out at rest it is 200; a leaving layer 100.
      const height =
        this.dataset.state === "closed" ? 100 : this.hasAttribute("data-resizing") ? 120 : 200;
      return { height } as DOMRect;
    });
    const { container, rerender } = render(
      <RegionSwap state="empty">
        <p>Пусто</p>
      </RegionSwap>,
    );
    const root = rootOf(container);
    rerender(
      <RegionSwap state="ready">
        <p>Данные</p>
      </RegionSwap>,
    );
    expect(root).toHaveAttribute("data-resizing", "true");
    const setProperty = vi.spyOn(root.style, "setProperty");
    rerender(
      <RegionSwap state="error">
        <p>Ошибка</p>
      </RegionSwap>,
    );
    expect(setProperty.mock.calls[0]).toEqual(["--swap-height", "120px"]);
  });

  it("leaving loading: the data replaces the skeleton in place — no glide, a short fade", () => {
    withMotion();
    // The skeleton (leaving, 100) and the data (140) differ: a settled swap would glide.
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      const height = this.dataset.state === "closed" ? 100 : 140;
      return { height } as DOMRect;
    });
    const { container, rerender } = render(
      <RegionSwap state="loading">
        <p>Загрузка</p>
      </RegionSwap>,
    );
    const root = rootOf(container);
    const setProperty = vi.spyOn(root.style, "setProperty");
    rerender(
      <RegionSwap state="ready">
        <p>Данные</p>
      </RegionSwap>,
    );
    expect(root).not.toHaveAttribute("data-resizing");
    expect(setProperty).not.toHaveBeenCalled();
    expect(layerOf("Данные")).toHaveClass(swapMotion.settleIn);
    expect(layerOf("Данные")).not.toHaveClass(swapMotion.swapIn);
    // The skeleton fades out clipped to the data's height, never over the content below.
    expect(root).toHaveAttribute("data-leaving", "true");
    fireEvent.animationEnd(layerOf("Загрузка"));
    expect(root).not.toHaveAttribute("data-leaving");
  });

  it("entering loading drops a running glide and takes the skeleton's height at once", () => {
    withMotion();
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      return { height: this.dataset.state === "closed" ? 100 : 140 } as DOMRect;
    });
    const { container, rerender } = render(
      <RegionSwap state="empty">
        <p>Пусто</p>
      </RegionSwap>,
    );
    const root = rootOf(container);
    rerender(
      <RegionSwap state="ready">
        <p>Данные</p>
      </RegionSwap>,
    );
    expect(root).toHaveAttribute("data-resizing", "true");
    rerender(
      <RegionSwap state="loading">
        <p>Загрузка</p>
      </RegionSwap>,
    );
    expect(root).not.toHaveAttribute("data-resizing");
    expect(root.style.getPropertyValue("--swap-height")).toBe("");
    expect(layerOf("Загрузка")).toHaveClass(swapMotion.settleIn);
  });

  it("does not glide when the heights match, under fill, or under reduced motion", () => {
    withMotion();
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      () => ({ height: 80 }) as DOMRect,
    );
    const { container, rerender } = render(
      <RegionSwap state="a">
        <p>Первый</p>
      </RegionSwap>,
    );
    rerender(
      <RegionSwap state="b">
        <p>Второй</p>
      </RegionSwap>,
    );
    expect(rootOf(container)).not.toHaveAttribute("data-resizing");
  });

  it("fill: marks the root and never glides the height", () => {
    withMotion();
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      return { height: this.dataset.state === "closed" ? 120 : 300 } as DOMRect;
    });
    const { container, rerender } = render(
      <RegionSwap state="loading" fill>
        <p>Загрузка</p>
      </RegionSwap>,
    );
    const root = rootOf(container);
    expect(root).toHaveAttribute("data-fill", "true");
    rerender(
      <RegionSwap state="ready" fill>
        <p>Доска</p>
      </RegionSwap>,
    );
    expect(root).not.toHaveAttribute("data-resizing");
  });

  it("reduced motion (the test default): the old state goes at once, the new one fades in", () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      return { height: this.dataset.state === "closed" ? 100 : 140 } as DOMRect;
    });
    const { container, rerender } = render(
      <RegionSwap state="error">
        <p>Ошибка</p>
      </RegionSwap>,
    );
    rerender(
      <RegionSwap state="ready">
        <p>Данные</p>
      </RegionSwap>,
    );
    expect(screen.queryByText("Ошибка")).toBeNull();
    expect(layerOf("Данные")).toHaveClass(swapMotion.swapIn);
    expect(rootOf(container)).not.toHaveAttribute("data-resizing");
  });

  it("an empty region draws no layer, so the root is :empty and takes no room", () => {
    const { container, rerender } = render(<RegionSwap state="none">{null}</RegionSwap>);
    const root = rootOf(container);
    expect(root.childElementCount).toBe(0);
    rerender(
      <RegionSwap state="banner">
        <p>Счёт оплачен</p>
      </RegionSwap>,
    );
    expect(root.childElementCount).toBe(1);
    rerender(<RegionSwap state="none">{false}</RegionSwap>);
    expect(root.childElementCount).toBe(0);
  });

  it("an empty state keeps the leaving layer until it has faded; an empty one never leaves", () => {
    withMotion();
    const { container, rerender } = render(
      <RegionSwap state="banner">
        <p>Счёт оплачен</p>
      </RegionSwap>,
    );
    rerender(<RegionSwap state="none">{null}</RegionSwap>);
    const root = rootOf(container);
    expect(root.childElementCount).toBe(1);
    fireEvent.animationEnd(layerOf("Счёт оплачен"));
    expect(root.childElementCount).toBe(0);
    rerender(
      <RegionSwap state="banner">
        <p>Счёт оплачен</p>
      </RegionSwap>,
    );
    // Nothing was shown, so nothing leaves: only the new state.
    expect(root.childElementCount).toBe(1);
  });

  it("moves focus from the leaving state into the new one", () => {
    withMotion();
    const { rerender } = render(
      <RegionSwap state="error">
        <button type="button">Повторить</button>
      </RegionSwap>,
    );
    screen.getByRole("button", { name: "Повторить" }).focus();
    rerender(
      <RegionSwap state="ready">
        <p>Платежи загружены</p>
        <button type="button">Разнести</button>
      </RegionSwap>,
    );
    expect(screen.getByRole("button", { name: "Разнести" })).toHaveFocus();
  });

  it("moves focus into the new state under reduced motion too", () => {
    const { rerender } = render(
      <RegionSwap state="error">
        <button type="button">Повторить</button>
      </RegionSwap>,
    );
    screen.getByRole("button", { name: "Повторить" }).focus();
    rerender(
      <RegionSwap state="ready">
        <p>Платежи загружены</p>
      </RegionSwap>,
    );
    expect(layerOf("Платежи загружены")).toHaveFocus();
  });

  it("leaves focus outside the region alone and reports each swap", () => {
    const onSwap = vi.fn();
    const { rerender } = render(
      <>
        <button type="button">Обновить</button>
        <RegionSwap state="loading" onSwap={onSwap}>
          <p>Загрузка</p>
        </RegionSwap>
      </>,
    );
    const refresh = screen.getByRole("button", { name: "Обновить" });
    refresh.focus();
    rerender(
      <>
        <button type="button">Обновить</button>
        <RegionSwap state="ready" onSwap={onSwap}>
          <button type="button">Разнести</button>
        </RegionSwap>
      </>,
    );
    expect(refresh).toHaveFocus();
    expect(onSwap.mock.calls).toEqual([["ready"]]);
  });

  describe("useSwapIn", () => {
    function Body({ state }: { state: string }) {
      const swap = useSwapIn(state);
      return (
        <p key={swap.key} className={swap.className}>
          {state}
        </p>
      );
    }

    it("stays still on the first render and while the state holds", () => {
      const { rerender } = render(<Body state="loading" />);
      expect(screen.getByText("loading")).not.toHaveClass(swapMotion.swapIn);
      rerender(<Body state="loading" />);
      expect(screen.getByText("loading")).not.toHaveClass(swapMotion.swapIn);
    });

    it("remounts a new state with the fade-in and keeps fading every later one", () => {
      const { rerender } = render(<Body state="empty" />);
      const first = screen.getByText("empty");
      rerender(<Body state="rows" />);
      const rows = screen.getByText("rows");
      expect(rows).toHaveClass(swapMotion.swapIn);
      expect(rows).not.toBe(first);
      rerender(<Body state="empty" />);
      expect(screen.getByText("empty")).toHaveClass(swapMotion.swapIn);
      expect(screen.getByText("empty")).not.toBe(first);
    });

    it("a swap into or out of loading takes the short fade", () => {
      const { rerender } = render(<Body state="loading" />);
      rerender(<Body state="rows" />);
      expect(screen.getByText("rows")).toHaveClass(swapMotion.settleIn);
      expect(screen.getByText("rows")).not.toHaveClass(swapMotion.swapIn);
      rerender(<Body state="loading" />);
      expect(screen.getByText("loading")).toHaveClass(swapMotion.settleIn);
    });
  });

  describe("CSS", () => {
    it("an empty root has no box; a filling root stretches its layers", () => {
      expect(cssValue(cssRule(CSS, ".root:empty"), "display")).toBe("none");
      expect(cssValue(cssRule(CSS, '.root[data-fill="true"] > .layer'), "grid-area")).toBe("1 / 1");
      expect(cssValue(cssRule(CSS, '.root[data-fill="true"] > .leaving'), "inset")).toBe("0");
    });

    it("hands a height its parent stretches it to on to a lone child (tiles of a row match)", () => {
      expect(cssValue(cssRule(CSS, ".root"), "display")).toBe("grid");
      expect(cssValue(cssRule(CSS, ".layer:has(> :only-child)"), "display")).toBe("grid");
    });

    it("glides the height through --swap-height, clipped with room for focus rings", () => {
      const resizing = cssRule(CSS, '.root[data-resizing="true"]');
      expect(cssValue(resizing, "height")).toBe("var(--swap-height)");
      expect(cssValue(resizing, "overflow-y")).toBe("clip");
      expect(cssValue(resizing, "overflow-clip-margin")).toBe("var(--prime-focus-space)");
      expect(cssValue(cssRule(CSS, ".root"), "transition")).toBe(
        "height var(--prime-motion-duration-base) var(--prime-motion-easing-standard)",
      );
    });

    it("a leaving layer is clipped to the region; a load fades on the short clock", () => {
      const leaving = cssRule(CSS, '.root[data-leaving="true"]');
      expect(cssValue(leaving, "overflow-y")).toBe("clip");
      expect(cssValue(leaving, "overflow-clip-margin")).toBe("var(--prime-focus-space)");
      expect(
        cssValue(cssRule("src/internal/swapMotion.module.css", ".settleIn"), "animation"),
      ).toContain("var(--prime-motion-fade-fast)");
    });
  });
});
