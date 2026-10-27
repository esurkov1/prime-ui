import { act, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cssRule, cssValue } from "@/test/css";
import { passSwapHold, withMotion } from "@/test/motion";

import { exitTimeoutMs } from "./motionTiming";
import { RegionSwap, useSwapIn } from "./RegionSwap";
import swapMotion from "./swapMotion.module.css";

const CSS = "src/internal/RegionSwap.module.css";

const layerOf = (text: string) => screen.getByText(text).parentElement as HTMLElement;
const rootOf = (container: HTMLElement) => container.firstElementChild as HTMLElement;

type Motion = ReturnType<typeof withMotion>;

/** The opacity runs on a layer, in order: `[from, to]` each (a freeze holds one value). */
const fadesOn = (motion: Motion, node: Element) =>
  motion.on(node).map((run) => (run.keyframes as Keyframe[]).map((frame) => frame.opacity));

/** The fade a layer runs now. */
const runningFade = (motion: Motion, node: Element) =>
  motion
    .on(node)
    .filter((run) => !run.cancelled && run.animation.playState !== "finished")
    .at(-1);

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("RegionSwap", () => {
  it("renders the content still on the first render", () => {
    const motion = withMotion();
    const { container } = render(
      <RegionSwap state="loading" aria-busy="true">
        <p>Загрузка</p>
      </RegionSwap>,
    );
    expect(rootOf(container)).toHaveAttribute("aria-busy", "true");
    expect(rootOf(container).children).toHaveLength(1);
    expect(layerOf("Загрузка")).toHaveAttribute("data-state", "open");
    expect(motion.animations).toHaveLength(0);
  });

  it("keeps the old state as a hidden fading layer and fades the new one in", () => {
    const motion = withMotion();
    vi.useFakeTimers();
    const { container, rerender } = render(
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
    const incoming = layerOf("Данные");
    expect(leaving).toHaveAttribute("data-state", "closed");
    expect(leaving).toHaveAttribute("aria-hidden", "true");
    expect(leaving).toHaveAttribute("inert");
    expect(incoming).toHaveAttribute("data-state", "open");
    // The hold: the old state stays shown, the new one unseen.
    expect(rootOf(container)).toHaveAttribute("data-held", "true");
    expect(fadesOn(motion, leaving)).toEqual([[1, 1]]);
    expect(fadesOn(motion, incoming)).toEqual([[0, 0]]);
    passSwapHold();
    expect(rootOf(container)).not.toHaveAttribute("data-held");
    expect(fadesOn(motion, incoming).at(-1)).toEqual([0, 1]);
    expect(fadesOn(motion, leaving).at(-1)).toEqual([1, 0]);
    act(() => runningFade(motion, leaving)?.finish());
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

  it("removes the leaving layer after the exit timeout when no fade ends", () => {
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
    // Out of loading the swap moves at once.
    expect(screen.getByText("Загрузка")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(exitTimeoutMs("fast"));
    });
    expect(screen.queryByText("Загрузка")).toBeNull();
  });

  it("takes the new state's height at once after the hold: no size motion, nothing in flow clipped", () => {
    const motion = withMotion();
    vi.useFakeTimers();
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
    // The hold: the state on screen stays in flow, the waiting one lies over it unseen.
    expect(root).toHaveAttribute("data-held", "true");
    expect(layerOf("Данные")).toHaveAttribute("data-on-screen", "true");
    passSwapHold();
    expect(root).not.toHaveAttribute("data-held");
    expect(layerOf("Данные")).not.toHaveAttribute("data-on-screen");
    // Opacity only: the region never holds or glides a size.
    expect(setProperty).not.toHaveBeenCalled();
    expect(root).not.toHaveAttribute("data-resizing");
    expect(fadesOn(motion, layerOf("Пусто")).at(-1)).toEqual([0, 1]);
    expect(fadesOn(motion, layerOf("Данные")).at(-1)).toEqual([1, 0]);
  });

  it("a state that turns back within the hold is the old one again: no frame of motion", () => {
    const motion = withMotion();
    vi.useFakeTimers();
    const mounts = vi.fn();
    function Panel({ label }: { label: string }) {
      React.useEffect(() => mounts(label), [label]);
      return <p>{label}</p>;
    }
    const { container, rerender } = render(
      <RegionSwap state="ready">
        <Panel label="Задача" />
      </RegionSwap>,
    );
    const root = rootOf(container);
    const shown = layerOf("Задача");
    // A quiet refetch: the item is gone for a moment, then back.
    rerender(
      <RegionSwap state="empty">
        <Panel label="Пусто" />
      </RegionSwap>,
    );
    rerender(
      <RegionSwap state="ready">
        <Panel label="Задача" />
      </RegionSwap>,
    );
    expect(screen.queryByText("Пусто")).toBeNull();
    expect(layerOf("Задача")).toBe(shown);
    expect(shown).toHaveAttribute("data-state", "open");
    // Held at full opacity, never faded.
    expect(
      fadesOn(motion, shown)
        .flat()
        .every((value) => value === 1),
    ).toBe(true);
    expect(root).not.toHaveAttribute("data-resizing");
    expect(root).not.toHaveAttribute("data-swapping");
    expect(mounts.mock.calls).toEqual([["Задача"], ["Пусто"]]);
    passSwapHold();
    expect(root.children).toHaveLength(1);
    expect(root).not.toHaveAttribute("data-resizing");
  });

  it("a quiet refetch (ready → loading → ready within the hold) never shows the skeleton", () => {
    const motion = withMotion();
    vi.useFakeTimers();
    const { rerender } = render(
      <RegionSwap state="ready">
        <p>Данные</p>
      </RegionSwap>,
    );
    rerender(
      <RegionSwap state="loading">
        <p>Загрузка</p>
      </RegionSwap>,
    );
    const skeleton = layerOf("Загрузка");
    rerender(
      <RegionSwap state="ready">
        <p>Данные</p>
      </RegionSwap>,
    );
    expect(screen.queryByText("Загрузка")).toBeNull();
    expect(
      fadesOn(motion, skeleton)
        .flat()
        .every((value) => value === 0),
    ).toBe(true);
    expect(
      fadesOn(motion, layerOf("Данные"))
        .flat()
        .every((value) => value === 1),
    ).toBe(true);
  });

  it("another state within the hold replaces the one that waited, unseen", () => {
    const motion = withMotion();
    vi.useFakeTimers();
    const { rerender } = render(
      <RegionSwap state="ready">
        <p>Данные</p>
      </RegionSwap>,
    );
    rerender(
      <RegionSwap state="empty">
        <p>Пусто</p>
      </RegionSwap>,
    );
    rerender(
      <RegionSwap state="error">
        <p>Ошибка</p>
      </RegionSwap>,
    );
    expect(screen.queryByText("Пусто")).toBeNull();
    expect(fadesOn(motion, layerOf("Ошибка"))).toEqual([[0, 0]]);
    passSwapHold();
    expect(fadesOn(motion, layerOf("Ошибка")).at(-1)).toEqual([0, 1]);
    expect(fadesOn(motion, layerOf("Данные")).at(-1)).toEqual([1, 0]);
  });

  it("a swap that turns back mid-fade reverses both fades from where they are", () => {
    const motion = withMotion();
    vi.useFakeTimers();
    const { container, rerender } = render(
      <RegionSwap state="ready">
        <p>Данные</p>
      </RegionSwap>,
    );
    rerender(
      <RegionSwap state="empty">
        <p>Пусто</p>
      </RegionSwap>,
    );
    passSwapHold();
    const data = layerOf("Данные");
    const empty = layerOf("Пусто");
    // Mid-swap: the data at 0.6 on its way out, the empty state at 0.4 on its way in.
    for (const node of [data, empty]) {
      const run = runningFade(motion, node);
      if (run) Object.assign(run.animation, { effect: {} });
    }
    const computed = window.getComputedStyle;
    vi.spyOn(window, "getComputedStyle").mockImplementation((node, pseudo) =>
      node === data
        ? ({ opacity: "0.6" } as CSSStyleDeclaration)
        : node === empty
          ? ({ opacity: "0.4" } as CSSStyleDeclaration)
          : computed(node, pseudo),
    );
    rerender(
      <RegionSwap state="ready">
        <p>Данные</p>
      </RegionSwap>,
    );
    // No hold for a state still on screen; the data comes back over what is left of its fade.
    expect(rootOf(container)).not.toHaveAttribute("data-held");
    expect(layerOf("Данные")).toBe(data);
    const back = runningFade(motion, data);
    expect((back?.keyframes as Keyframe[]).map((frame) => frame.opacity)).toEqual([0.6, 1]);
    expect((back?.options as KeyframeAnimationOptions).duration).toBeCloseTo(380 * 0.4);
    expect(fadesOn(motion, empty).at(-1)).toEqual([0.4, 0]);
  });

  it("an inline swap and hold={false} move at once", () => {
    withMotion();
    const { container, rerender } = render(
      <RegionSwap state="view" axis="inline">
        <p>Изменить</p>
      </RegionSwap>,
    );
    rerender(
      <RegionSwap state="edit" axis="inline">
        <p>Сохранить</p>
      </RegionSwap>,
    );
    expect(rootOf(container)).not.toHaveAttribute("data-held");
    const pane = render(
      <RegionSwap state="preview" hold={false}>
        <p>Пример</p>
      </RegionSwap>,
    );
    pane.rerender(
      <RegionSwap state="code" hold={false}>
        <p>Код</p>
      </RegionSwap>,
    );
    expect(rootOf(pane.container)).not.toHaveAttribute("data-held");
  });

  it("leaving loading: the data replaces the skeleton in place at once, on a short fade", () => {
    const motion = withMotion();
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
    const fadeIn = runningFade(motion, layerOf("Данные"));
    expect((fadeIn?.options as KeyframeAnimationOptions).duration).toBe(230);
    // The skeleton fades out over the data, then goes.
    expect(root).toHaveAttribute("data-swapping", "true");
    act(() => runningFade(motion, layerOf("Загрузка"))?.finish());
    expect(root).not.toHaveAttribute("data-swapping");
  });

  it("fill: marks the root and swaps its states in place", () => {
    withMotion();
    vi.useFakeTimers();
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
    passSwapHold();
    expect(root).not.toHaveAttribute("data-resizing");
    expect(screen.getByText("Доска")).toBeInTheDocument();
  });

  it("reduced motion (the test default): the old state goes after the hold, the new one fades in", () => {
    vi.useFakeTimers();
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
    // The hold keeps the old state on screen under reduced motion too: no flash of a short state.
    expect(screen.getByText("Ошибка")).toBeInTheDocument();
    passSwapHold();
    expect(screen.queryByText("Ошибка")).toBeNull();
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
    const motion = withMotion();
    vi.useFakeTimers();
    const { container, rerender } = render(
      <RegionSwap state="banner">
        <p>Счёт оплачен</p>
      </RegionSwap>,
    );
    rerender(<RegionSwap state="none">{null}</RegionSwap>);
    const root = rootOf(container);
    expect(root.childElementCount).toBe(1);
    passSwapHold();
    act(() => runningFade(motion, layerOf("Счёт оплачен"))?.finish());
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
    function Body({ state, text = state }: { state: string; text?: string }) {
      const swap = useSwapIn(state, text);
      return (
        <p key={swap.key} className={swap.className} data-shown={swap.state}>
          {swap.state === "loading" ? "Загрузка" : swap.content}
        </p>
      );
    }

    it("stays still on the first render and while the state holds", () => {
      const { rerender } = render(<Body state="loading" />);
      expect(screen.getByText("Загрузка")).not.toHaveClass(swapMotion.swapIn);
      rerender(<Body state="loading" />);
      expect(screen.getByText("Загрузка")).not.toHaveClass(swapMotion.swapIn);
    });

    it("remounts a new state with the fade-in after the hold and keeps fading every later one", () => {
      vi.useFakeTimers();
      const { rerender } = render(<Body state="empty" />);
      const first = screen.getByText("empty");
      rerender(<Body state="rows" />);
      // The hold: the old state and its content stay.
      expect(screen.getByText("empty")).toBe(first);
      passSwapHold();
      const rows = screen.getByText("rows");
      expect(rows).toHaveClass(swapMotion.swapIn);
      expect(rows).not.toBe(first);
      rerender(<Body state="empty" />);
      passSwapHold();
      expect(screen.getByText("empty")).toHaveClass(swapMotion.swapIn);
      expect(screen.getByText("empty")).not.toBe(first);
    });

    it("a quiet refetch keeps the data content on screen; the data arriving shows at once", () => {
      vi.useFakeTimers();
      const { rerender } = render(<Body state="data" text="94 750 ₽" />);
      const value = screen.getByText("94 750 ₽");
      rerender(<Body state="loading" text="" />);
      expect(screen.getByText("94 750 ₽")).toBe(value);
      rerender(<Body state="data" text="94 750 ₽" />);
      passSwapHold();
      expect(screen.getByText("94 750 ₽")).toBe(value);
      expect(value).not.toHaveClass(swapMotion.settleIn);
      rerender(<Body state="loading" text="" />);
      passSwapHold();
      expect(screen.getByText("Загрузка")).toHaveClass(swapMotion.settleIn);
      rerender(<Body state="data" text="18 000 ₽" />);
      expect(screen.getByText("18 000 ₽")).toHaveClass(swapMotion.settleIn);
    });

    it("hold = false follows the state at once", () => {
      function Bare({ state }: { state: string }) {
        const swap = useSwapIn(state, undefined, false);
        return <p key={swap.key}>{swap.state}</p>;
      }
      const { rerender } = render(<Bare state="data" />);
      rerender(<Bare state="loading" />);
      expect(screen.getByText("loading")).toBeInTheDocument();
    });
  });

  describe("CSS", () => {
    it("an empty root has no box; a filling root stretches its layers", () => {
      expect(cssValue(cssRule(CSS, ".root:empty"), "display")).toBe("none");
      expect(cssValue(cssRule(CSS, '.root[data-fill="true"] > .layer'), "grid-area")).toBe("1 / 1");
      expect(cssValue(cssRule(CSS, '.root[data-fill="true"] > .leaving'), "inset")).toBe("0");
    });

    it("hands a height its parent stretches it to on to a lone child (tiles of a row match)", () => {
      expect(cssValue(cssRule(CSS, '.root[data-axis="block"]'), "display")).toBe("grid");
      expect(cssValue(cssRule(CSS, ".layer:has(> :only-child)"), "display")).toBe("grid");
    });

    it("a block region has no size motion and clips nothing in flow", () => {
      const block = cssRule(CSS, '.root[data-axis="block"]');
      expect(block.decls.map((decl) => decl.prop)).not.toContain("transition");
      expect(block.decls.map((decl) => decl.prop)).not.toContain("overflow-y");
      expect(() => cssRule(CSS, '.root[data-axis="block"][data-swapping="true"]')).toThrow();
      expect(() => cssRule(CSS, '.root[data-axis="block"][data-resizing="true"]')).toThrow();
    });

    it("holds the state on screen in flow and the waiting one over it, cut to the region", () => {
      const held =
        '.root[data-axis="block"]:not([data-fill="true"])[data-held="true"] > .leaving[data-on-screen="true"]';
      expect(cssValue(cssRule(CSS, held), "position")).toBe("relative");
      const waiting =
        '.root[data-axis="block"]:not([data-fill="true"])[data-held="true"] > .layer:not(.leaving)';
      expect(cssValue(cssRule(CSS, waiting), "position")).toBe("absolute");
      expect(cssValue(cssRule(CSS, waiting), "overflow")).toBe("clip");
    });

    it("an inline cell glides its width and holds both states to its align edge", () => {
      const resizing = cssRule(CSS, '.root[data-axis="inline"][data-resizing="true"]');
      expect(cssValue(resizing, "width")).toBe("var(--swap-size)");
      expect(cssValue(resizing, "overflow-x")).toBe("clip");
      expect(cssValue(cssRule(CSS, '.root[data-axis="inline"]'), "transition")).toBe(
        "width var(--prime-motion-duration-base) var(--prime-motion-easing-standard)",
      );
      expect(
        cssValue(cssRule(CSS, '.root[data-axis="inline"][data-align="end"]'), "justify-content"),
      ).toBe("flex-end");
      expect(
        cssValue(
          cssRule(CSS, '.root[data-axis="inline"][data-align="end"] > .leaving'),
          "inset-inline",
        ),
      ).toBe("auto 0");
    });

    it("only a leaving layer is clipped, with room for a bleed; a load fades on the short clock", () => {
      const leaving = cssRule(CSS, '.root[data-axis="block"] > .leaving');
      expect(cssValue(leaving, "max-height")).toBe("100%");
      expect(cssValue(leaving, "clip-path")).toBe("inset(calc(var(--prime-space-4) * -1))");
      expect(
        cssValue(cssRule("src/internal/swapMotion.module.css", ".settleIn"), "animation"),
      ).toContain("var(--prime-motion-fade-fast)");
    });
  });
});
