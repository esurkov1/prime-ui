import { act, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useVirtualRows } from "./useVirtualRows";

function List({ count, pinned }: { count: number; pinned?: number[] }) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const { rows, totalSize } = useVirtualRows({
    count,
    scrollRef,
    getKey: (index) => `row-${index}`,
    estimateSize: (index) => (index % 2 === 0 ? 20 : 40),
    overscan: 2,
    pinned,
  });
  return (
    <div ref={scrollRef} data-testid="scroller" data-total={totalSize}>
      {rows.map((row) => (
        <div key={row.index} data-testid="row" data-start={row.start}>
          {row.index}
        </div>
      ))}
    </div>
  );
}

function sized(height: number) {
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(function (
    this: HTMLElement,
  ) {
    return this.dataset.testid === "scroller" ? height : 0;
  });
}

afterEach(() => vi.restoreAllMocks());

describe("useVirtualRows", () => {
  it("renders the visible rows plus the overscan, at exact offsets, with the full total", () => {
    sized(100);
    render(<List count={1000} />);
    const rows = screen.getAllByTestId("row");
    // 100px shows rows 0–3 (20 + 40 + 20 + 40), plus two below.
    expect(rows.map((row) => row.textContent)).toEqual(["0", "1", "2", "3", "4", "5"]);
    expect(rows.map((row) => row.dataset.start)).toEqual(["0", "20", "60", "80", "120", "140"]);
    expect(screen.getByTestId("scroller").dataset.total).toBe(String(500 * 20 + 500 * 40));
  });

  it("follows the scroll position and keeps pinned rows", async () => {
    sized(100);
    render(<List count={1000} pinned={[999]} />);
    const scroller = screen.getByTestId("scroller");
    scroller.scrollTop = 3000; // row 100 starts at 3000
    await act(async () => {
      fireEvent.scroll(scroller);
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    });
    const indexes = screen.getAllByTestId("row").map((row) => Number(row.textContent));
    expect(indexes[0]).toBe(98);
    expect(indexes).toContain(100);
    expect(indexes).toContain(999);
    expect(indexes.length).toBeLessThan(15);
  });

  it("renders a first batch before the scroller has a size", () => {
    sized(0);
    render(<List count={1000} />);
    expect(screen.getAllByTestId("row")).toHaveLength(30);
  });

  it("rows inserted above keep the same rows rendered, the same nodes", async () => {
    sized(100);
    const keys = Array.from({ length: 200 }, (_, index) => `m${index}`);
    const { rerender } = render(<KeyedList keys={keys} />);
    const scroller = screen.getByTestId("scroller");
    scroller.scrollTop = 1200; // row 40 starts at 1200
    await act(async () => {
      fireEvent.scroll(scroller);
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    });
    const before = screen.getAllByTestId("row");
    const first = before[0];
    // History loaded: twenty rows arrive above, and the view keeps its place below them.
    const older = Array.from({ length: 20 }, (_, index) => `h${index}`);
    scroller.scrollTop = 1200 + 20 * 30;
    rerender(<KeyedList keys={[...older, ...keys]} />);
    const after = screen.getAllByTestId("row");
    expect(after.map((row) => row.textContent)).toEqual(before.map((row) => row.textContent));
    expect(after[0]).toBe(first);
  });

  it("reports when every rendered row is measured", async () => {
    sized(100);
    const observers: { callback: ResizeObserverCallback; nodes: Element[] }[] = [];
    vi.stubGlobal(
      "ResizeObserver",
      class {
        nodes: Element[] = [];
        constructor(callback: ResizeObserverCallback) {
          observers.push({ callback, nodes: this.nodes });
        }
        observe(node: Element) {
          this.nodes.push(node);
        }
        unobserve() {}
        disconnect() {}
      },
    );
    render(<KeyedList keys={["a", "b", "c"]} />);
    expect(screen.getByTestId("scroller").dataset.measured).toBe("false");
    await act(async () => {
      for (const { callback, nodes } of observers) {
        const rows = nodes.filter((node) => node.getAttribute("data-testid") === "row");
        if (rows.length === 0) continue;
        callback(
          rows.map(
            (target) =>
              ({ target, borderBoxSize: [{ blockSize: 24 }] }) as unknown as ResizeObserverEntry,
          ),
          {} as ResizeObserver,
        );
      }
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    });
    expect(screen.getByTestId("scroller").dataset.measured).toBe("true");
    vi.unstubAllGlobals();
  });
});

function KeyedList({ keys }: { keys: string[] }) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const getKey = React.useCallback((index: number) => keys[index] ?? index, [keys]);
  const { rows, measure, measured } = useVirtualRows({
    count: keys.length,
    scrollRef,
    getKey,
    estimateSize: () => 30,
    overscan: 1,
  });
  return (
    <div ref={scrollRef} data-testid="scroller" data-measured={measured}>
      {rows.map((row) => (
        <div key={keys[row.index]} ref={measure(row.index)} data-testid="row">
          {keys[row.index]}
        </div>
      ))}
    </div>
  );
}
