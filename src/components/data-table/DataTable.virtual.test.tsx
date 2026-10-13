import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DataTable, type DataTableColumn } from "./DataTable";

type Row = { id: number; name: string };

const columns: DataTableColumn<Row>[] = [
  { id: "name", header: "Название", accessor: "name" },
  { id: "id", header: "Номер", accessor: "id", numeric: true },
];

const ROWS: Row[] = Array.from({ length: 1000 }, (_, index) => ({
  id: index,
  name: `Заказ ${index}`,
}));

/** The viewport is 440px tall; rows have no CSS, so each is the 44px estimate. */
function sized(height = 440) {
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(height);
}

const bodyRows = (container: HTMLElement) =>
  [...container.querySelectorAll<HTMLTableRowElement>("tbody > tr[aria-rowindex]")].map((row) =>
    Number(row.getAttribute("aria-rowindex")),
  );

async function scrollTo(container: HTMLElement, top: number) {
  const viewport = container.querySelector("table")?.parentElement as HTMLElement;
  viewport.scrollTop = top;
  await act(async () => {
    fireEvent.scroll(viewport);
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  });
}

afterEach(() => vi.restoreAllMocks());

describe("DataTable virtual body", () => {
  it("renders only the rows around the view, with spacers and the full row count", () => {
    sized();
    const { container } = render(
      <DataTable rows={ROWS} columns={columns} paging="none" scrollHeight={440} />,
    );
    const indexes = bodyRows(container);
    expect(indexes[0]).toBe(2);
    expect(indexes.length).toBeLessThan(25);
    expect(container.querySelector("table")).toHaveAttribute("aria-rowcount", "1001");
    // Rows below are a spacer of their height.
    const spacer = container.querySelector<HTMLElement>("tbody > tr[aria-hidden='true'] > td");
    expect(spacer?.style.height).toBe(`${(1000 - indexes.length) * 44}px`);
  });

  it("follows the scroll and keeps the focused row rendered", async () => {
    sized();
    const { container } = render(
      <DataTable
        rows={ROWS}
        columns={columns}
        getRowKey={(row) => row.id}
        onRowClick={() => {}}
        paging="none"
        scrollHeight={440}
      />,
    );
    const first = container.querySelector<HTMLElement>("tbody > tr[aria-rowindex='2']");
    first?.focus();
    expect(first).toHaveFocus();

    await scrollTo(container, 44 * 500);
    const indexes = bodyRows(container);
    expect(indexes).toContain(2 + 500);
    expect(indexes).toContain(2);
    expect(indexes.length).toBeLessThan(30);
    expect(first).toHaveFocus();
    expect(screen.getByText("Заказ 500")).toBeInTheDocument();
  });

  it("renders every row of a short table or one the page scrolls", () => {
    sized();
    const short = render(
      <DataTable rows={ROWS.slice(0, 80)} columns={columns} paging="none" scrollHeight={440} />,
    );
    expect(bodyRows(short.container)).toHaveLength(0);
    expect(short.container.querySelectorAll("tbody > tr")).toHaveLength(80);
    short.unmount();

    const unbounded = render(<DataTable rows={ROWS} columns={columns} paging="none" />);
    expect(unbounded.container.querySelectorAll("tbody > tr")).toHaveLength(1000);
  });
});
