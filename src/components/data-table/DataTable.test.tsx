import { readFileSync } from "node:fs";
import { join } from "node:path";

import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Badge } from "@/components/badge/Badge";
import { Kbd } from "@/components/kbd/Kbd";
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

  it("marks sorted column header with aria-sort", () => {
    render(<DataTable.Root rows={rows.slice(0, 3)} columns={columns} pageSize={10} />);
    const nameHeader = screen.getByText("Name").closest("th") as Element;
    expect(nameHeader).toHaveAttribute("aria-sort", "none");
    fireEvent.click(nameHeader);
    expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
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
    fireEvent.click(screen.getByRole("button", { name: "Страница 2" }));
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

  it("passes table size to Badge and Kbd without explicit size", () => {
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
        cell: () => <Badge.Root>t</Badge.Root>,
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

    expect(screen.getByText("b").closest("span[data-size]")).toHaveAttribute("data-size", "l");
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

  it("does not use colgroup; column widths follow automatic table layout", () => {
    const { container } = render(
      <DataTable.Root rows={rows.slice(0, 1)} columns={columns} showPagination={false} />,
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
  it("renders a focusable sort button inside sortable headers", () => {
    render(<DataTable.Root rows={rows.slice(0, 3)} columns={columns} pageSize={10} />);
    const button = screen.getByRole("button", { name: "Name" });
    fireEvent.click(button);
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
  });

  it("shows skeleton rows and a status message while loading without rows", () => {
    const { container } = render(
      <DataTable.Root rows={[]} columns={columns} loading loadingRows={3} />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Загрузка данных…");
    expect(container.querySelectorAll('tbody tr[data-skeleton="true"]')).toHaveLength(3);
    expect(container.querySelector("table")).toHaveAttribute("aria-busy", "true");
  });

  it("renders error state instead of rows", () => {
    render(<DataTable.Root rows={rows} columns={columns} error="Не удалось загрузить" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Не удалось загрузить");
    expect(screen.queryByText("A")).not.toBeInTheDocument();
  });

  it("renders the default empty label, the empty slot and label overrides", () => {
    const { rerender } = render(<DataTable.Root rows={[]} columns={columns} />);
    expect(screen.getByText("Нет данных для отображения.")).toBeInTheDocument();
    rerender(<DataTable.Root rows={[]} columns={columns} empty={<strong>Пусто</strong>} />);
    expect(screen.getByText("Пусто").tagName).toBe("STRONG");
    rerender(<DataTable.Root rows={[]} columns={columns} labels={{ empty: "Nothing" }} />);
    expect(screen.getByText("Nothing")).toBeInTheDocument();
  });

  it("renders the range line from labels.range", () => {
    render(
      <DataTable.Root
        rows={rows}
        columns={columns}
        pageSize={2}
        labels={{ range: (from, to, total) => `${from}-${to}/${total}` }}
      />,
    );
    expect(screen.getByText(`1-2/${rows.length}`)).toBeInTheDocument();
  });

  it("marks selected rows", () => {
    render(
      <DataTable.Root
        rows={rows.slice(0, 2)}
        columns={columns}
        getRowKey={(row) => row.id}
        selectable
        defaultSelected={[2]}
      />,
    );
    expect(screen.getByText("A").closest("tr")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("C").closest("tr")).toHaveAttribute("aria-selected", "false");
  });

  it("aligns numeric columns to end by default and keeps explicit align", () => {
    const numericColumns: DataTableColumn<Row>[] = [
      { id: "name", header: "Name", accessor: "name" },
      { id: "score", header: "Score", accessor: "score", numeric: true },
      { id: "id", header: "Id", accessor: "id", numeric: true, align: "center" },
    ];
    render(
      <DataTable.Root rows={rows.slice(0, 1)} columns={numericColumns} showPagination={false} />,
    );
    const scoreCell = screen.getByRole("cell", { name: "32" });
    expect(scoreCell).toHaveAttribute("data-align", "end");
    expect(scoreCell).toHaveAttribute("data-numeric", "true");
    expect(screen.getByRole("cell", { name: "1" })).toHaveAttribute("data-align", "center");
  });

  it("truncates long text and exposes it in title", () => {
    const truncColumns: DataTableColumn<Row>[] = [
      { id: "name", header: "Name", accessor: "name", truncate: true, maxWidth: "6rem" },
    ];
    render(
      <DataTable.Root
        rows={[{ id: 1, name: "Очень длинное название позиции", score: 1 }]}
        columns={truncColumns}
        showPagination={false}
      />,
    );
    expect(screen.getByText("Очень длинное название позиции")).toHaveAttribute(
      "title",
      "Очень длинное название позиции",
    );
  });

  it("renders toolbar slot", () => {
    render(
      <DataTable.Root rows={rows.slice(0, 1)} columns={columns} toolbar={<span>Фильтры</span>} />,
    );
    expect(screen.getByText("Фильтры")).toBeInTheDocument();
  });
});

describe("DataTable CSS contract", () => {
  const css = readFileSync(join(__dirname, "DataTable.module.css"), "utf8");
  const block = (selector: string) => {
    const start = css.indexOf(`\n${selector} {`);
    expect(start).toBeGreaterThanOrEqual(0);
    return css.slice(start, css.indexOf("}", start));
  };

  it("is full-bleed: the viewport has no padding and the root clips to its radius", () => {
    expect(block(".viewport")).toMatch(/padding:\s*0;/);
    const root = block(".root");
    expect(root).toMatch(/overflow:\s*(hidden|clip);/);
    expect(root).toMatch(/border-radius:\s*var\(--prime-card-radius\)/);
    expect(root).toMatch(/background:\s*var\(--dt-surface\)/);
    expect(root).toMatch(/--dt-surface:\s*var\(--prime-color-card-bg\)/);
  });

  it("uses the inset focus ring for edge focusables", () => {
    expect(css).toMatch(
      /\.headCell:has\(\.sortButton:focus-visible\)\s*\{[^}]*outline-offset:\s*var\(--prime-focus-offset-inset\)/,
    );
  });

  describe("selection", () => {
    const five = rows.slice(0, 5);
    function Selectable(props: {
      onSelectedChange?: (keys: React.Key[]) => void;
      onRowClick?: () => void;
    }) {
      return (
        <DataTable.Root
          rows={five}
          columns={columns}
          getRowKey={(row) => row.id}
          getRowLabel={(row) => row.name}
          selectable
          showPagination={false}
          {...props}
        />
      );
    }
    const box = (name: string) => screen.getByRole("checkbox", { name: `Выбрать: ${name}` });

    it("toggles a row on click, announces the count and keeps the row click out", async () => {
      const user = userEvent.setup();
      const onSelectedChange = vi.fn();
      const onRowClick = vi.fn();
      render(<Selectable onSelectedChange={onSelectedChange} onRowClick={onRowClick} />);
      await user.click(box("C"));
      expect(onSelectedChange).toHaveBeenLastCalledWith([1]);
      expect(box("C")).toBeChecked();
      expect(box("C")).toHaveFocus();
      expect(screen.getByText("C").closest("tr")).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("status")).toHaveTextContent("Выбрано: 1");
      expect(onRowClick).not.toHaveBeenCalled();
      await user.click(box("C"));
      expect(onSelectedChange).toHaveBeenLastCalledWith([]);
      expect(box("C")).not.toBeChecked();
    });

    it("Space on a focused checkbox toggles it", async () => {
      const user = userEvent.setup();
      render(<Selectable />);
      box("A").focus();
      await user.keyboard(" ");
      expect(box("A")).toBeChecked();
      await user.keyboard(" ");
      expect(box("A")).not.toBeChecked();
    });

    it("Shift+click selects the range from the last clicked row", async () => {
      const user = userEvent.setup();
      render(<Selectable />);
      await user.click(box("C"));
      await user.keyboard("{Shift>}");
      await user.click(box("B"));
      await user.keyboard("{/Shift}");
      for (const name of ["C", "A", "B"]) expect(box(name)).toBeChecked();
      for (const name of ["D", "E"]) expect(box(name)).not.toBeChecked();
      expect(screen.getByRole("status")).toHaveTextContent("Выбрано: 3");
      // Shift+click on a selected row clears the range back to the anchor.
      await user.keyboard("{Shift>}");
      await user.click(box("A"));
      await user.keyboard("{/Shift}");
      expect(box("A")).not.toBeChecked();
      expect(box("B")).not.toBeChecked();
      expect(box("C")).toBeChecked();
    });

    it("press-and-drag across checkboxes applies the first box's new state to every row passed", () => {
      render(<Selectable />);
      const cells = five.map((row) => box(row.name).closest("td") as HTMLElement);
      const original = document.elementFromPoint;
      let over: Element = cells[0];
      document.elementFromPoint = () => over;
      try {
        fireEvent.pointerDown(cells[0], { button: 0, pointerType: "mouse" });
        expect(screen.getByText("C").closest("[data-dragging]")).toBeNull();
        over = cells[3];
        fireEvent.pointerMove(window, { clientX: 1, clientY: 1 });
        expect(screen.getByText("C").closest("[data-dragging]")).toHaveAttribute(
          "data-dragging",
          "true",
        );
        fireEvent.pointerUp(window);
      } finally {
        document.elementFromPoint = original;
      }
      for (const name of ["C", "A", "B", "D"]) expect(box(name)).toBeChecked();
      expect(box("E")).not.toBeChecked();
      expect(screen.getByText("C").closest("[data-dragging]")).toBeNull();
    });

    it("header checkbox: indeterminate on partial, selects and clears all", async () => {
      const user = userEvent.setup();
      render(<Selectable />);
      const all = screen.getByRole("checkbox", { name: "Выбрать все строки" }) as HTMLInputElement;
      expect(all.indeterminate).toBe(false);
      await user.click(box("A"));
      expect(all.indeterminate).toBe(true);
      await user.click(all);
      for (const row of five) expect(box(row.name)).toBeChecked();
      expect(all).toBeChecked();
      expect(all.indeterminate).toBe(false);
      await user.click(all);
      for (const row of five) expect(box(row.name)).not.toBeChecked();
    });
  });

  describe("expandable rows", () => {
    type Node = { id: string; name: string; score: number; children?: Node[] };
    const tree: Node[] = [
      {
        id: "denis",
        name: "Денис",
        score: 2,
        children: [
          { id: "denis-b", name: "Расходы компании", score: 9 },
          { id: "denis-a", name: "Выплата", score: 1 },
        ],
      },
      { id: "olga", name: "Ольга", score: 1 },
    ];
    const treeColumns: DataTableColumn<Node>[] = [
      { id: "name", header: "Имя", accessor: "name" },
      { id: "score", header: "Score", accessor: "score", sortable: true, numeric: true },
    ];

    it("toggles sub-rows with an accessible chevron and reports ids", async () => {
      const user = userEvent.setup();
      const onExpandedChange = vi.fn();
      const onRowClick = vi.fn();
      render(
        <DataTable.Root
          rows={tree}
          columns={treeColumns}
          getRowKey={(row) => row.id}
          getRowLabel={(row) => row.name}
          getRowChildren={(row) => row.children}
          onExpandedChange={onExpandedChange}
          onRowClick={onRowClick}
        />,
      );
      expect(screen.queryByText("Выплата")).toBeNull();
      // Only rows with children get a toggle.
      expect(screen.getAllByRole("button", { name: /Развернуть/ })).toHaveLength(1);
      const toggle = screen.getByRole("button", { name: "Развернуть: Денис" });
      expect(toggle).toHaveAttribute("aria-expanded", "false");
      await user.click(toggle);
      expect(onExpandedChange).toHaveBeenLastCalledWith(["denis"]);
      expect(onRowClick).not.toHaveBeenCalled();
      const collapse = screen.getByRole("button", { name: "Свернуть: Денис" });
      expect(collapse).toHaveAttribute("aria-expanded", "true");
      const child = screen.getByText("Выплата").closest("tr") as HTMLElement;
      expect(child).toHaveAttribute("data-depth", "1");
      expect(child).toHaveAttribute("data-animate", "true");
      expect(collapse.getAttribute("aria-controls")?.split(" ")).toContain(child.id);
      expect(screen.getByText("Денис").closest("tr")).toHaveAttribute("data-expanded", "true");
      await user.click(collapse);
      expect(screen.queryByText("Выплата")).toBeNull();
    });

    it("sorts sub-rows with the parent and keeps them under it", async () => {
      const user = userEvent.setup();
      render(
        <DataTable.Root
          rows={tree}
          columns={treeColumns}
          getRowKey={(row) => row.id}
          getRowChildren={(row) => row.children}
          defaultExpanded={["denis"]}
        />,
      );
      await user.click(screen.getByRole("button", { name: /Score/ }));
      const names = screen
        .getAllByRole("row")
        .slice(1)
        .map((row) => within(row).getAllByRole("cell")[1]?.textContent);
      expect(names).toEqual(["Ольга", "Денис", "Выплата", "Расходы компании"]);
    });

    it("renders a detail panel for renderExpanded and works with selection", async () => {
      const user = userEvent.setup();
      render(
        <DataTable.Root
          rows={tree}
          columns={treeColumns}
          getRowKey={(row) => row.id}
          getRowLabel={(row) => row.name}
          renderExpanded={(row) => <p>Детали: {row.name}</p>}
          isRowExpandable={(row) => row.id === "olga"}
          selectable
        />,
      );
      expect(screen.getAllByRole("button", { name: /Развернуть/ })).toHaveLength(1);
      const toggle = screen.getByRole("button", { name: "Развернуть: Ольга" });
      await user.click(toggle);
      const detail = screen.getByText("Детали: Ольга");
      const detailRow = detail.closest("tr") as HTMLElement;
      expect(toggle).toHaveAttribute("aria-controls", detailRow.id);
      expect(within(detailRow).getByRole("cell")).toHaveAttribute("colspan", "4");
      await user.click(screen.getByRole("checkbox", { name: "Выбрать: Ольга" }));
      expect(screen.getByText("Ольга").closest("tr")).toHaveAttribute("aria-selected", "true");
    });
  });
});
