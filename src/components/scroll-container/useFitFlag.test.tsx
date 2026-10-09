import { readFileSync } from "node:fs";
import { join } from "node:path";

import { act, render, screen } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { ScrollContainer } from "./ScrollContainer";

/** One shared observer serves every region: the stub records what it watches and its callback. */
const observed = new Set<Element>();
let notify: ResizeObserverCallback = () => {};

class StubResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    notify = callback;
  }
  observe(target: Element) {
    observed.add(target);
  }
  unobserve(target: Element) {
    observed.delete(target);
  }
  disconnect() {
    observed.clear();
  }
}

/** Reports a resize of `targets`, as the browser does after layout. */
function resize(...targets: Element[]) {
  act(() => {
    notify(
      targets.map((target) => ({ target }) as ResizeObserverEntry),
      {} as ResizeObserver,
    );
  });
}

function size(node: HTMLElement, scroll: number, client: number) {
  Object.defineProperty(node, "scrollWidth", { configurable: true, value: scroll });
  Object.defineProperty(node, "clientWidth", { configurable: true, value: client });
  Object.defineProperty(node, "scrollHeight", { configurable: true, value: scroll });
  Object.defineProperty(node, "clientHeight", { configurable: true, value: client });
}

describe("ScrollContainer: a region whose content fits is no scroller", () => {
  beforeAll(() => vi.stubGlobal("ResizeObserver", StubResizeObserver));
  afterAll(() => vi.unstubAllGlobals());

  it("marks data-fits while the content fits and drops it once the content outgrows the region", () => {
    render(
      <ScrollContainer axis="horizontal" data-testid="row">
        <div>Сегменты</div>
      </ScrollContainer>,
    );
    const row = screen.getByTestId("row");
    expect(observed.has(row)).toBe(true);
    expect(observed.has(row.firstElementChild as Element)).toBe(true);

    size(row, 200, 200);
    resize(row);
    expect(row).toHaveAttribute("data-fits");

    size(row, 320, 200);
    resize(row.firstElementChild as Element);
    expect(row).not.toHaveAttribute("data-fits");
  });

  it("watches children added later, and keeps text or inline content a scroller", async () => {
    const { rerender } = render(
      <ScrollContainer data-testid="list">
        <div>Заказ 1</div>
      </ScrollContainer>,
    );
    const list = screen.getByTestId("list");
    rerender(
      <ScrollContainer data-testid="list">
        <div>Заказ 1</div>
        <div>Заказ 2</div>
      </ScrollContainer>,
    );
    // The MutationObserver reports in a microtask.
    await act(async () => {});
    expect(observed.has(list.lastElementChild as Element)).toBe(true);

    render(<ScrollContainer data-testid="text">Текст без обёртки</ScrollContainer>);
    const text = screen.getByTestId("text");
    size(text, 100, 100);
    resize(text);
    expect(text).not.toHaveAttribute("data-fits");
  });

  it("never flags a region that follows its content (a chat, a feed that loads more)", () => {
    // The shared fit observer was made by the first region; its callback is the one to drive.
    const fitNotify = notify;
    render(
      <ScrollContainer anchor="end" data-testid="chat">
        <div>Сообщение</div>
      </ScrollContainer>,
    );
    const chat = screen.getByTestId("chat");
    size(chat, 100, 200);
    act(() =>
      fitNotify([{ target: chat } as unknown as ResizeObserverEntry], {} as ResizeObserver),
    );
    expect(chat).not.toHaveAttribute("data-fits");
  });

  it("stops watching on unmount", () => {
    const { unmount } = render(
      <ScrollContainer data-testid="gone">
        <div>Счета</div>
      </ScrollContainer>,
    );
    const node = screen.getByTestId("gone");
    unmount();
    expect(observed.has(node)).toBe(false);
  });

  it("CSS: a region that fits clips instead of scrolling", () => {
    const css = readFileSync(join(__dirname, "ScrollContainer.module.css"), "utf8");
    expect(css).toMatch(/\.root\[data-fits\]\s*\{\s*overflow: hidden;/);
  });
});
