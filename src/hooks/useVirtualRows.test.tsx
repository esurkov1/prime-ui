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
});
