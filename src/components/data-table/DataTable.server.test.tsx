import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import swapMotion from "@/internal/swapMotion.module.css";

import { DataTable, type DataTableColumn, type DataTableSortState } from "./DataTable";
import { rowsChange } from "./serverMode";

type Row = { id: number; name: string; score: number };

const columns: DataTableColumn<Row>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "score", header: "Score", accessor: "score", sortable: true },
];

/** A server page: deliberately not in the order a local sort would give. */
const PAGE_2: Row[] = [
  { id: 13, name: "Z", score: 1 },
  { id: 11, name: "B", score: 9 },
  { id: 12, name: "M", score: 5 },
];
const PAGE_3: Row[] = [
  { id: 21, name: "Q", score: 2 },
  { id: 22, name: "R", score: 3 },
];

const bodyRows = (container: HTMLElement) =>
  container.querySelectorAll<HTMLTableRowElement>("table:not([aria-hidden]) > tbody > tr");
const names = (container: HTMLElement) =>
  [...bodyRows(container)].map((row) => row.querySelector("td")?.textContent);
const body = (container: HTMLElement) =>
  container.querySelector("table:not([aria-hidden]) > tbody") as HTMLElement;

describe("rowsChange", () => {
  it("tells the same rows, an appended batch and a replaced page apart", () => {
    expect(rowsChange([1, 2], [1, 2])).toBe("same");
    expect(rowsChange([], [1, 2])).toBe("same");
    expect(rowsChange([1, 2], [1, 2, 3])).toBe("append");
    expect(rowsChange([1, 2], [3, 4])).toBe("replace");
    expect(rowsChange([1, 2], [2, 1])).toBe("replace");
    expect(rowsChange([1, 2, 3], [1, 2])).toBe("replace");
  });
});

