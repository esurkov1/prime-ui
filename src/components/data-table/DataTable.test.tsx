import { readFileSync } from "node:fs";
import { join } from "node:path";

import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Badge } from "@/components/badge/Badge";
import { Kbd } from "@/components/kbd/Kbd";
import swapMotion from "@/internal/swapMotion.module.css";

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
  it("draws column dividers by default and drops them with columnDividers={false}", () => {
    const { container, rerender } = render(<DataTable rows={rows} columns={columns} />);
    const root = container.querySelector("[data-size]");
    expect(root).not.toHaveAttribute("data-column-dividers");
    rerender(<DataTable rows={rows} columns={columns} columnDividers={false} />);
    expect(root).toHaveAttribute("data-column-dividers", "false");
  });

  it("CSS: rows grow with content, sort icon sits at the end edge and stays quiet", () => {
    const css = readFileSync(join(__dirname, "DataTable.module.css"), "utf8");
    expect(css).toMatch(/\.cell \{[^}]*padding: var\(--dt-pad-y\) var\(--dt-pad-x\)/);
    expect(css).not.toMatch(/row-reverse/);
    expect(css).not.toMatch(/\.sortIcon[^{]*\{[^}]*accent/);
  });

  it("renders headers and rows", () => {
    render(<DataTable rows={rows.slice(0, 2)} columns={columns} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
    expect(screen.getByText("Name").closest("div[data-size]")).not.toHaveAttribute(
      "data-row-dividers",
    );
  });

  it("marks sorted column header with aria-sort", () => {
    render(<DataTable rows={rows.slice(0, 3)} columns={columns} pageSize={10} />);
    const nameHeader = screen.getByText("Name").closest("th") as Element;
    expect(nameHeader).toHaveAttribute("aria-sort", "none");
    fireEvent.click(nameHeader);
    expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
  });

  it("sorts rows by header click and toggles asc/desc", () => {
    render(<DataTable rows={rows.slice(0, 3)} columns={columns} pageSize={10} />);

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
    render(<DataTable rows={rows} columns={columns} pageSize={2} />);

    expect(screen.getByText("Показано 1–2 из 6")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Страница 2" }));
    expect(screen.getByText("Показано 3–4 из 6")).toBeInTheDocument();
  });

  it("drops row dividers with rowDividers={false}", () => {
    render(<DataTable rows={rows.slice(0, 2)} columns={columns} rowDividers={false} />);
    expect(screen.getByText("Name").closest("div[data-size]")).toHaveAttribute(
      "data-row-dividers",
      "false",
    );
  });

  it("allows hiding column header row", () => {
    render(<DataTable rows={rows.slice(0, 2)} columns={columns} showHeader={false} />);

    expect(screen.queryByRole("columnheader", { name: "Name" })).not.toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "C" })).toBeInTheDocument();
    expect(document.querySelector("thead")).toBeNull();
  });

  it("keeps first column as regular cells", () => {
    render(<DataTable rows={rows.slice(0, 2)} columns={columns} paging="none" />);

    expect(screen.queryByRole("rowheader")).not.toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "C" })).toBeInTheDocument();
  });

  it("exposes sticky header and sticky first column flags on root", () => {
    render(<DataTable rows={rows.slice(0, 2)} columns={columns} stickyHeader stickyFirstColumn />);

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
        cell: () => <Kbd>⌘</Kbd>,
      },
    ];

    render(<DataTable size="l" rows={[{ id: 1 }]} columns={chipColumns} paging="none" />);

    expect(screen.getByText("b").closest("span[data-size]")).toHaveAttribute("data-size", "l");
    expect(screen.getByText("t").closest("span[data-size]")).toHaveAttribute("data-size", "l");
    expect(screen.getByText("⌘")).toHaveAttribute("data-size", "l");
  });

  it("calls onRowClick with the row and its index", () => {
    const onRowClick = vi.fn();
    render(
      <DataTable rows={rows.slice(0, 2)} columns={columns} paging="none" onRowClick={onRowClick} />,
    );
    fireEvent.click(screen.getByText("A"));
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick.mock.calls[0]?.[0]).toBe(rows[1]);
    expect(onRowClick.mock.calls[0]?.[1]).toBe(1);
  });

  it("starts on defaultPage", () => {
    render(<DataTable rows={rows} columns={columns} pageSize={2} defaultPage={2} />);
    expect(screen.getByText("Показано 3–4 из 6")).toBeInTheDocument();
  });

  it("a controlled page is shown as is: no onPageChange on mount", () => {
    const onPageChange = vi.fn();
    render(
      <DataTable rows={rows} columns={columns} pageSize={2} page={3} onPageChange={onPageChange} />,
    );
    expect(screen.getByText("Показано 5–6 из 6")).toBeInTheDocument();
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("an out-of-range page renders the last page without writing it back", () => {
    const onPageChange = vi.fn();
    render(
      <DataTable rows={rows} columns={columns} pageSize={2} page={9} onPageChange={onPageChange} />,
    );
    expect(screen.getByText("Показано 5–6 из 6")).toBeInTheDocument();
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("an inline onPageChange never resets the page on re-render", () => {
    const { rerender } = render(
      <DataTable rows={rows} columns={columns} pageSize={2} onPageChange={() => {}} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Страница 2" }));
    rerender(<DataTable rows={rows} columns={columns} pageSize={2} onPageChange={() => {}} />);
    expect(screen.getByText("Показано 3–4 из 6")).toBeInTheDocument();
  });

  it("a new sort returns to page 1", () => {
    render(<DataTable rows={rows} columns={columns} pageSize={2} defaultPage={2} />);
    fireEvent.click(screen.getByRole("button", { name: "Name" }));
    expect(screen.getByText("Показано 1–2 из 6")).toBeInTheDocument();
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
      rootMargin = "0px";
      thresholds = [];
    }

    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

    render(
      <DataTable
        rows={rows}
        columns={columns}
        paging="infinite"
        pageSize={2}
        infiniteBatchSize={2}
      />,
    );

    expect(screen.getByText("Показано 1–2 из 6")).toBeInTheDocument();
    expect(screen.queryByText("B")).not.toBeInTheDocument();
    expect(options[0]?.rootMargin).toBe("0px 0px 120px 0px");

    act(() => {
      callbacks[0]?.([{ isIntersecting: true } as IntersectionObserverEntry]);
    });

    expect(screen.getByText("Показано 1–4 из 6")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it("sets data-highlight-row false when row hover is disabled", () => {
    const { container } = render(
      <DataTable rows={rows.slice(0, 2)} columns={columns} highlightRowOnHover={false} />,
    );
    expect(container.querySelector("[data-highlight-row]")).toHaveAttribute(
      "data-highlight-row",
      "false",
    );
  });

  it("applies striped data-stripe on alternating body rows", () => {
    const { container } = render(
      <DataTable rows={rows.slice(0, 4)} columns={columns} striped pageSize={10} />,
    );
    expect(container.querySelectorAll('tr[data-stripe="alt"]')).toHaveLength(2);
  });

  it("stays in automatic table layout until the columns are laid out", () => {
    const { container } = render(
      <DataTable rows={rows.slice(0, 1)} columns={columns} paging="none" />,
    );
    // jsdom lays nothing out: widths come from the browser's automatic layout, nothing is frozen.
    expect((container.querySelector("table") as HTMLTableElement).style.tableLayout).toBe("");
    for (const col of container.querySelectorAll<HTMLTableColElement>("colgroup col")) {
      expect(col.style.width).toBe("");
    }
  });

  it("applies width, minWidth and maxWidth to header and body cells", () => {
    const sizedColumns: DataTableColumn<Row>[] = [
      { id: "name", header: "Name", accessor: "name", width: "8rem" },
      { id: "score", header: "Score", accessor: "score", minWidth: "4rem", maxWidth: "10rem" },
    ];
    render(<DataTable rows={rows.slice(0, 1)} columns={sizedColumns} paging="none" />);

    const nameHeader = screen.getByRole("columnheader", { name: "Name" });
    const scoreHeader = screen.getByRole("columnheader", { name: "Score" });
    expect(nameHeader).toHaveStyle({ width: "8rem" });
    expect(scoreHeader).toHaveStyle({ minWidth: "4rem", maxWidth: "10rem" });

    const scoreCell = screen.getByRole("cell", { name: "32" });
    expect(scoreCell).toHaveStyle({ minWidth: "4rem", maxWidth: "10rem" });
  });

  it("highlights the hovered column in the DOM without re-rendering the rows", () => {
    let cellRenders = 0;
    const counted: DataTableColumn<Row>[] = [
      {
        id: "name",
        header: "Name",
        cell: (row) => {
          cellRenders += 1;
          return row.name;
        },
      },
      { id: "score", header: "Score", accessor: "score" },
    ];
    const { container } = render(
      <DataTable rows={rows.slice(0, 2)} columns={counted} highlightColumnOnHover />,
    );
    const table = container.querySelector("table") as HTMLTableElement;
    const nameCell = screen.getByRole("cell", { name: "C" });
    const scoreCell = screen.getByRole("cell", { name: "32" });
    cellRenders = 0;
    fireEvent.pointerOver(nameCell);
    expect(nameCell).toHaveAttribute("data-column-hovered", "true");
    expect(screen.getByRole("cell", { name: "A" })).toHaveAttribute("data-column-hovered", "true");
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAttribute(
      "data-column-hovered",
      "true",
    );
    fireEvent.pointerOver(scoreCell);
    expect(nameCell).not.toHaveAttribute("data-column-hovered");
    expect(scoreCell).toHaveAttribute("data-column-hovered", "true");
    fireEvent.pointerLeave(table);
    expect(scoreCell).not.toHaveAttribute("data-column-hovered");
    expect(cellRenders).toBe(0);
  });

  it("leaves the column highlight off without highlightColumnOnHover", () => {
    render(<DataTable rows={rows.slice(0, 2)} columns={columns} />);
    const nameCell = screen.getByRole("cell", { name: "C" });
    fireEvent.pointerOver(nameCell);
    expect(nameCell).not.toHaveAttribute("data-column-hovered");
  });

  it("renders a focusable sort button inside sortable headers", () => {
    render(<DataTable rows={rows.slice(0, 3)} columns={columns} pageSize={10} />);
    const button = screen.getByRole("button", { name: "Name" });
    fireEvent.click(button);
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
  });

  it("shows skeleton rows and a status message while loading without rows", () => {
    const { container } = render(<DataTable rows={[]} columns={columns} loading loadingRows={3} />);
    expect(screen.getByRole("status")).toHaveTextContent("Загрузка данных…");
    expect(container.querySelectorAll('tbody tr[data-skeleton="true"]')).toHaveLength(3);
    expect(container.querySelector("table")).toHaveAttribute("aria-busy", "true");
  });

  it("fades the body in on a state swap, never on the first render or a re-sort", () => {
    const body = (container: HTMLElement) =>
      container.querySelector("table:not([aria-hidden]) > tbody") as HTMLElement;
    const { container, rerender } = render(
      <DataTable rows={[]} columns={columns} loading loadingRows={3} />,
    );
    expect(body(container)).not.toHaveClass(swapMotion.swapIn);

    rerender(<DataTable rows={rows} columns={columns} getRowKey={(row) => row.id} />);
    const loaded = body(container);
    expect(loaded).toHaveClass(swapMotion.swapIn);

    // Same state (rows → rows): the body is not remounted, so nothing replays.
    fireEvent.click(screen.getByRole("button", { name: "Name" }));
    expect(body(container)).toBe(loaded);

    rerender(<DataTable rows={[]} columns={columns} error="Не удалось загрузить" />);
    expect(body(container)).not.toBe(loaded);
    expect(body(container)).toHaveClass(swapMotion.swapIn);
  });

  it("renders error state instead of rows", () => {
    render(<DataTable rows={rows} columns={columns} error="Не удалось загрузить" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Не удалось загрузить");
    expect(screen.queryByText("A")).not.toBeInTheDocument();
  });

  it("renders the default empty label, the empty slot and label overrides", () => {
    const { rerender } = render(<DataTable rows={[]} columns={columns} />);
    expect(screen.getByText("Нет данных для отображения.")).toBeInTheDocument();
    rerender(<DataTable rows={[]} columns={columns} empty={<strong>Пусто</strong>} />);
    expect(screen.getByText("Пусто").tagName).toBe("STRONG");
    rerender(<DataTable rows={[]} columns={columns} labels={{ empty: "Nothing" }} />);
    expect(screen.getByText("Nothing")).toBeInTheDocument();
  });

  it("renders the range line from labels.range", () => {
    render(
      <DataTable
        rows={rows}
        columns={columns}
        pageSize={2}
        labels={{ range: "{from}-{to}/{total}" }}
      />,
    );
    expect(screen.getByText(`1-2/${rows.length}`)).toBeInTheDocument();
  });

  it("marks selected rows", () => {
    render(
      <DataTable
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
    render(<DataTable rows={rows.slice(0, 1)} columns={numericColumns} paging="none" />);
    const scoreCell = screen.getByRole("cell", { name: "32" });
    expect(scoreCell).toHaveAttribute("data-align", "end");
    expect(scoreCell).toHaveAttribute("data-numeric", "true");
    expect(screen.getByRole("cell", { name: "1" })).toHaveAttribute("data-align", "center");
  });

  it("starts every header at the start edge unless headerAlign is set", () => {
    const numericColumns: DataTableColumn<Row>[] = [
      { id: "score", header: "Score", accessor: "score", numeric: true, sortable: true },
      { id: "id", header: "Id", accessor: "id", numeric: true, headerAlign: "end" },
    ];
    render(<DataTable rows={rows.slice(0, 1)} columns={numericColumns} paging="none" />);
    expect(screen.getByRole("columnheader", { name: "Score" })).toHaveAttribute(
      "data-align",
      "start",
    );
    expect(screen.getByRole("columnheader", { name: "Id" })).toHaveAttribute("data-align", "end");
  });

  it("truncates long text and exposes it in title", () => {
    const truncColumns: DataTableColumn<Row>[] = [
      { id: "name", header: "Name", accessor: "name", truncate: true, maxWidth: "6rem" },
    ];
    render(
      <DataTable
        rows={[{ id: 1, name: "Очень длинное название позиции", score: 1 }]}
        columns={truncColumns}
        paging="none"
      />,
    );
    expect(screen.getByText("Очень длинное название позиции")).toHaveAttribute(
      "title",
      "Очень длинное название позиции",
    );
  });

  it("renders toolbar slot", () => {
    render(<DataTable rows={rows.slice(0, 1)} columns={columns} toolbar={<span>Фильтры</span>} />);
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
    expect(root).toMatch(/--dt-surface:\s*var\(--prime-color-layer-current\)/);
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
        <DataTable
          rows={five}
          columns={columns}
          getRowKey={(row) => row.id}
          getRowLabel={(row) => row.name}
          selectable
          paging="none"
          {...props}
        />
      );
    }
    const box = (name: string) => screen.getByRole("checkbox", { name: `Выбрать строку ${name}` });

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

    it("a click on the box visual (the label forwards it to the input) toggles once", async () => {
      const user = userEvent.setup();
      render(<Selectable />);
      const visual = box("C").nextElementSibling as HTMLElement;
      await user.click(visual);
      expect(box("C")).toBeChecked();
      await user.click(box("C").closest("td") as HTMLElement);
      expect(box("C")).not.toBeChecked();
    });

    it("a drag that returns to its first box ends without toggling it back", () => {
      render(<Selectable />);
      const cells = five.map((row) => box(row.name).closest("td") as HTMLElement);
      const original = document.elementFromPoint;
      let over: Element = cells[0];
      document.elementFromPoint = () => over;
      try {
        fireEvent.pointerDown(cells[0], { button: 0, pointerType: "mouse" });
        over = cells[2];
        fireEvent.pointerMove(window, { clientX: 1, clientY: 1 });
        over = cells[0];
        fireEvent.pointerMove(window, { clientX: 2, clientY: 2 });
        fireEvent.pointerUp(window);
        fireEvent.click(cells[0], { detail: 1 });
      } finally {
        document.elementFromPoint = original;
      }
      expect(box("C")).toBeChecked();
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
        <DataTable
          rows={tree}
          columns={treeColumns}
          getRowKey={(row) => row.id}
          getRowLabel={(row) => row.name}
          getRowChildren={(row) => row.children}
          onExpandedChange={onExpandedChange}
          onRowClick={onRowClick}
        />,
      );
      // Collapsed sub-rows exist only in the hidden measuring body (column widths), not as rows.
      expect(screen.queryByRole("cell", { name: "Выплата" })).toBeNull();
      expect(screen.getByText("Выплата").closest("tbody")).toHaveAttribute("aria-hidden", "true");
      // Only rows with children get a toggle.
      expect(screen.getAllByRole("button", { name: /Развернуть/ })).toHaveLength(1);
      const toggle = screen.getByRole("button", { name: "Развернуть строку Денис" });
      expect(toggle).toHaveAttribute("aria-expanded", "false");
      await user.click(toggle);
      expect(onExpandedChange).toHaveBeenLastCalledWith(["denis"]);
      expect(onRowClick).not.toHaveBeenCalled();
      const collapse = screen.getByRole("button", { name: "Свернуть строку Денис" });
      expect(collapse).toHaveAttribute("aria-expanded", "true");
      const child = screen.getByText("Выплата").closest("tr") as HTMLElement;
      expect(child).toHaveAttribute("data-level", "1");
      // `data-depth` is the surface ladder's attribute; a sub-row must never take it.
      expect(child).not.toHaveAttribute("data-depth");
      expect(child).toHaveAttribute("data-animate", "true");
      // A sub-row folds open like the detail panel.
      expect(child).toHaveAttribute("data-fold", "opening");
      expect(collapse.getAttribute("aria-controls")?.split(" ")).toContain(child.id);
      expect(screen.getByText("Денис").closest("tr")).toHaveAttribute("data-expanded", "true");
      await user.click(collapse);
      // It folds shut first, then unmounts.
      expect(screen.getByText("Выплата").closest("tr")).toHaveAttribute("data-fold", "closed");
      await waitFor(() => expect(screen.queryByRole("cell", { name: "Выплата" })).toBeNull());
    });

    it("measures only the direct sub-rows of a collapsed row", () => {
      const deep: Node[] = [
        {
          id: "root",
          name: "Корень",
          score: 1,
          children: [
            {
              id: "child",
              name: "Ребёнок",
              score: 2,
              children: [{ id: "grand", name: "Внук", score: 3 }],
            },
          ],
        },
      ];
      render(
        <DataTable
          rows={deep}
          columns={treeColumns}
          getRowKey={(row) => row.id}
          getRowChildren={(row) => row.children}
        />,
      );
      expect(screen.getByText("Ребёнок").closest("tbody")).toHaveAttribute("aria-hidden", "true");
      expect(screen.queryByText("Внук")).toBeNull();
    });

    it("keeps the detail panel mounted while it closes, then removes it", async () => {
      vi.stubGlobal("matchMedia", (query: string) => ({
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }));
      try {
        const user = userEvent.setup();
        render(
          <DataTable
            rows={tree}
            columns={treeColumns}
            getRowKey={(row) => row.id}
            getRowLabel={(row) => row.name}
            renderExpanded={(row) => <p>Детали: {row.name}</p>}
            defaultExpanded={["olga"]}
          />,
        );
        const detailRow = screen.getByText("Детали: Ольга").closest("tr") as HTMLElement;
        expect(detailRow).toHaveAttribute("data-state", "open");
        await user.click(screen.getByRole("button", { name: "Свернуть строку Ольга" }));
        expect(detailRow).toHaveAttribute("data-state", "closed");
        expect(detailRow).toBeInTheDocument();
        const motion = detailRow.querySelector("td > div") as HTMLElement;
        fireEvent.transitionEnd(motion);
        expect(screen.queryByText("Детали: Ольга")).toBeNull();
      } finally {
        vi.unstubAllGlobals();
      }
    });

    it("marks rows newly added to the data for the enter animation, not the first fill", () => {
      const flat = tree.map(({ id, name, score }) => ({ id, name, score }));
      const { rerender } = render(
        <DataTable rows={flat} columns={treeColumns} getRowKey={(row) => row.id} />,
      );
      expect(screen.getByText("Денис").closest("tr")).not.toHaveAttribute("data-animate");
      rerender(
        <DataTable
          rows={[...flat, { id: "ivan", name: "Иван", score: 3 }]}
          columns={treeColumns}
          getRowKey={(row) => row.id}
        />,
      );
      expect(screen.getByText("Иван").closest("tr")).toHaveAttribute("data-animate", "true");
      expect(screen.getByText("Денис").closest("tr")).not.toHaveAttribute("data-animate");
    });

    it("sorts sub-rows with the parent and keeps them under it", async () => {
      const user = userEvent.setup();
      render(
        <DataTable
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
        <DataTable
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
      const toggle = screen.getByRole("button", { name: "Развернуть строку Ольга" });
      await user.click(toggle);
      const detail = screen.getByText("Детали: Ольга");
      const detailRow = detail.closest("tr") as HTMLElement;
      expect(toggle).toHaveAttribute("aria-controls", detailRow.id);
      expect(within(detailRow).getByRole("cell")).toHaveAttribute("colspan", "4");
      await user.click(screen.getByRole("checkbox", { name: "Выбрать строку Ольга" }));
      expect(screen.getByText("Ольга").closest("tr")).toHaveAttribute("aria-selected", "true");
    });
  });

  it("a grow column fills the table width and the table stops growing to its content", () => {
    const { container } = render(
      <DataTable
        rows={[{ id: 1, note: "Длинный комментарий" }]}
        columns={[
          { id: "id", header: "№", accessor: "id" },
          { id: "note", header: "Комментарий", accessor: "note", grow: true },
        ]}
        paging="none"
      />,
    );
    expect(container.querySelector("[data-table-width]")).toHaveAttribute(
      "data-table-width",
      "grow",
    );
    const noteCells = container.querySelectorAll<HTMLElement>('[data-column-id="note"]');
    for (const cell of noteCells) expect(cell.style.width).toBe("100%");
  });

  it("sorts from the keyboard: Tab reaches the sort button, Enter cycles the order", async () => {
    const user = userEvent.setup();
    render(<DataTable rows={rows.slice(0, 3)} columns={columns} />);
    await user.tab();
    expect(screen.getByRole("button", { name: "Name" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
  });

  it('paging="none" renders every row without a footer', () => {
    const { container } = render(
      <DataTable rows={rows} columns={columns} paging="none" pageSize={2} />,
    );
    expect(container.querySelectorAll("tbody tr")).toHaveLength(rows.length);
    expect(screen.queryByRole("navigation")).toBeNull();
  });

  it("hides the range line when every row is on screen", () => {
    render(
      <DataTable
        rows={[{ id: 1 }, { id: 2 }]}
        columns={[{ id: "id", header: "№", accessor: "id" }]}
        paging="none"
      />,
    );
    expect(screen.queryByText(/Показано/)).toBeNull();
  });

  it("freezes column widths once rows are laid out and keeps them for fewer rows", () => {
    let width = 120;
    const spy = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      () =>
        ({
          width,
          height: 20,
          top: 0,
          left: 0,
          right: width,
          bottom: 20,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }) as DOMRect,
    );
    const cols: DataTableColumn<Row>[] = [{ id: "name", header: "Name", accessor: "name" }];
    const { container, rerender } = render(
      <DataTable rows={rows} columns={cols} paging="none" pageSize={rows.length} />,
    );
    const table = container.querySelector("table") as HTMLTableElement;
    const col = container.querySelector("colgroup col") as HTMLTableColElement;
    expect(table.style.tableLayout).toBe("fixed");
    expect(col.style.width).toBe("120px");
    // A search narrows the rows: the column keeps its width.
    width = 60;
    rerender(
      <DataTable rows={rows.slice(0, 1)} columns={cols} paging="none" pageSize={rows.length} />,
    );
    expect(col.style.width).toBe("120px");
    spy.mockRestore();
  });

  it("frozen widths respect minWidth; a grow column keeps its minWidth as the table floor", () => {
    const spy = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      () =>
        ({
          width: 50,
          height: 20,
          top: 0,
          left: 0,
          right: 50,
          bottom: 20,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }) as DOMRect,
    );
    const cols: DataTableColumn<Row>[] = [
      { id: "name", header: "Name", accessor: "name", minWidth: "160px" },
      { id: "score", header: "Score", accessor: "score", grow: true, minWidth: "240px" },
    ];
    const { container } = render(
      <DataTable rows={rows} columns={cols} paging="none" pageSize={rows.length} />,
    );
    const table = container.querySelector("table") as HTMLTableElement;
    const [nameCol, scoreCol] = container.querySelectorAll("colgroup col");
    expect((nameCol as HTMLTableColElement).style.width).toBe("160px");
    expect((scoreCol as HTMLTableColElement).style.width).toBe("");
    expect(table.style.minWidth).toBe("400px");
    spy.mockRestore();
  });
});

describe("DataTable hidden columns", () => {
  type Order = { id: string; client: string; total: number; manager: string };
  const ORDERS: Order[] = [
    { id: "1040", client: "ООО «Север»", total: 120, manager: "Ольга" },
    { id: "1041", client: "ИП Козлов", total: 80, manager: "Игорь" },
  ];
  const ORDER_COLUMNS: DataTableColumn<Order>[] = [
    { id: "id", header: "Заказ", accessor: "id", hideable: false },
    { id: "client", header: "Клиент", accessor: "client" },
    { id: "total", header: "Сумма", accessor: "total", sortable: true, numeric: true },
    { id: "manager", header: "Менеджер", accessor: "manager" },
  ];

  it("does not render hidden columns in the head, the body or the colgroup", () => {
    const { container } = render(
      <DataTable rows={ORDERS} columns={ORDER_COLUMNS} hiddenColumns={["client", "manager"]} />,
    );
    expect(screen.queryByRole("columnheader", { name: "Клиент" })).toBeNull();
    expect(screen.queryByText("ООО «Север»")).toBeNull();
    expect(screen.queryByText("Ольга")).toBeNull();
    expect(screen.getByRole("columnheader", { name: "Сумма" })).toBeInTheDocument();
    expect(container.querySelectorAll("colgroup col")).toHaveLength(2);
    expect(container.querySelectorAll("tbody tr:first-child td")).toHaveLength(2);
  });

  it("keeps a column with hideable: false even when its id is listed", () => {
    render(<DataTable rows={ORDERS} columns={ORDER_COLUMNS} hiddenColumns={["id", "total"]} />);
    expect(screen.getByRole("columnheader", { name: "Заказ" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Заказ" })).toHaveAttribute(
      "data-first-column",
      "true",
    );
    expect(screen.queryByRole("columnheader", { name: "Сумма" })).toBeNull();
  });

  it("follows the parent's list: a column comes back when its id leaves the list", () => {
    const { rerender } = render(
      <DataTable rows={ORDERS} columns={ORDER_COLUMNS} hiddenColumns={["manager"]} />,
    );
    expect(screen.queryByText("Игорь")).toBeNull();
    rerender(<DataTable rows={ORDERS} columns={ORDER_COLUMNS} hiddenColumns={[]} />);
    expect(screen.getByText("Игорь")).toBeInTheDocument();
  });

  it("the first visible column becomes the first column (sticky edge, sub-row indent)", () => {
    const columns = ORDER_COLUMNS.map((column) => ({ ...column, hideable: true }));
    render(<DataTable rows={ORDERS} columns={columns} hiddenColumns={["id"]} stickyFirstColumn />);
    const first = screen.getByRole("columnheader", { name: "Клиент" });
    expect(first).toHaveAttribute("data-first-column", "true");
    expect(screen.getByText("ИП Козлов").closest("td")).toHaveAttribute(
      "data-first-column",
      "true",
    );
  });

  it("hidden columns leave skeleton rows and the colSpan of state rows", () => {
    const { container, rerender } = render(
      <DataTable rows={[]} columns={ORDER_COLUMNS} hiddenColumns={["client"]} loading />,
    );
    expect(container.querySelectorAll('tr[data-skeleton="true"]:first-child td')).toHaveLength(3);
    rerender(<DataTable rows={[]} columns={ORDER_COLUMNS} hiddenColumns={["client"]} />);
    expect(container.querySelector("tbody td")).toHaveAttribute("colspan", "3");
  });

  it("keeps the row order when the sorted column is hidden", () => {
    const { container, rerender } = render(
      <DataTable
        rows={ORDERS}
        columns={ORDER_COLUMNS}
        defaultSort={{ columnId: "total", order: "asc" }}
      />,
    );
    const order = () =>
      [...container.querySelectorAll('tbody td[data-column-id="id"]')].map((td) => td.textContent);
    expect(order()).toEqual(["1041", "1040"]);
    rerender(
      <DataTable
        rows={ORDERS}
        columns={ORDER_COLUMNS}
        defaultSort={{ columnId: "total", order: "asc" }}
        hiddenColumns={["total"]}
      />,
    );
    expect(order()).toEqual(["1041", "1040"]);
  });

  it("measures the widths again for the new column set", () => {
    const spy = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      () =>
        ({
          width: 90,
          height: 20,
          top: 0,
          left: 0,
          right: 90,
          bottom: 20,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }) as DOMRect,
    );
    const { container, rerender } = render(
      <DataTable rows={ORDERS} columns={ORDER_COLUMNS} paging="none" />,
    );
    expect(container.querySelectorAll("colgroup col")).toHaveLength(4);
    rerender(
      <DataTable rows={ORDERS} columns={ORDER_COLUMNS} paging="none" hiddenColumns={["client"]} />,
    );
    const cols = [...container.querySelectorAll<HTMLTableColElement>("colgroup col")];
    expect(cols).toHaveLength(3);
    for (const col of cols) expect(col.style.width).toBe("90px");
    spy.mockRestore();
  });
});

describe("DataTable edge cue", () => {
  const viewportOf = (container: HTMLElement) =>
    container.querySelector("table")?.parentElement as HTMLElement;

  /** jsdom has no layout: give the viewport a scroll width, then scroll it. */
  const overflowBy = (node: HTMLElement, scrollWidth: number, clientWidth: number) => {
    Object.defineProperty(node, "scrollWidth", { configurable: true, value: scrollWidth });
    Object.defineProperty(node, "clientWidth", { configurable: true, value: clientWidth });
  };

  it("marks the edges that hide columns while the table overflows sideways", async () => {
    const { container } = render(<DataTable rows={rows} columns={columns} />);
    const root = container.firstElementChild as HTMLElement;
    const viewport = viewportOf(container);
    expect(root).not.toHaveAttribute("data-overflow-start");
    expect(root).not.toHaveAttribute("data-overflow-end");

    overflowBy(viewport, 600, 300);
    viewport.scrollLeft = 0;
    fireEvent.scroll(viewport);
    await waitFor(() => expect(root).toHaveAttribute("data-overflow-end", "true"));
    expect(root).not.toHaveAttribute("data-overflow-start");

    viewport.scrollLeft = 150;
    fireEvent.scroll(viewport);
    await waitFor(() => expect(root).toHaveAttribute("data-overflow-start", "true"));
    expect(root).toHaveAttribute("data-overflow-end", "true");

    viewport.scrollLeft = 300;
    fireEvent.scroll(viewport);
    await waitFor(() => expect(root).not.toHaveAttribute("data-overflow-end"));
    expect(root).toHaveAttribute("data-overflow-start", "true");
  });

  it("reads the RTL scroll position as distance from the start", async () => {
    const { container } = render(
      <div dir="rtl">
        <DataTable rows={rows} columns={columns} />
      </div>,
    );
    const root = container.querySelector("[data-size]") as HTMLElement;
    const viewport = viewportOf(container);
    overflowBy(viewport, 600, 300);
    viewport.scrollLeft = -300;
    fireEvent.scroll(viewport);
    await waitFor(() => expect(root).toHaveAttribute("data-overflow-start", "true"));
    expect(root).not.toHaveAttribute("data-overflow-end");
  });

  it("CSS: edge shadows overlay the viewport; a sticky first column carries the start one", () => {
    const css = readFileSync(join(__dirname, "DataTable.module.css"), "utf8");
    expect(css).toMatch(/\.root\[data-overflow-start="true"\] \.frame::before/);
    expect(css).toMatch(/\.root\[data-overflow-end="true"\] \.frame::after/);
    expect(css).toMatch(
      /\.root\[data-sticky-first-column="true"\] \.frame::before \{[^}]*display: none/,
    );
    expect(css).toMatch(
      /\.root\[data-overflow-start="true"\] \.firstColumnSticky::after \{[^}]*opacity: 1/,
    );
    // Pseudo-elements never take layout space.
    expect(css).toMatch(/\.frame::before,\n\.frame::after \{[^}]*position: absolute/);
  });

  it("CSS: on short landscape screens the sticky head scrolls with the rows", () => {
    const css = readFileSync(join(__dirname, "DataTable.module.css"), "utf8");
    expect(css).toMatch(
      /@media \(max-height: 479px\) \{\s*\.root\[data-sticky-header="true"\] \.headCell \{\s*top: auto;/,
    );
  });
});
