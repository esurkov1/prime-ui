import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Message } from "./Message";

/**
 * One observer per page (the hug keeps the first it makes for every message): the test reports a
 * row's width through it, as the browser would.
 */
const observers: FakeObserver[] = [];
class FakeObserver {
  observed = new Set<Element>();
  constructor(readonly callback: ResizeObserverCallback) {
    observers.push(this);
  }
  observe(target: Element) {
    this.observed.add(target);
  }
  unobserve(target: Element) {
    this.observed.delete(target);
  }
  disconnect() {}
}
/** Reports the rows' width to the observer that watches messages (other layers have their own). */
const report = (width: number) =>
  act(() => {
    for (const observer of observers) {
      const rows = [...observer.observed].filter((el) => el.matches("[data-message-article]"));
      if (rows.length === 0) continue;
      observer.callback(
        rows.map(
          (target) => ({ target, borderBoxSize: [{ inlineSize: width, blockSize: 40 }] }) as never,
        ),
        {} as ResizeObserver,
      );
    }
  });
let lines: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", FakeObserver);
  // Every text line is 200 px wide at the left of its part; the bubble's content box is 456 px.
  lines = vi.fn(function (this: Range) {
    const text = this.startContainer.textContent ?? "";
    return [{ left: 0, right: Math.min(456, text.length * 5), top: 0, bottom: 20, width: 1 }];
  });
  Range.prototype.getClientRects = lines as unknown as Range["getClientRects"];
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(456);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  Reflect.deleteProperty(Range.prototype, "getClientRects");
});

const bubbleOf = () => document.querySelector<HTMLElement>("[data-message-bubble]");

function Chat({ text, label }: { text: string; label?: string }) {
  return (
    <Message.Root value="a" time="16:07" aria-label={label} onReactionToggle={() => {}}>
      <Message.Text>{text}</Message.Text>
    </Message.Root>
  );
}

describe("bubble hug", () => {
  it("writes the width once per text change: the widest line plus the padding", () => {
    const { rerender } = render(<Chat text="Принято, запускаю после бэкапа." />);
    // Nothing before the row's width is known: the observer reports it before the first paint.
    expect(bubbleOf()?.style.inlineSize).toBe("");
    report(800);
    // 31 characters × 5 px: the widest line.
    expect(bubbleOf()?.style.inlineSize).toBe("155px");
    const reads = lines.mock.calls.length;
    expect(reads).toBeGreaterThan(0);

    // A render for anything else (a label, a hover) measures nothing.
    rerender(<Chat text="Принято, запускаю после бэкапа." label="Другое имя" />);
    fireEvent.pointerEnter(screen.getByRole("article"));
    // The reaction bar opening renders the message: still nothing measured.
    fireEvent.keyDown(screen.getByRole("article"), { key: "r", code: "KeyR" });
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
    expect(lines.mock.calls.length).toBe(reads);

    // A new text measures once more, in the same commit.
    rerender(<Chat text="Принято, запускаю после бэкапа. Отчёт положу в задачу." />);
    expect(lines.mock.calls.length).toBeGreaterThan(reads);
    expect(bubbleOf()?.style.inlineSize).toBe("270px");
  });

  it("re-measures when the row's width changes, not when it reports the same width", () => {
    render(<Chat text="Сверка за сентябрь." />);
    report(800);
    const reads = lines.mock.calls.length;
    report(800);
    expect(lines.mock.calls.length).toBe(reads);
    report(390);
    expect(lines.mock.calls.length).toBeGreaterThan(reads);
  });

  it("takes a cached width when the row renders again: nothing measured", () => {
    const first = render(<Chat text="Акт сверки за сентябрь во вложении." />);
    report(640);
    const width = bubbleOf()?.style.inlineSize;
    first.unmount();
    const reads = lines.mock.calls.length;
    render(<Chat text="Акт сверки за сентябрь во вложении." />);
    report(640);
    expect(bubbleOf()?.style.inlineSize).toBe(width);
    expect(lines.mock.calls.length).toBe(reads);
  });

  it("leaves a bubble with a card its own width", () => {
    render(
      <Message.Root value="b" time="10:05">
        <Message.File name="Договор.pdf" fileSize={1024} />
      </Message.Root>,
    );
    report(800);
    expect(bubbleOf()?.style.inlineSize).toBe("");
  });
});