describe('DataTable source="server"', () => {
  it("never sorts or slices the rows: the server page is shown as given", () => {
    const { container } = render(
      <DataTable
        source="server"
        rows={PAGE_2}
        rowCount={8}
        columns={columns}
        getRowKey={(row) => row.id}
        pageSize={3}
        page={2}
        sort={{ columnId: "name", order: "asc" }}
      />,
    );
    expect(names(container)).toEqual(["Z", "B", "M"]);
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
  });

  it("counts pages and the range from rowCount", () => {
    render(
      <DataTable
        source="server"
        rows={PAGE_2}
        rowCount={8}
        columns={columns}
        getRowKey={(row) => row.id}
        pageSize={3}
        page={2}
      />,
    );
    expect(screen.getByText("Показано 4–6 из 8")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Страница 3" })).toBeInTheDocument();
  });

  it("a page or sort change only calls back; the owner's rows stay until it answers", () => {
    const onPageChange = vi.fn();
    const onSortChange = vi.fn();
    const { container } = render(
      <DataTable
        source="server"
        rows={PAGE_2}
        rowCount={8}
        columns={columns}
        getRowKey={(row) => row.id}
        pageSize={3}
        defaultPage={2}
        onPageChange={onPageChange}
        onSortChange={onSortChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Следующая страница" }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);
    expect(names(container)).toEqual(["Z", "B", "M"]);

    fireEvent.click(screen.getByRole("button", { name: "Score" }));
    expect(onSortChange).toHaveBeenLastCalledWith({ columnId: "score", order: "asc" });
    expect(onPageChange).toHaveBeenLastCalledWith(1);
    expect(names(container)).toEqual(["Z", "B", "M"]);
  });

  it("refreshing keeps the rows with aria-busy, then the new page fades in at the top", () => {
    const props = {
      source: "server" as const,
      rowCount: 8,
      columns,
      getRowKey: (row: Row) => row.id,
      pageSize: 3,
      scrollHeight: 200,
    };
    const { container, rerender } = render(<DataTable {...props} rows={[]} loading page={1} />);
    expect(screen.getByText("Загрузка данных…")).toBeInTheDocument();

    rerender(<DataTable {...props} rows={PAGE_2} page={2} />);
    const loaded = body(container);
    const viewport = container.querySelector("table")?.parentElement as HTMLElement;
    viewport.scrollTop = 80;

    rerender(<DataTable {...props} rows={PAGE_2} page={3} loading />);
    expect(container.querySelector("table")).toHaveAttribute("aria-busy", "true");
    expect(names(container)).toEqual(["Z", "B", "M"]);
    expect(screen.queryByText("Загрузка данных…")).toBeNull();
    expect(body(container)).toBe(loaded);

    rerender(<DataTable {...props} rows={PAGE_3} page={3} />);
    expect(container.querySelector("table")).not.toHaveAttribute("aria-busy");
    expect(names(container)).toEqual(["Q", "R"]);
    expect(body(container)).not.toBe(loaded);
    expect(body(container)).toHaveClass(swapMotion.swapIn);
    // Replaced rows are no additions: no per-row enter on top of the fade.
    for (const row of bodyRows(container)) expect(row).not.toHaveAttribute("data-animate");
    expect(viewport.scrollTop).toBe(0);
    expect(screen.getByText("Показано 7–8 из 8")).toBeInTheDocument();
  });

  it("a new array with the same rows is no new page", () => {
    const { container, rerender } = render(
      <DataTable source="server" rows={PAGE_2} columns={columns} getRowKey={(row) => row.id} />,
    );
    const first = body(container);
    rerender(
      <DataTable
        source="server"
        rows={[...PAGE_2]}
        columns={columns}
        getRowKey={(row) => row.id}
      />,
    );
    expect(body(container)).toBe(first);
    expect(first).not.toHaveClass(swapMotion.swapIn);
  });

  it("selection keeps keys from other pages; «select all» speaks for the current page", () => {
    const onSelectedChange = vi.fn();
    const props = {
      source: "server" as const,
      rowCount: 8,
      columns,
      getRowKey: (row: Row) => row.id,
      pageSize: 3,
      selectable: true,
      onSelectedChange,
    };
    const { rerender } = render(<DataTable {...props} rows={PAGE_2} page={2} selected={[11]} />);
    const selectAll = screen.getByRole("checkbox", { name: "Выбрать все строки" });
    expect(selectAll).toHaveProperty("indeterminate", true);

    rerender(<DataTable {...props} rows={PAGE_3} page={3} selected={[11]} />);
    expect(screen.getByRole("checkbox", { name: "Выбрать все строки" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Выбрать все строки" })).toHaveProperty(
      "indeterminate",
      false,
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "Выбрать все строки" }));
    expect(onSelectedChange).toHaveBeenLastCalledWith([11, 21, 22]);

    rerender(<DataTable {...props} rows={PAGE_3} page={3} selected={[11, 21, 22]} />);
    expect(screen.getByRole("checkbox", { name: "Выбрать все строки" })).toBeChecked();
    fireEvent.click(screen.getByRole("checkbox", { name: "Выбрать все строки" }));
    expect(onSelectedChange).toHaveBeenLastCalledWith([11]);
  });

  it("sort headers keep their keyboard: Enter cycles the order and asks the owner", async () => {
    const user = userEvent.setup();
    function Server() {
      const [sort, setSort] = React.useState<DataTableSortState>(null);
      return (
        <DataTable
          source="server"
          rows={PAGE_2}
          rowCount={3}
          columns={columns}
          getRowKey={(row) => row.id}
          sort={sort}
          onSortChange={setSort}
        />
      );
    }
    const { container } = render(<Server />);
    await user.tab();
    expect(screen.getByRole("button", { name: "Name" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
    await user.keyboard("{Enter}");
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAttribute(
      "aria-sort",
      "descending",
    );
    expect(names(container)).toEqual(["Z", "B", "M"]);
  });

  it('paging="infinite": every loaded batch is shown, a re-sorted first batch starts over', () => {
    const live = new Set<(entries: IntersectionObserverEntry[]) => void>();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        callback: (entries: IntersectionObserverEntry[]) => void;
        constructor(cb: (entries: IntersectionObserverEntry[]) => void) {
          this.callback = cb;
        }
        observe() {
          live.add(this.callback);
        }
        unobserve() {}
        disconnect() {
          live.delete(this.callback);
        }
        takeRecords() {
          return [];
        }
      },
    );
    const reach = () =>
      act(() => {
        for (const callback of [...live]) {
          callback([{ isIntersecting: true } as IntersectionObserverEntry]);
        }
      });
    const onLoadMore = vi.fn();
    const props = {
      source: "server" as const,
      paging: "infinite" as const,
      rowCount: 5,
      columns,
      getRowKey: (row: Row) => row.id,
      pageSize: 2,
      hasMore: true,
      onLoadMore,
    };
    const { container, rerender } = render(<DataTable {...props} rows={PAGE_2} />);
    // pageSize 2, yet the whole server batch of 3 is on screen.
    expect(names(container)).toEqual(["Z", "B", "M"]);
    expect(screen.getByText("Показано 1–3 из 5")).toBeInTheDocument();
    reach();
    expect(onLoadMore).toHaveBeenCalledTimes(1);

    rerender(<DataTable {...props} rows={[...PAGE_2, ...PAGE_3]} hasMore={false} />);
    const appended = bodyRows(container);
    expect(appended).toHaveLength(5);
    expect(appended[3]).toHaveAttribute("data-animate", "true");

    rerender(<DataTable {...props} rows={[...PAGE_3]} />);
    expect(names(container)).toEqual(["Q", "R"]);
    expect(body(container)).toHaveClass(swapMotion.swapIn);
    vi.unstubAllGlobals();
  });
});
