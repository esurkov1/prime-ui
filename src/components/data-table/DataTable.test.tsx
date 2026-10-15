import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { createPortal } from "react-dom";
import { describe, expect, it, vi } from "vitest";

import { Badge } from "@/components/badge/Badge";
import { Kbd } from "@/components/kbd/Kbd";
import rowLink from "@/internal/rowLink.module.css";
import { stickySurfaceClass } from "@/internal/sticky";
import swapMotion from "@/internal/swapMotion.module.css";
import { cssRule, cssRules, cssValue } from "@/test/css";
import { primitiveTokens } from "../../../tokens/primitives";
import { semanticTokens } from "../../../tokens/semantic";

import { DataTable, type DataTableColumn } from "./DataTable";
import styles from "./DataTable.module.css";

const CSS = "src/components/data-table/DataTable.module.css";

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
    expect(cssValue(cssRule(CSS, ".cell"), "padding")).toBe("var(--dt-pad-y) var(--dt-pad-x)");
    const values = cssRules(CSS).flatMap((rule) => rule.decls.map((decl) => decl.value));
    expect(values.some((value) => value.includes("row-reverse"))).toBe(false);
    const sortIcon = cssRules(CSS).filter((rule) => rule.selector.includes(".sortIcon"));
    expect(sortIcon.length).toBeGreaterThan(0);
    for (const rule of sortIcon) {
      expect(rule.decls.some((decl) => decl.value.includes("accent"))).toBe(false);
    }
  });

  it("renders headers and rows", () => {
    render(<DataTable rows={rows.slice(0, 2)} columns={columns} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
    const root = screen.getByText("Name").closest(`.${styles.root}`);
    expect(root).toBeInTheDocument();
    expect(root).not.toHaveAttribute("data-row-dividers");
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
    expect(screen.getByText("Name").closest(`.${styles.root}`)).toHaveAttribute(
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

  it("sticks the last visible column: head and body cells, the end corner with a sticky head", () => {
    render(<DataTable rows={rows.slice(0, 2)} columns={columns} stickyHeader stickyLastColumn />);
    const root = screen.getByText("Name").closest(`.${styles.root}`);
    expect(root).toHaveAttribute("data-sticky-last-column", "true");
    const heads = screen.getAllByRole("columnheader");
    const last = heads[heads.length - 1] as HTMLElement;
    expect(last).toHaveClass(styles.lastColumnSticky as string, styles.cornerCellSticky as string);
    expect(heads[0]).not.toHaveClass(styles.lastColumnSticky as string);
    for (const row of screen.getAllByRole("row").slice(1)) {
      const cells = within(row).getAllByRole("cell");
      expect(cells[cells.length - 1]).toHaveClass(styles.lastColumnSticky as string);
      expect(cells[0]).not.toHaveClass(styles.lastColumnSticky as string);
    }
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

    rerender(<DataTable rows={[]} columns={columns} loadError="Не удалось загрузить" />);
    expect(body(container)).not.toBe(loaded);
    expect(body(container)).toHaveClass(swapMotion.swapIn);
  });

  it("renders error state instead of rows", () => {
    render(<DataTable rows={rows} columns={columns} loadError="Не удалось загрузить" />);
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
  it("is full-bleed: the viewport has no padding and the root clips to its radius", () => {
    expect(cssValue(cssRule(CSS, ".viewport"), "padding")).toBe("0");
    const root = cssRule(CSS, ".root");
    expect(cssValue(root, "overflow")).toMatch(/^(hidden|clip)$/);
    expect(cssValue(root, "border-radius")).toBe("var(--prime-card-radius)");
    expect(cssValue(root, "background")).toBe("var(--dt-surface)");
    expect(cssValue(root, "--dt-surface")).toBe("var(--prime-color-layer-current)");
  });

  it("uses the inset focus ring for edge focusables", () => {
    const ring = cssRule(CSS, ".headCell:has(.sortButton:focus-visible)");
    expect(cssValue(ring, "outline-offset")).toBe("var(--prime-focus-offset-inset)");
  });

  it("reads every tier from the tier table, one element per tier", () => {
    const { container } = render(
      <DataTable rows={rows.slice(0, 1)} columns={columns} size="l" onReorder={() => {}} />,
    );
    const root = container.querySelector(`.${styles.root}`) as HTMLElement;
    // The table's tier (head, text), the toggle's compact tier, the grip's `xs`, the cells' tier.
    expect(root).toHaveAttribute("data-size", "l");
    expect(root.querySelector(`.${styles.frame}`)).toHaveAttribute("data-size", "s");
    expect(root.querySelector(`.${styles.viewport}`)).toHaveAttribute("data-size", "xs");
    expect(root.querySelector("table")).toHaveAttribute("data-size", "m");
    expect(cssValue(cssRule(CSS, ".root"), "--dt-head-height")).toBe("var(--field-h)");
    expect(cssValue(cssRule(CSS, ".frame"), "--dt-toggle")).toBe("var(--field-h)");
    expect(cssValue(cssRule(CSS, ".viewport"), "--dt-grip")).toBe("var(--field-h)");
    expect(cssValue(cssRule(CSS, ".table"), "--dt-cell-control")).toBe("var(--field-h)");
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

    it("re-renders only the toggled row under a controlled owner with inline callbacks", async () => {
      const user = userEvent.setup();
      const renders = new Map<number, number>();
      const counted: DataTableColumn<Row>[] = [
        {
          id: "name",
          header: "Name",
          cell: (row) => {
            renders.set(row.id, (renders.get(row.id) ?? 0) + 1);
            return row.name;
          },
        },
      ];
      function Owner() {
        const [selected, setSelected] = React.useState<React.Key[]>([]);
        return (
          <DataTable
            rows={five}
            columns={counted}
            getRowKey={(row) => row.id}
            getRowLabel={(row) => row.name}
            onRowClick={() => {}}
            labels={{ empty: "Пусто" }}
            selectable
            selected={selected}
            onSelectedChange={setSelected}
            paging="none"
          />
        );
      }
      render(<Owner />);
      renders.clear();
      await user.click(box("C"));
      expect(box("C")).toBeChecked();
      expect([...renders.keys()]).toEqual([1]);
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
      // A sub-row folds open like the detail panel: its cells' content is a disclosure that opens.
      expect(child).toHaveAttribute("data-fold", "open");
      expect(within(child).getByText("Выплата").closest("[data-state]")).toHaveAttribute(
        "data-state",
        "open",
      );
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

  it("a column description describes its header and opens from the info glyph or the sort button", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        rows={rows.slice(0, 2)}
        columns={[
          { id: "name", header: "Name", accessor: "name", description: "Имя клиента в CRM" },
          {
            id: "score",
            header: "Score",
            accessor: "score",
            sortable: true,
            description: "Баллы за квартал",
          },
        ]}
      />,
    );
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAccessibleDescription(
      "Имя клиента в CRM",
    );
    expect(screen.getByRole("columnheader", { name: "Score" })).toHaveAccessibleDescription(
      "Баллы за квартал",
    );
    // A plain header: the glyph is a tab stop of its own, named by labels.columnInfo.
    await user.tab();
    expect(screen.getByRole("img", { name: "Пояснение" })).toHaveFocus();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Имя клиента в CRM");
    // A sortable header: the sort button carries the tooltip; the glyph inside it is decorative.
    await user.tab();
    const sort = screen.getByRole("button", { name: "Score" });
    expect(sort).toHaveFocus();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Баллы за квартал");
    await user.keyboard("{Enter}");
    expect(screen.getByRole("columnheader", { name: "Score" })).toHaveAttribute(
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

  it("a hidden last column passes the sticky end edge to the last visible one", () => {
    const columns = ORDER_COLUMNS.map((column) => ({ ...column, hideable: true }));
    render(
      <DataTable rows={ORDERS} columns={columns} hiddenColumns={["manager"]} stickyLastColumn />,
    );
    expect(screen.getByRole("columnheader", { name: /Сумма/ })).toHaveClass(
      styles.lastColumnSticky as string,
    );
    expect(screen.getByText("120").closest("td")).toHaveClass(styles.lastColumnSticky as string);
    expect(screen.getByText("ИП Козлов").closest("td")).not.toHaveClass(
      styles.lastColumnSticky as string,
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
    // No fade reads the depth: nothing is written on the scroller per scroll frame (an inherited
    // custom property there would restyle every cell of the table).
    expect(viewport.style.getPropertyValue("--edge-start")).toBe("");
    expect(viewport.style.getPropertyValue("--edge-end")).toBe("");
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
    const shown = cssRule(
      CSS,
      '.root[data-overflow-start="true"] .frame::before, .root[data-overflow-end="true"] .frame::after',
    );
    expect(cssValue(shown, "opacity")).toBe("1");
    const sticky = cssRule(CSS, '.root[data-sticky-first-column="true"] .frame::before');
    expect(cssValue(sticky, "display")).toBe("none");
    const column = cssRule(CSS, '.root[data-overflow-start="true"] .firstColumnSticky::after');
    expect(cssValue(column, "opacity")).toBe("1");
    // Pseudo-elements never take layout space.
    expect(cssValue(cssRule(CSS, ".frame::before, .frame::after"), "position")).toBe("absolute");
  });

  it("CSS: a sticky last column carries the end shadow from its start edge, logical in RTL", () => {
    const frame = cssRule(CSS, '.root[data-sticky-last-column="true"] .frame::after');
    expect(cssValue(frame, "display")).toBe("none");
    const shadow = cssRule(CSS, ".lastColumnSticky::before");
    expect(cssValue(shadow, "position")).toBe("absolute");
    expect(cssValue(shadow, "inset-inline-end")).toBe("100%");
    const shown = cssRule(CSS, '.root[data-overflow-end="true"] .lastColumnSticky::before');
    expect(cssValue(shown, "opacity")).toBe("1");
    const column = cssRule(CSS, ".lastColumnSticky");
    expect(cssValue(column, "position")).toBe("sticky");
    expect(cssValue(column, "inset-inline-end")).toBe("0");
  });

  it("the sticky head is the shared sticky surface (it lets go on a short screen)", () => {
    render(<DataTable rows={rows.slice(0, 2)} columns={columns} stickyHeader />);
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveClass(stickySurfaceClass);
  });
});

describe("DataTable opening rows", () => {
  type Deal = { id: string; client: string; total: number; summary?: boolean };
  const DEALS: Deal[] = [
    { id: "d1", client: "ООО «Север»", total: 120 },
    { id: "d2", client: "ИП Козлов", total: 80 },
    { id: "sum", client: "Итого", total: 200, summary: true },
  ];
  const dealColumns = (extra?: DataTableColumn<Deal>): DataTableColumn<Deal>[] => [
    { id: "client", header: "Клиент", accessor: "client" },
    { id: "total", header: "Сумма", accessor: "total", numeric: true },
    ...(extra ? [extra] : []),
  ];
  const rowOf = (text: string) => screen.getByText(text).closest("tr") as HTMLTableRowElement;

  it("in-place rows take focus and open on Enter and Space", async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(
      <DataTable
        rows={DEALS.slice(0, 2)}
        columns={dealColumns()}
        getRowKey={(row) => row.id}
        paging="none"
        onRowClick={onRowClick}
      />,
    );
    const first = rowOf("ООО «Север»");
    expect(first).toHaveAttribute("tabindex", "0");
    expect(first).toHaveAttribute("data-clickable", "true");
    await user.tab();
    expect(first).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onRowClick).toHaveBeenLastCalledWith(DEALS[0], 0, expect.anything());
    await user.tab();
    expect(rowOf("ИП Козлов")).toHaveFocus();
    await user.keyboard(" ");
    expect(onRowClick).toHaveBeenLastCalledWith(DEALS[1], 1, expect.anything());
    expect(onRowClick).toHaveBeenCalledTimes(2);
  });

  it("never opens from a control inside the row, the opt-out attribute or a portal", () => {
    const onRowClick = vi.fn();
    const onAction = vi.fn();
    const portalHost = document.createElement("div");
    document.body.append(portalHost);
    const actions: DataTableColumn<Deal> = {
      id: "actions",
      header: "Действия",
      cell: (row) => (
        <span>
          <button type="button" onClick={onAction}>
            Изменить {row.id}
          </button>
          <input aria-label={`Комментарий ${row.id}`} />
          <span role="menuitem" tabIndex={-1}>
            Пункт {row.id}
          </span>
          <span data-row-click-ignore="">
            <span>Виджет {row.id}</span>
          </span>
          {createPortal(<button type="button">Меню {row.id}</button>, portalHost)}
        </span>
      ),
    };
    render(
      <DataTable
        rows={DEALS.slice(0, 1)}
        columns={dealColumns(actions)}
        getRowKey={(row) => row.id}
        paging="none"
        onRowClick={onRowClick}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Изменить d1" }));
    fireEvent.click(screen.getByRole("textbox", { name: "Комментарий d1" }));
    fireEvent.click(screen.getByText("Пункт d1"));
    fireEvent.click(screen.getByText("Виджет d1"));
    fireEvent.click(screen.getByRole("button", { name: "Меню d1" }));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onRowClick).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("ООО «Север»"));
    expect(onRowClick).toHaveBeenCalledTimes(1);
    portalHost.remove();
  });

  it("a link row: the key cell holds the named link, the other cells its hidden copies", () => {
    render(
      <DataTable
        rows={DEALS.slice(0, 2)}
        columns={dealColumns()}
        getRowKey={(row) => row.id}
        paging="none"
        getRowHref={(row) => `/deals/${row.id}`}
      />,
    );
    const link = screen.getByRole("link", { name: "ООО «Север»" });
    expect(link).toHaveAttribute("href", "/deals/d1");
    const row = rowOf("ООО «Север»");
    expect(row).not.toHaveAttribute("tabindex");
    expect(row).toHaveAttribute("data-link", "true");
    const copies = row.querySelectorAll('a[aria-hidden="true"]');
    expect(copies).toHaveLength(1);
    expect(copies[0]).toHaveAttribute("href", "/deals/d1");
    expect(copies[0]).toHaveAttribute("tabindex", "-1");
    // Only the named links are links for assistive tech.
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  it("a link row passes plain clicks to onRowClick and leaves modified clicks to the browser", () => {
    const onRowClick = vi.fn((_row: Deal, _index: number, event: { preventDefault(): void }) =>
      event.preventDefault(),
    );
    render(
      <DataTable
        rows={DEALS.slice(0, 1)}
        columns={dealColumns()}
        getRowKey={(row) => row.id}
        paging="none"
        getRowHref={(row) => `/deals/${row.id}`}
        onRowClick={onRowClick}
      />,
    );
    const link = screen.getByRole("link", { name: "ООО «Север»" });
    expect(fireEvent.click(link, { metaKey: true })).toBe(true);
    expect(fireEvent.click(link, { ctrlKey: true })).toBe(true);
    expect(onRowClick).not.toHaveBeenCalled();
    // The app routes in place: the default navigation is cancelled.
    expect(fireEvent.click(link)).toBe(false);
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick.mock.calls[0]?.[0]).toBe(DEALS[0]);
  });

  it("isRowClickable takes a row out of both the link and the in-place opening", () => {
    const onRowClick = vi.fn();
    render(
      <DataTable
        rows={DEALS}
        columns={dealColumns()}
        getRowKey={(row) => row.id}
        paging="none"
        getRowHref={(row) => `/deals/${row.id}`}
        onRowClick={onRowClick}
        isRowClickable={(row) => !row.summary}
      />,
    );
    const total = rowOf("Итого");
    expect(total).not.toHaveAttribute("data-clickable");
    expect(total.querySelector("a")).toBeNull();
    fireEvent.click(screen.getByText("Итого"));
    expect(onRowClick).not.toHaveBeenCalled();
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  it("a link row lifts its controls above the link copies (rowLink host); a focused row rings all its cells", () => {
    render(
      <DataTable
        rows={DEALS}
        columns={dealColumns()}
        getRowKey={(row) => row.id}
        paging="none"
        getRowHref={(row) => `/deals/${row.id}`}
        isRowClickable={(row) => !row.summary}
      />,
    );
    expect(rowOf("Итого")).not.toHaveClass(rowLink.host);
    expect(screen.getAllByRole("link")[0].closest("tr")).toHaveClass(rowLink.host);
    const ring = cssRule(CSS, ".row:is(:focus-visible, :has(.rowLink:focus-visible)) > .cell");
    expect(cssValue(ring, "box-shadow")).toContain("var(--prime-color-focus-ring)");
  });
});

describe("DataTable columns menu", () => {
  type Order = { id: string; client: string; city: string };
  const ORDERS: Order[] = [{ id: "1040", client: "ООО «Север»", city: "Казань" }];
  const ORDER_COLUMNS: DataTableColumn<Order>[] = [
    { id: "id", header: "Заказ", accessor: "id", hideable: false },
    { id: "client", header: "Клиент", accessor: "client" },
    { id: "city", header: "Город", accessor: "city" },
  ];

  it("hides and shows columns through the triad; the key column stays", async () => {
    const user = userEvent.setup();
    const onHiddenColumnsChange = vi.fn();
    render(
      <DataTable
        rows={ORDERS}
        columns={ORDER_COLUMNS}
        defaultHiddenColumns={["city"]}
        onHiddenColumnsChange={onHiddenColumnsChange}
        columnsMenu
      />,
    );
    expect(screen.queryByRole("columnheader", { name: "Город" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Колонки" }));
    expect(screen.getByRole("menuitemcheckbox", { name: "Заказ" })).toBeDisabled();
    expect(screen.getByRole("menuitemcheckbox", { name: "Заказ" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Город" }));
    expect(onHiddenColumnsChange).toHaveBeenLastCalledWith([]);
    expect(screen.getByRole("columnheader", { name: "Город" })).toBeInTheDocument();
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Клиент" }));
    expect(onHiddenColumnsChange).toHaveBeenLastCalledWith(["client"]);
    expect(screen.queryByRole("columnheader", { name: "Клиент" })).toBeNull();
    await user.click(screen.getByRole("menuitem", { name: "Показать все" }));
    expect(onHiddenColumnsChange).toHaveBeenLastCalledWith([]);
    expect(screen.getByRole("columnheader", { name: "Клиент" })).toBeInTheDocument();
  });

  it("never hides the last visible column; the trigger text takes {shown} and {total}", async () => {
    const user = userEvent.setup();
    const columns = ORDER_COLUMNS.map((column) => ({ ...column, hideable: true }));
    render(
      <DataTable
        rows={ORDERS}
        columns={columns}
        hiddenColumns={["client", "city"]}
        labels={{ columns: "Колонки: {shown} из {total}" }}
        columnsMenu
      />,
    );
    await user.click(screen.getByRole("button", { name: "Колонки: 1 из 3" }));
    expect(screen.getByRole("menuitemcheckbox", { name: "Заказ" })).toBeDisabled();
  });

  it("works from the keyboard: the menu opens on Enter, Space toggles a column", async () => {
    const user = userEvent.setup();
    render(<DataTable rows={ORDERS} columns={ORDER_COLUMNS} columnsMenu />);
    await user.tab();
    const trigger = screen.getByRole("button", { name: "Колонки" });
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    await user.keyboard("{Enter}");
    // The key column is disabled: focus starts on the first column that can be hidden.
    expect(screen.getByRole("menuitemcheckbox", { name: "Клиент" })).toHaveFocus();
    await user.keyboard(" ");
    expect(screen.queryByRole("columnheader", { name: "Клиент" })).toBeNull();
  });

  it("stands in a trailing cell of its own at the end of the head; every row gets the cell", () => {
    render(<DataTable rows={ORDERS} columns={ORDER_COLUMNS} columnsMenu />);
    const [head, row] = screen.getAllByRole("row");
    const headCells = within(head as HTMLElement).getAllByRole("cell");
    expect(headCells).toHaveLength(1);
    const menuCell = headCells[0] as HTMLElement;
    expect(menuCell.tagName).toBe("TD");
    expect(menuCell).toBe((head as HTMLElement).lastElementChild);
    expect(within(menuCell).getByRole("button", { name: "Колонки" })).toBeInTheDocument();
    expect((row as HTMLTableRowElement).cells).toHaveLength(ORDER_COLUMNS.length + 1);
    expect((row as HTMLTableRowElement).lastElementChild).toHaveClass(styles.menuCell as string);
    expect(screen.getByRole("table").querySelectorAll("col")).toHaveLength(
      ORDER_COLUMNS.length + 1,
    );
  });

  it("sits in the head cell of a row-actions column, which keeps its own name; no extra cell", () => {
    const columns: DataTableColumn<Order>[] = [
      ...ORDER_COLUMNS,
      { id: "actions", header: "Действия", hideHeader: true, hideable: false, cell: () => "⋯" },
    ];
    render(<DataTable rows={ORDERS} columns={columns} columnsMenu stickyLastColumn />);
    const actions = screen.getByRole("columnheader", { name: "Действия" });
    expect(within(actions).getByRole("button", { name: "Колонки" })).toBeInTheDocument();
    expect(actions).toHaveClass(styles.lastColumnSticky as string);
    const [head, row] = screen.getAllByRole("row");
    expect(within(head as HTMLElement).queryAllByRole("cell")).toHaveLength(0);
    expect((row as HTMLTableRowElement).cells).toHaveLength(columns.length);
  });

  it("sticks with stickyLastColumn: the trailing cell at the end edge, the last column before it", () => {
    render(<DataTable rows={ORDERS} columns={ORDER_COLUMNS} columnsMenu stickyLastColumn />);
    const [head, row] = screen.getAllByRole("row");
    expect((head as HTMLElement).lastElementChild).toHaveClass(styles.menuCellSticky as string);
    expect((row as HTMLElement).lastElementChild).toHaveClass(styles.menuCellSticky as string);
    expect(screen.getByRole("columnheader", { name: "Город" })).toHaveClass(
      styles.lastColumnSticky as string,
    );
    const lastBeforeMenu = cssRule(CSS, '.root[data-menu-cell="true"] .lastColumnSticky');
    expect(cssValue(lastBeforeMenu, "inset-inline-end")).toBe("var(--dt-menu-w)");
  });

  it("follows the head: no chooser without showHeader", () => {
    render(<DataTable rows={ORDERS} columns={ORDER_COLUMNS} columnsMenu showHeader={false} />);
    expect(screen.queryByRole("button", { name: "Колонки" })).toBeNull();
    expect((screen.getAllByRole("row")[0] as HTMLTableRowElement).cells).toHaveLength(
      ORDER_COLUMNS.length,
    );
  });
});

describe("DataTable fill height and row tokens", () => {
  it('scrollHeight="fill" drops the max height, also with infinite paging', () => {
    const { container } = render(
      <DataTable rows={rows} columns={columns} paging="infinite" scrollHeight="fill" />,
    );
    const root = container.querySelector("[data-size]") as HTMLElement;
    expect(root).toHaveAttribute("data-scroll-height", "fill");
    const viewport = container.querySelector("table")?.parentElement as HTMLElement;
    expect(viewport.style.maxHeight).toBe("");
  });

  it("CSS: the filling table stretches in its parent; every size reads its row token", () => {
    expect(cssValue(cssRule(CSS, '.root[data-scroll-height="fill"]'), "flex")).toBe("1 1 0%");
    for (const size of ["xs", "s", "l", "xl"]) {
      expect(cssValue(cssRule(CSS, `.root[data-size="${size}"]`), "--dt-row-height")).toBe(
        `var(--prime-table-row-height-${size})`,
      );
    }
    expect(cssValue(cssRule(CSS, ".root"), "--dt-row-height")).toBe(
      "var(--prime-table-row-height-m)",
    );
  });
});

describe("DataTable heatmap columns", () => {
  type Cell = { id: string; manager: string; deals: number | null };
  const CELLS: Cell[] = [
    { id: "1", manager: "Ольга", deals: 0 },
    { id: "2", manager: "Игорь", deals: 50 },
    { id: "3", manager: "Мария", deals: 100 },
    { id: "4", manager: "Анна", deals: null },
  ];
  const cellOf = (text: string) => screen.getByText(text).closest("td") as HTMLElement;

  it("shades each cell by its value on five steps and keeps the value", () => {
    render(
      <DataTable
        rows={CELLS}
        columns={[
          { id: "manager", header: "Менеджер", accessor: "manager" },
          { id: "deals", header: "Сделки", accessor: "deals", numeric: true, scale: true },
        ]}
        paging="none"
      />,
    );
    expect(cellOf("0")).toHaveAttribute("data-scale", "1");
    expect(cellOf("50")).toHaveAttribute("data-scale", "3");
    expect(cellOf("100")).toHaveAttribute("data-scale", "5");
    expect(cellOf("—")).not.toHaveAttribute("data-scale");
    expect(cellOf("Ольга")).not.toHaveAttribute("data-scale");
  });

  it("a fixed range clamps the values outside it", () => {
    render(
      <DataTable
        rows={CELLS}
        columns={[
          { id: "deals", header: "Сделки", accessor: "deals", scale: { min: 50, max: 60 } },
        ]}
        paging="none"
      />,
    );
    expect(cellOf("0")).toHaveAttribute("data-scale", "1");
    expect(cellOf("100")).toHaveAttribute("data-scale", "5");
  });

  it("CSS: every step reads the chart scale; dark steps take its text colour", () => {
    for (const step of [1, 2, 3, 4, 5]) {
      expect(cssValue(cssRule(CSS, `.cell[data-scale="${step}"]`), "--dt-cell-bg")).toBe(
        `var(--prime-color-chart-scale-${step})`,
      );
    }
    expect(cssValue(cssRule(CSS, '.cell[data-scale="5"]'), "color")).toBe(
      "var(--prime-color-chart-scale-fg)",
    );
  });
});

describe("DataTable row groups", () => {
  type Payment = { id: string; month: string; client: string; amount: number };
  const PAYMENTS: Payment[] = [
    { id: "p1", month: "Октябрь", client: "Север", amount: 300 },
    { id: "p2", month: "Сентябрь", client: "Козлов", amount: 100 },
    { id: "p3", month: "Октябрь", client: "Гранит", amount: 50 },
    { id: "p4", month: "Сентябрь", client: "Лето", amount: 700 },
  ];
  const paymentColumns: DataTableColumn<Payment>[] = [
    { id: "client", header: "Клиент", accessor: "client" },
    { id: "amount", header: "Сумма", accessor: "amount", numeric: true, sortable: true },
  ];

  it("draws one tbody per group under a rowgroup header with the group's totals", () => {
    const renderGroupHeader = vi.fn(
      (group: { key: string | number; rows: Payment[] }) =>
        `${group.key}: ${group.rows.reduce((sum, row) => sum + row.amount, 0)}`,
    );
    const { container } = render(
      <DataTable
        rows={PAYMENTS}
        columns={paymentColumns}
        getRowKey={(row) => row.id}
        getRowGroup={(row) => row.month}
        renderGroupHeader={renderGroupHeader}
        paging="none"
      />,
    );
    const headers = screen.getAllByRole("rowheader");
    expect(headers.map((cell) => cell.textContent)).toEqual(["Октябрь: 350", "Сентябрь: 800"]);
    expect(headers[0]).toHaveAttribute("scope", "rowgroup");
    expect(headers[0]).toHaveAttribute("colspan", "2");
    const bodies = container.querySelectorAll("table > tbody");
    expect(bodies).toHaveLength(2);
    expect(within(bodies[0] as HTMLElement).getByText("Гранит")).toBeInTheDocument();
    expect(within(bodies[1] as HTMLElement).getByText("Лето")).toBeInTheDocument();
  });

  it("a sort orders the rows inside each group and keeps the group order", () => {
    const { container } = render(
      <DataTable
        rows={PAYMENTS}
        columns={paymentColumns}
        getRowKey={(row) => row.id}
        getRowGroup={(row) => row.month}
        defaultSort={{ columnId: "amount", order: "asc" }}
        paging="none"
      />,
    );
    const bodies = [...container.querySelectorAll("table > tbody")];
    const clients = bodies.map((body) =>
      [...body.querySelectorAll("td[data-column-id='client']")].map((cell) => cell.textContent),
    );
    expect(clients).toEqual([
      ["Гранит", "Север"],
      ["Козлов", "Лето"],
    ]);
    expect(screen.getAllByRole("rowheader").map((cell) => cell.textContent)).toEqual([
      "Октябрь",
      "Сентябрь",
    ]);
  });

  it("selection keeps working across groups: Shift+click selects the range over a header", async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(
      <DataTable
        rows={PAYMENTS}
        columns={paymentColumns}
        getRowKey={(row) => row.id}
        getRowLabel={(row) => row.client}
        getRowGroup={(row) => row.month}
        selectable
        onSelectedChange={onSelectedChange}
        paging="none"
        stickyGroupHeaders
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "Выбрать строку Гранит" }));
    await user.keyboard("{Shift>}");
    await user.click(screen.getByRole("checkbox", { name: "Выбрать строку Козлов" }));
    await user.keyboard("{/Shift}");
    expect(onSelectedChange).toHaveBeenLastCalledWith(["p3", "p2"]);
    expect(screen.getAllByRole("rowheader")[0]).toHaveAttribute("data-sticky", "true");
  });

  it("repeats the group header on the next page when a group continues there", () => {
    render(
      <DataTable
        rows={PAYMENTS}
        columns={paymentColumns}
        getRowKey={(row) => row.id}
        getRowGroup={(row) => row.month}
        pageSize={3}
        defaultPage={2}
      />,
    );
    expect(screen.getAllByRole("rowheader").map((cell) => cell.textContent)).toEqual(["Сентябрь"]);
    expect(screen.getByText("Лето")).toBeInTheDocument();
  });

  it("groups fold only when the owner passes the collapsed-groups triad", () => {
    const { rerender } = render(
      <DataTable
        rows={PAYMENTS}
        columns={paymentColumns}
        getRowKey={(row) => row.id}
        getRowGroup={(row) => row.month}
        paging="none"
      />,
    );
    expect(screen.queryByRole("button", { name: /группу/ })).toBeNull();
    rerender(
      <DataTable
        rows={PAYMENTS}
        columns={paymentColumns}
        getRowKey={(row) => row.id}
        getRowGroup={(row) => row.month}
        defaultCollapsedGroups={[]}
        paging="none"
      />,
    );
    expect(screen.getAllByRole("button", { name: /Свернуть группу/ })).toHaveLength(2);
  });

  it("a group toggle folds its rows away and back, with aria-expanded and aria-controls", async () => {
    const user = userEvent.setup();
    const onCollapsedGroupsChange = vi.fn();
    render(
      <DataTable
        rows={PAYMENTS}
        columns={paymentColumns}
        getRowKey={(row) => row.id}
        getRowGroup={(row) => row.month}
        defaultCollapsedGroups={["Сентябрь"]}
        onCollapsedGroupsChange={onCollapsedGroupsChange}
        stickyGroupHeaders
        paging="none"
      />,
    );
    // A collapsed group: its header stays, its rows are only measured (column widths).
    expect(screen.getAllByRole("rowheader").map((cell) => cell.textContent)).toEqual([
      "Октябрь",
      "Сентябрь",
    ]);
    expect(screen.queryByRole("cell", { name: "Лето" })).toBeNull();
    expect(screen.getByText("Лето").closest("tbody")).toHaveAttribute("aria-hidden", "true");
    const open = screen.getByRole("button", { name: "Развернуть группу Сентябрь" });
    expect(open).toHaveAttribute("aria-expanded", "false");
    expect(open).not.toHaveAttribute("aria-controls");

    await user.click(open);
    expect(onCollapsedGroupsChange).toHaveBeenLastCalledWith([]);
    const close = screen.getByRole("button", { name: "Свернуть группу Сентябрь" });
    expect(close).toHaveAttribute("aria-expanded", "true");
    const row = screen.getByRole("cell", { name: "Лето" }).closest("tr") as HTMLElement;
    // The rows fold in like expanded sub-rows.
    expect(row).toHaveAttribute("data-fold", "open");
    expect(within(row).getByText("Лето").closest("[data-state]")).toHaveAttribute(
      "data-state",
      "open",
    );
    expect(close.getAttribute("aria-controls")?.split(" ")).toContain(row.id);
    expect(screen.getAllByRole("rowheader")[1]).toHaveAttribute("data-sticky", "true");

    // Keyboard: Space / Enter on the focused toggle.
    close.focus();
    await user.keyboard(" ");
    expect(onCollapsedGroupsChange).toHaveBeenLastCalledWith(["Сентябрь"]);
    // It folds shut first, then unmounts.
    expect(screen.getByRole("cell", { name: "Лето" }).closest("tr")).toHaveAttribute(
      "data-fold",
      "closed",
    );
    await waitFor(() => expect(screen.queryByRole("cell", { name: "Лето" })).toBeNull());
    const reopen = screen.getByRole("button", { name: "Развернуть группу Сентябрь" });
    expect(reopen).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("cell", { name: "Лето" })).toBeInTheDocument();
  });

  it("controlled: the owner's keys decide, a toggle only asks", async () => {
    const user = userEvent.setup();
    const onCollapsedGroupsChange = vi.fn();
    const { rerender } = render(
      <DataTable
        rows={PAYMENTS}
        columns={paymentColumns}
        getRowKey={(row) => row.id}
        getRowGroup={(row) => row.month}
        collapsedGroups={[]}
        onCollapsedGroupsChange={onCollapsedGroupsChange}
        paging="none"
      />,
    );
    await user.click(screen.getByRole("button", { name: "Свернуть группу Октябрь" }));
    expect(onCollapsedGroupsChange).toHaveBeenLastCalledWith(["Октябрь"]);
    expect(screen.getByRole("cell", { name: "Гранит" })).toBeInTheDocument();
    rerender(
      <DataTable
        rows={PAYMENTS}
        columns={paymentColumns}
        getRowKey={(row) => row.id}
        getRowGroup={(row) => row.month}
        collapsedGroups={["Октябрь"]}
        onCollapsedGroupsChange={onCollapsedGroupsChange}
        paging="none"
      />,
    );
    // A change from the owner folds the rows away too.
    expect(screen.getByRole("cell", { name: "Гранит" }).closest("tr")).toHaveAttribute(
      "data-fold",
      "closed",
    );
    await waitFor(() => expect(screen.queryByRole("cell", { name: "Гранит" })).toBeNull());
    expect(screen.getByRole("button", { name: "Развернуть группу Октябрь" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("«select all» takes the rows of collapsed groups too", async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(
      <DataTable
        rows={PAYMENTS}
        columns={paymentColumns}
        getRowKey={(row) => row.id}
        getRowGroup={(row) => row.month}
        defaultCollapsedGroups={["Сентябрь"]}
        selectable
        onSelectedChange={onSelectedChange}
        paging="none"
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "Выбрать все строки" }));
    expect(onSelectedChange).toHaveBeenLastCalledWith(["p1", "p3", "p2", "p4"]);
  });
});

describe("DataTable state content", () => {
  it("empty and error content sit in a sticky box of the visible width", () => {
    const stateBox = cssRule(CSS, ".stateBox");
    expect(cssValue(stateBox, "position")).toBe("sticky");
    expect(cssValue(stateBox, "inset-inline-start")).toBe("0");
    expect(cssValue(stateBox, "width")).toBe("100cqi");
    const box = (node: Element) => {
      const parent = node.parentElement as HTMLElement;
      expect(parent).toHaveClass(styles.stateBox as string);
      expect(parent.parentElement?.tagName).toBe("TD");
    };
    const { rerender } = render(
      <DataTable rows={[]} columns={columns} empty={<p>Ничего не найдено</p>} />,
    );
    box(screen.getByText("Ничего не найдено").parentElement as HTMLElement);
    rerender(<DataTable rows={[]} columns={columns} />);
    box(screen.getByRole("status"));
    rerender(<DataTable rows={[]} columns={columns} loadError="Не удалось загрузить" />);
    box(screen.getByRole("alert"));
  });
});

describe("DataTable async load more", () => {
  function mockObserver() {
    const live = new Set<(entries: IntersectionObserverEntry[]) => void>();
    class MockIntersectionObserver {
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
      root = null;
      rootMargin = "0px";
      thresholds = [];
    }
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    return () =>
      act(() => {
        for (const callback of [...live]) {
          callback([{ isIntersecting: true } as IntersectionObserverEntry]);
        }
      });
  }

  it("shows the loading status while the promise is pending, then asks again", async () => {
    const reach = mockObserver();
    let resolve = () => {};
    const onLoadMore = vi.fn(
      () =>
        new Promise<void>((done) => {
          resolve = done;
        }),
    );
    const { container } = render(
      <DataTable
        rows={rows.slice(0, 2)}
        columns={columns}
        paging="infinite"
        pageSize={2}
        hasMore
        onLoadMore={onLoadMore}
      />,
    );
    reach();
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Догружаем строки…")).toBeInTheDocument();
    expect(container.querySelector("table")).toHaveAttribute("aria-busy", "true");
    reach();
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    await act(async () => resolve());
    expect(screen.queryByText("Догружаем строки…")).toBeNull();
    reach();
    expect(onLoadMore).toHaveBeenCalledTimes(2);
    vi.unstubAllGlobals();
  });

  it("a rejected request is not repeated until the rows change", async () => {
    const reach = mockObserver();
    const onLoadMore = vi.fn(() => Promise.reject(new Error("offline")));
    const { rerender } = render(
      <DataTable
        rows={rows.slice(0, 2)}
        columns={columns}
        paging="infinite"
        pageSize={2}
        hasMore
        onLoadMore={onLoadMore}
      />,
    );
    reach();
    await act(async () => {});
    reach();
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    rerender(
      <DataTable
        rows={rows.slice(0, 3)}
        columns={columns}
        paging="infinite"
        pageSize={3}
        hasMore
        onLoadMore={onLoadMore}
      />,
    );
    reach();
    expect(onLoadMore).toHaveBeenCalledTimes(2);
    vi.unstubAllGlobals();
  });
});

describe("DataTable stacking ladder", () => {
  const zStep = (token: string) => {
    const ref = /^var\(--prime-z-(\w+)\)$/.exec(token)?.[1] as keyof typeof semanticTokens.z;
    const step = /^\{zIndex\.(\w+)\}$/.exec(semanticTokens.z[ref])?.[1];
    return Number(primitiveTokens.zIndex[step as keyof typeof primitiveTokens.zIndex]);
  };

  it("CSS: the rungs are local names over the kit's z scale, rising column → group → head → corner", () => {
    const root = cssRule(CSS, ".root");
    const rungs = ["--dt-z-column", "--dt-z-group", "--dt-z-head", "--dt-z-corner"].map((name) =>
      zStep(cssValue(root, name)),
    );
    expect(rungs.every((value) => Number.isFinite(value) && value > 0)).toBe(true);
    expect([...rungs].sort((a, b) => a - b)).toEqual(rungs);
    expect(new Set(rungs).size).toBe(rungs.length);
    // Every z-index of the table reads a rung: no token or number straight in a rule.
    const zValues = cssRules(CSS).flatMap((rule) =>
      rule.decls.filter((decl) => decl.prop === "z-index").map((decl) => decl.value),
    );
    expect(zValues.length).toBeGreaterThan(0);
    for (const value of zValues) expect(value).toMatch(/^var\(--dt-z-[a-z]+\)$/);
  });

  it("CSS: every cell is a stacking context, so a control in a scrolled cell stays under pinned cells", () => {
    expect(
      cssValue(cssRule(CSS, ".cell, .headCell, .groupCell, .detailCell, .stateCell"), "isolation"),
    ).toBe("isolate");
    for (const pinned of [
      ".firstColumnSticky",
      ".stickyLead",
      ".lastColumnSticky",
      ".menuCellSticky",
    ]) {
      expect(cssValue(cssRule(CSS, pinned), "position")).toBe("sticky");
      expect(cssValue(cssRule(CSS, pinned), "z-index")).toBe("var(--dt-z-column)");
    }
    expect(cssValue(cssRule(CSS, '.groupCell[data-sticky="true"]'), "z-index")).toBe(
      "var(--dt-z-group)",
    );
    expect(cssValue(cssRule(CSS, ".headSticky"), "z-index")).toBe("var(--dt-z-head)");
  });

  it("CSS: a corner wins by its rung, never by selector weight", () => {
    // The head lifts its pinned cells to the head rung, a corner to the corner rung: both through
    // the variable the column classes read, so no compound selector sets a z-index.
    expect(cssValue(cssRule(CSS, ".head"), "--dt-z-column")).toBe("var(--dt-z-head)");
    const corner = cssRule(CSS, ".cornerCellSticky");
    expect(cssValue(corner, "--dt-z-column")).toBe("var(--dt-z-corner)");
    expect(corner.decls.some((decl) => decl.prop === "z-index")).toBe(false);
    const weighty = cssRules(CSS).filter(
      (rule) =>
        rule.decls.some((decl) => decl.prop === "z-index") &&
        rule.selector.split(",").some((part) => (part.match(/\.[a-zA-Z]/g) ?? []).length > 1),
    );
    expect(weighty.map((rule) => rule.selector)).toEqual([]);
  });

  it("puts each head cell on one rung: pinned cells are corners under a sticky head, the rest sticky head", () => {
    const three: DataTableColumn<Row>[] = [
      ...columns,
      { id: "note", header: "Note", accessor: () => "—" },
    ];
    const { rerender } = render(
      <DataTable
        rows={rows.slice(0, 2)}
        columns={three}
        paging="none"
        selectable
        stickyHeader
        stickyFirstColumn
        stickyLastColumn
        columnsMenu
      />,
    );
    const head = document.querySelector("thead") as HTMLElement;
    expect(head).toHaveClass(styles.head as string);
    const cells = [...(head.querySelector("tr") as HTMLTableRowElement).cells];
    const [select, first, middle, last, chooser] = cells;
    for (const pinned of [select, first, last, chooser]) {
      expect(pinned).toHaveClass(styles.cornerCellSticky as string);
      expect(pinned).not.toHaveClass(styles.headSticky as string);
    }
    expect(middle).toHaveClass(styles.headSticky as string);
    expect(middle).not.toHaveClass(styles.cornerCellSticky as string);

    rerender(
      <DataTable
        rows={rows.slice(0, 2)}
        columns={three}
        paging="none"
        selectable
        stickyFirstColumn
        stickyLastColumn
        columnsMenu
      />,
    );
    for (const cell of (document.querySelector("thead tr") as HTMLTableRowElement).cells) {
      expect(cell).not.toHaveClass(styles.cornerCellSticky as string);
      expect(cell).not.toHaveClass(styles.headSticky as string);
    }
  });

  it("truncates the last head label inside its own cell, before the chooser's cell", () => {
    render(
      <DataTable
        rows={rows.slice(0, 2)}
        columns={columns}
        paging="none"
        stickyLastColumn
        columnsMenu
      />,
    );
    const last = screen.getByRole("columnheader", { name: /Score/ });
    const chooser = screen.getByRole("button", { name: /Колонки/ });
    expect(last.contains(chooser)).toBe(false);
    expect(last.nextElementSibling?.contains(chooser)).toBe(true);
    const label = cssRule(CSS, ".headLabel");
    expect(cssValue(label, "overflow")).toBe("hidden");
    expect(cssValue(label, "text-overflow")).toBe("ellipsis");
    expect(cssValue(label, "min-width")).toBe("0");
    expect(cssValue(cssRule(CSS, ".headTitle"), "min-width")).toBe("0");
    expect(cssValue(cssRule(CSS, ".sortButton"), "min-width")).toBe("0");
    // The pinned last column stands exactly the chooser cell's width off the end edge.
    const menu = cssRule(CSS, ".menuCell");
    for (const prop of ["width", "min-width", "max-width"]) {
      expect(cssValue(menu, prop)).toBe("var(--dt-menu-w)");
    }
    expect(cssValue(menu, "box-sizing")).toBe("border-box");
  });
});
