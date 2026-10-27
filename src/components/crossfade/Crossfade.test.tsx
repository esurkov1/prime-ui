import { act, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { cssRule, cssValue } from "@/test/css";
import { passSwapHold, withMotion } from "@/test/motion";

import { Crossfade } from "./Crossfade";
import styles from "./Crossfade.module.css";

const layerOf = (text: string) => screen.getByText(text).parentElement as HTMLElement;

/** The opacity runs on a node: `[from, to]` each. */
const fadesOn = (motion: ReturnType<typeof withMotion>, node: Element) =>
  motion.on(node).map((run) => (run.keyframes as Keyframe[]).map((frame) => frame.opacity));

describe("Crossfade", () => {
  it("is a plain region: the ref and the attributes reach its div", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Crossfade ref={ref} state="loading" aria-busy="true" aria-live="polite" className="panel">
        <p>Загрузка</p>
      </Crossfade>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("aria-busy", "true");
    expect(ref.current).toHaveAttribute("aria-live", "polite");
    expect(ref.current).toHaveClass("panel");
  });

  it("cross-fades a new state: the old one leaves hidden from assistive tech and Tab", () => {
    const motion = withMotion();
    vi.useFakeTimers();
    const { rerender } = render(
      <Crossfade state="empty">
        <p>Пусто</p>
      </Crossfade>,
    );
    rerender(
      <Crossfade state="ready">
        <p>Данные</p>
      </Crossfade>,
    );
    const leaving = layerOf("Пусто");
    expect(leaving).toHaveAttribute("aria-hidden", "true");
    expect(leaving).toHaveAttribute("inert");
    passSwapHold();
    expect(fadesOn(motion, layerOf("Данные")).at(-1)).toEqual([0, 1]);
    act(() => motion.finishAll());
    expect(screen.queryByText("Пусто")).toBeNull();
    vi.useRealTimers();
  });

  it('the data replaces the "loading" skeleton in place: at once, a short fade', () => {
    const motion = withMotion();
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      return { height: this.dataset.state === "closed" ? 96 : 180 } as DOMRect;
    });
    const { container, rerender } = render(
      <Crossfade state="loading" aria-busy>
        <p>Загрузка</p>
      </Crossfade>,
    );
    rerender(
      <Crossfade state="ready">
        <p>Платежи</p>
      </Crossfade>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).not.toHaveAttribute("data-resizing");
    const fadeIn = motion.on(layerOf("Платежи")).at(-1);
    expect((fadeIn?.options as KeyframeAnimationOptions).duration).toBe(230);
    vi.restoreAllMocks();
  });

  it("focus on the retry button of an error moves into the loaded state", () => {
    const { rerender } = render(
      <Crossfade state="error">
        <button type="button">Повторить</button>
      </Crossfade>,
    );
    const retry = screen.getByRole("button", { name: "Повторить" });
    retry.focus();
    rerender(
      <Crossfade state="ready">
        <button type="button">Разнести платежи</button>
      </Crossfade>,
    );
    expect(screen.getByRole("button", { name: "Разнести платежи" })).toHaveFocus();
  });

  it("fill: the region takes its parent's height", () => {
    const { container } = render(
      <Crossfade state="ready" fill>
        <p>Доска</p>
      </Crossfade>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-fill", "true");
  });

  it("content that mounts already loaded appears in place: no fade", () => {
    const motion = withMotion();
    // A remounted tab with cached data: the region would glide from zero if it treated its
    // first state as a swap.
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      () => ({ height: 240 }) as DOMRect,
    );
    const { container, rerender } = render(
      <Crossfade state="ready">
        <p>Уведомления</p>
      </Crossfade>,
    );
    rerender(
      <Crossfade state="ready">
        <p>Уведомления</p>
      </Crossfade>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).not.toHaveAttribute("data-resizing");
    expect(root.children).toHaveLength(1);
    expect(motion.animations).toHaveLength(0);
  });

  it("spans its parent's inline size, also in a centring grid; a consumer class can override it", () => {
    render(
      <Crossfade state="form" className="canvas">
        <p>Форма</p>
      </Crossfade>,
    );
    const root = layerOf("Форма").parentElement as HTMLElement;
    expect(root).toHaveClass(styles.root, "canvas");
    const rule = cssRule("src/components/crossfade/Crossfade.module.css", ":where(.root)");
    expect(cssValue(rule, "justify-self")).toBe("stretch");
  });
});
