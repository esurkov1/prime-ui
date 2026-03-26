import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Badge } from "@/components/badge/Badge";
import { Kbd } from "@/components/kbd/Kbd";
import { Tag } from "@/components/tag/Tag";
import { CSS_PX_SUFFIX, DATA_TABLE_INFINITE_ROOT_MARGIN } from "@/internal/runtimeUnits";

import { DataTable, type DataTableColumn } from "./DataTable";

type Row = { id: number; name: string; score: number };

const columns: DataTableColumn<Row>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "score", header: "Score", accessor: "score", sortable: true, align: "end" },
];

const rows: Row[] = [
  { id: 1, name: "C", score: 32 },
  { id: 2, name: "A", score: 85 },
  { id: 3, name: "B", score: 44 },
  { id: 4, name: "D", score: 11 },
  { id: 5, name: "E", score: 76 },
  { id: 6, name: "F", score: 68 },
];

describe("DataTable", () => {
  it("renders headers and rows", () => {
    render(<DataTable.Root rows={rows.slice(0, 2)} columns={columns} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
    expect(screen.getByText("Name").closest("div[data-divider]")).toHaveAttribute(
      "data-divider",
      "standard",
    );
  });

  it("sorts rows by header click and toggles asc/desc", () => {
    render(<DataTable.Root rows={rows.slice(0, 3)} columns={columns} pageSize={10} />);

    const nameHeader = screen.getByText("Name").closest("th");
    expect(nameHeader).toBeInTheDocument();
    fireEvent.click(nameHeader as Element);
    const aAfterAsc = screen.getByText("A");
    const cAfterAsc = screen.getByText("C");
    expect(
      aAfterAsc.compareDocumentPosition(cAfterAsc) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    fireEvent.click(nameHeader as Element);
    const cAfterDesc = screen.getByText("C");
    const aAfterDesc = screen.getByText("A");
    expect(
      cAfterDesc.compareDocumentPosition(aAfterDesc) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("supports pagination", () => {
    render(<DataTable.Root rows={rows} columns={columns} pageSize={2} />);

    expect(screen.getByText("Показано 1–2 из 6")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Page 2" }));
    expect(screen.getByText("Показано 3–4 из 6")).toBeInTheDocument();
  });

  it("sets divider style through prop", () => {
    render(<DataTable.Root rows={rows.slice(0, 2)} columns={columns} dividerStyle="dashed" />);
    expect(screen.getByText("Name").closest("div[data-divider]")).toHaveAttribute(
      "data-divider",
      "dashed",
    );
  });

  it("allows hiding column header row", () => {
    render(<DataTable.Root rows={rows.slice(0, 2)} columns={columns} showHeader={false} />);

    expect(screen.queryByRole("columnheader", { name: "Name" })).not.toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "C" })).toBeInTheDocument();
    expect(screen.getByText("C").closest("div[data-show-header]")).toHaveAttribute(
      "data-show-header",
      "false",
    );
  });

  it("keeps first column as regular cells", () => {
    render(<DataTable.Root rows={rows.slice(0, 2)} columns={columns} showPagination={false} />);

    expect(screen.queryByRole("rowheader")).not.toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "C" })).toBeInTheDocument();
  });

  it("exposes sticky header and sticky first column flags on root", () => {
    render(
      <DataTable.Root rows={rows.slice(0, 2)} columns={columns} stickyHeader stickyFirstColumn />,
    );

    expect(screen.getByText("Name").closest("div[data-sticky-header]")).toHaveAttribute(
      "data-sticky-header",
      "true",
    );
    expect(screen.getByText("Name").closest("div[data-sticky-first-column]")).toHaveAttribute(
      "data-sticky-first-column",
      "true",
    );
  });

  it("passes table size to Badge, Tag and Kbd without explicit size", () => {
    type ChipRow = { id: number };
    const chipColumns: DataTableColumn<ChipRow>[] = [
      {
        id: "badge",
        header: "B",
        cell: () => <Badge.Root color="blue">b</Badge.Root>,
      },
      {
        id: "tag",
        header: "T",
        cell: () => <Tag.Root>t</Tag.Root>,
      },
      {
        id: "kbd",
        header: "K",
        cell: () => <Kbd.Root>⌘</Kbd.Root>,
      },
    ];

    render(
      <DataTable.Root size="l" rows={[{ id: 1 }]} columns={chipColumns} showPagination={false} />,
    );

    expect(screen.getByText("b")).toHaveAttribute("data-size", "l");
    expect(screen.getByText("t").closest("span[data-size]")).toHaveAttribute("data-size", "l");
    expect(screen.getByText("⌘")).toHaveAttribute("data-size", "l");
  });

  it("supports onClick callbacks for header, row and cell", () => {
    const onHeaderClick = vi.fn();
    const onCellClick = vi.fn();
    const onRowClick = vi.fn();
    const clickableColumns: DataTableColumn<Row>[] = [
      { id: "name", header: "Name", accessor: "name", sortable: true, onHeaderClick, onCellClick },
      { id: "score", header: "Score", accessor: "score", sortable: true, align: "end" },
    ];
    render(
      <DataTable.Root
        rows={rows.slice(0, 1)}
        columns={clickableColumns}
        showPagination={false}
        onRowClick={onRowClick}
      />,
    );

    fireEvent.click(screen.getByText("Name"));
    fireEvent.click(screen.getByText("C"));

    expect(onHeaderClick).toHaveBeenCalledTimes(1);
    expect(onCellClick).toHaveBeenCalledTimes(1);
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });

  it("loads additional rows in infinite mode on intersection", () => {
    const callbacks: Array<(entries: IntersectionObserverEntry[]) => void> = [];
    const options: Array<IntersectionObserverInit | undefined> = [];

    class MockIntersectionObserver {
      callback: (entries: IntersectionObserverEntry[]) => void;

      constructor(
        cb: (entries: IntersectionObserverEntry[]) => void,
        init?: IntersectionObserverInit,
      ) {
        this.callback = cb;
        callbacks.push(cb);
        options.push(init);
      }

      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
      root = null;
      rootMargin = `0${CSS_PX_SUFFIX}`;
      thresholds = [];
    }

    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

    render(
      <DataTable.Root
        rows={rows}
        columns={columns}
        infiniteScroll
        initialVisibleRows={2}
        infiniteBatchSize={2}
        showPagination={false}
      />,
    );

    expect(screen.getByText("Показано 1–2 из 6")).toBeInTheDocument();
    expect(screen.queryByText("B")).not.toBeInTheDocument();
    expect(options[0]?.rootMargin).toBe(DATA_TABLE_INFINITE_ROOT_MARGIN);

    act(() => {
      callbacks[0]?.([{ isIntersecting: true } as IntersectionObserverEntry]);
    });

    expect(screen.getByText("Показано 1–4 из 6")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it("sets data-highlight-row false when row hover is disabled", () => {
    const { container } = render(
      <DataTable.Root rows={rows.slice(0, 2)} columns={columns} highlightRowOnHover={false} />,
    );
    expect(container.querySelector("[data-highlight-row]")).toHaveAttribute(
      "data-highlight-row",
      "false",
    );
  });

  it("applies striped data-stripe on alternating body rows", () => {
    const { container } = render(
      <DataTable.Root rows={rows.slice(0, 4)} columns={columns} striped pageSize={10} />,
    );
    expect(container.querySelectorAll('tr[data-stripe="alt"]')).toHaveLength(2);
  });

  it("applies proportional col widths from grow when fillWidth and no column width", () => {
    const growColumns: DataTableColumn<Row>[] = [
      { id: "name", header: "Name", accessor: "name", grow: 1 },
      { id: "score", header: "Score", accessor: "score", grow: 3 },
    ];
    const { container } = render(
      <DataTable.Root rows={rows.slice(0, 1)} columns={growColumns} showPagination={false} />,
    );
    const cols = container.querySelectorAll("colgroup col");
    expect(cols).toHaveLength(2);
    expect(cols[0]).toHaveStyle({ width: "25%" });
    expect(cols[1]).toHaveStyle({ width: "75%" });
  });

  it("does not render colgroup when fillWidth is false", () => {
    const { container } = render(
      <DataTable.Root
        rows={rows.slice(0, 1)}
        columns={columns}
        showPagination={false}
        fillWidth={false}
      />,
    );
    expect(container.querySelector("colgroup")).toBeNull();
  });

  it("applies width, minWidth and maxWidth to header and body cells", () => {
    const sizedColumns: DataTableColumn<Row>[] = [
      { id: "name", header: "Name", accessor: "name", width: "8rem" },
      { id: "score", header: "Score", accessor: "score", minWidth: "4rem", maxWidth: "10rem" },
    ];
    render(
      <DataTable.Root rows={rows.slice(0, 1)} columns={sizedColumns} showPagination={false} />,
    );

    const nameHeader = screen.getByRole("columnheader", { name: "Name" });
    const scoreHeader = screen.getByRole("columnheader", { name: "Score" });
    expect(nameHeader).toHaveStyle({ width: "8rem" });
    expect(scoreHeader).toHaveStyle({ minWidth: "4rem", maxWidth: "10rem" });

    const scoreCell = screen.getByRole("cell", { name: "32" });
    expect(scoreCell).toHaveStyle({ minWidth: "4rem", maxWidth: "10rem" });
  });

  it("highlights column on cell mouse enter and clears on table mouse leave", () => {
    const { container } = render(
      <DataTable.Root rows={rows.slice(0, 2)} columns={columns} highlightColumnOnHover />,
    );
    const table = container.querySelector("table");
    expect(table).toBeTruthy();
    const nameCell = screen.getByRole("cell", { name: "C" });
    fireEvent.mouseEnter(nameCell);
    expect(nameCell).toHaveAttribute("data-column-hovered", "true");
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAttribute(
      "data-column-hovered",
      "true",
    );
    fireEvent.mouseLeave(table as HTMLTableElement);
    expect(nameCell).not.toHaveAttribute("data-column-hovered");
  });
});
