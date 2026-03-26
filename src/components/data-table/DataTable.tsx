import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import * as React from "react";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { useControllableState } from "@/hooks/useControllableState";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { DATA_TABLE_INFINITE_ROOT_MARGIN } from "@/internal/runtimeUnits";
import type { DataTableSize } from "@/internal/states";

import { Pagination } from "../pagination/Pagination";
import styles from "./DataTable.module.css";

export type { DataTableSize };

export type DataTableOrder = "asc" | "desc";
export type DataTableSortState = { columnId: string; order: DataTableOrder } | null;
export type DataTableCellAlign = "start" | "center" | "end";
export type DataTableDividerStyle = "standard" | "dashed" | "dotted" | "none";

export type DataTableColumn<Row> = {
  id: string;
  header: React.ReactNode;
  accessor?: keyof Row | ((row: Row) => unknown);
  cell?: (row: Row) => React.ReactNode;
  sortable?: boolean;
  sortAccessor?: (row: Row) => unknown;
  sortComparator?: (a: Row, b: Row, order: DataTableOrder) => number;
  align?: DataTableCellAlign;
  /** Задаётся на `<col>` (CSS `width`). */
  width?: string;
  /** Минимальная ширина колонки (`min-width` на `<col>`). */
  minWidth?: string;
  /** Максимальная ширина колонки (`max-width` на `<col>`). */
  maxWidth?: string;
  onHeaderClick?: (event: React.MouseEvent<HTMLTableCellElement>) => void;
  onCellClick?: (
    row: Row,
    event: React.MouseEvent<HTMLTableCellElement> | React.KeyboardEvent<HTMLTableCellElement>,
  ) => void;
};

export type DataTableRootProps<Row> = {
  columns: DataTableColumn<Row>[];
  rows: Row[];
  size?: DataTableSize;
  className?: string;
  showHeader?: boolean;
  stickyHeader?: boolean;
  stickyFirstColumn?: boolean;
  getRowKey?: (row: Row, index: number) => React.Key;
  onRowClick?: (row: Row, index: number, event: React.MouseEvent<HTMLTableRowElement>) => void;
  loading?: boolean;
  loadingText?: React.ReactNode;
  emptyText?: React.ReactNode;
  dividerStyle?: DataTableDividerStyle;
  sort?: DataTableSortState;
  defaultSort?: DataTableSortState;
  onSortChange?: (sort: DataTableSortState) => void;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  showPagination?: boolean;
  siblingCount?: number;
  paginationSize?: DataTableSize;
  infiniteScroll?: boolean;
  initialVisibleRows?: number;
  infiniteBatchSize?: number;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void | Promise<void>;
  scrollHeight?: number | string;
  /** Подсветка строки при наведении (полупрозрачная смесь с фоном строки). */
  highlightRowOnHover?: boolean;
  /** Подсветка колонки под курсором (шапка + ячейки). */
  highlightColumnOnHover?: boolean;
  /** Чередование фона строк (зебра). */
  striped?: boolean;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

function comparePrimitive(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "boolean" && typeof b === "boolean") return Number(a) - Number(b);
  if (isDate(a) && isDate(b)) return a.getTime() - b.getTime();

  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function getColumnValue<Row>(row: Row, column: DataTableColumn<Row>): unknown {
  if (column.sortAccessor) return column.sortAccessor(row);

  if (typeof column.accessor === "function") return column.accessor(row);

  if (typeof column.accessor === "string") {
    const key = column.accessor as keyof Row;
    return row[key];
  }

  return undefined;
}

function renderColumnCell<Row>(row: Row, column: DataTableColumn<Row>): React.ReactNode {
  if (column.cell) return column.cell(row);
  const value = getColumnValue(row, column);
  if (value == null) return "—";
  return String(value);
}

function nextOrder(current: DataTableSortState, columnId: string): DataTableSortState {
  if (!current || current.columnId !== columnId) return { columnId, order: "asc" };
  if (current.order === "asc") return { columnId, order: "desc" };
  return null;
}

function sortIndicator(sort: DataTableSortState, columnId: string): string {
  if (!sort || sort.columnId !== columnId) return "none";
  return sort.order;
}

function columnColStyle<Row>(column: DataTableColumn<Row>): React.CSSProperties | undefined {
  const { width, minWidth, maxWidth } = column;
  if (!width && !minWidth && !maxWidth) return undefined;
  return {
    ...(width ? { width } : {}),
    ...(minWidth ? { minWidth } : {}),
    ...(maxWidth ? { maxWidth } : {}),
  };
}

function DataTableRoot<Row>({
  columns,
  rows,
  size = "m",
  className,
  showHeader = true,
  stickyHeader = false,
  stickyFirstColumn = false,
  getRowKey,
  onRowClick,
  loading = false,
  loadingText = "Загрузка данных…",
  emptyText = "Нет данных для отображения.",
  dividerStyle = "standard",
  sort,
  defaultSort = null,
  onSortChange,
  page,
  defaultPage = 1,
  onPageChange,
  pageSize = 10,
  showPagination = true,
  siblingCount = 1,
  paginationSize,
  infiniteScroll = false,
  initialVisibleRows,
  infiniteBatchSize = 20,
  hasMore = false,
  loadingMore = false,
  onLoadMore,
  scrollHeight = 360,
  highlightRowOnHover = true,
  highlightColumnOnHover = false,
  striped = false,
}: DataTableRootProps<Row>) {
  const [hoveredColumnId, setHoveredColumnId] = React.useState<string | null>(null);

  const clearHoveredColumn = React.useCallback(() => {
    setHoveredColumnId(null);
  }, []);

  const setHoveredColumn = React.useCallback(
    (columnId: string) => {
      if (highlightColumnOnHover) setHoveredColumnId(columnId);
    },
    [highlightColumnOnHover],
  );

  const [sortState, setSortState] = useControllableState<DataTableSortState>({
    value: sort,
    defaultValue: defaultSort,
    onChange: onSortChange,
  });

  const [pageState, setPageState] = useControllableState<number>({
    value: page,
    defaultValue: defaultPage,
    onChange: onPageChange,
  });

  const initialVisible = Math.max(1, initialVisibleRows ?? pageSize);
  const [visibleRowCount, setVisibleRowCount] = React.useState(initialVisible);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    const viewport = scrollRef.current;
    if (!viewport) return;

    viewport.style.maxHeight = infiniteScroll
      ? typeof scrollHeight === "number"
        ? `${scrollHeight}px`
        : scrollHeight
      : "";
  }, [infiniteScroll, scrollHeight]);

  const sortableColumns = React.useMemo(
    () => new Set(columns.filter((c) => c.sortable).map((c) => c.id)),
    [columns],
  );

  const sortedRows = React.useMemo(() => {
    if (!sortState || !sortableColumns.has(sortState.columnId)) return rows;

    const column = columns.find((item) => item.id === sortState.columnId);
    if (!column) return rows;

    const direction = sortState.order === "asc" ? 1 : -1;
    return rows
      .map((row, index) => ({ row, index }))
      .sort((a, b) => {
        const compared = column.sortComparator
          ? column.sortComparator(a.row, b.row, sortState.order)
          : comparePrimitive(getColumnValue(a.row, column), getColumnValue(b.row, column));

        if (compared === 0) return a.index - b.index;
        return compared * direction;
      })
      .map((item) => item.row);
  }, [columns, rows, sortState, sortableColumns]);

  const totalRows = sortedRows.length;
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(totalRows / safePageSize));
  const safePage = clamp(pageState, 1, totalPages);

  React.useEffect(() => {
    if (safePage !== pageState) setPageState(safePage);
  }, [pageState, safePage, setPageState]);

  React.useEffect(() => {
    if (infiniteScroll) {
      setVisibleRowCount(initialVisible);
      return;
    }
    setPageState(1);
  }, [infiniteScroll, initialVisible, setPageState]);

  React.useEffect(() => {
    if (!infiniteScroll) return;
    setVisibleRowCount((prev) => clamp(prev, initialVisible, Math.max(initialVisible, totalRows)));
  }, [infiniteScroll, initialVisible, totalRows]);

  const displayedRows = React.useMemo(() => {
    if (infiniteScroll) {
      return sortedRows.slice(0, visibleRowCount);
    }
    const from = (safePage - 1) * safePageSize;
    const to = from + safePageSize;
    return sortedRows.slice(from, to);
  }, [infiniteScroll, safePage, safePageSize, sortedRows, visibleRowCount]);

  const hasInternalMore = infiniteScroll && displayedRows.length < totalRows;
  const canRequestMore = infiniteScroll && Boolean(onLoadMore) && hasMore && !loadingMore;

  const handleReachEnd = React.useCallback(() => {
    if (!infiniteScroll) return;

    if (hasInternalMore) {
      setVisibleRowCount((prev) => Math.min(prev + Math.max(1, infiniteBatchSize), totalRows));
      return;
    }

    if (canRequestMore && onLoadMore) {
      void onLoadMore();
    }
  }, [canRequestMore, hasInternalMore, infiniteBatchSize, infiniteScroll, onLoadMore, totalRows]);

  React.useEffect(() => {
    if (!infiniteScroll) return;
    const root = scrollRef.current;
    const target = sentinelRef.current;
    if (!root || !target) return;

    if (typeof IntersectionObserver === "undefined") {
      const onScroll = () => {
        const nearBottom = root.scrollTop + root.clientHeight >= root.scrollHeight - 64;
        if (nearBottom) {
          handleReachEnd();
        }
      };
      root.addEventListener("scroll", onScroll);
      return () => root.removeEventListener("scroll", onScroll);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          handleReachEnd();
        }
      },
      { root, rootMargin: DATA_TABLE_INFINITE_ROOT_MARGIN, threshold: 0.01 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [handleReachEnd, infiniteScroll]);

  const fromRow = totalRows === 0 ? 0 : infiniteScroll ? 1 : (safePage - 1) * safePageSize + 1;
  const toRow =
    totalRows === 0
      ? 0
      : infiniteScroll
        ? displayedRows.length
        : fromRow + displayedRows.length - 1;

  return (
    <ControlSizeProvider value={size}>
      <div
        className={cx(styles.root, className)}
        {...toDataAttributes({
          size,
          divider: dividerStyle,
          "show-header": showHeader,
          "sticky-header": stickyHeader,
          "sticky-first-column": stickyFirstColumn,
          "highlight-row": highlightRowOnHover,
          "highlight-column": highlightColumnOnHover,
          striped,
        })}
      >
        <ScrollContainer
          ref={scrollRef}
          axis="both"
          overscrollBehavior="auto"
          className={styles.viewport}
        >
          <table
            className={styles.table}
            onMouseLeave={highlightColumnOnHover ? clearHoveredColumn : undefined}
          >
            <colgroup>
              {columns.map((column) => (
                <col key={column.id} style={columnColStyle(column)} />
              ))}
            </colgroup>

            {showHeader ? (
              <thead className={styles.head}>
                <tr className={styles.headRow}>
                  {columns.map((column, columnIndex) => {
                    const align = column.align ?? "start";
                    const indicator = sortIndicator(sortState, column.id);
                    const isSortable = Boolean(column.sortable);
                    const isFirstColumn = columnIndex === 0;
                    return (
                      <th
                        key={column.id}
                        className={cx(
                          styles.headCell,
                          stickyFirstColumn && isFirstColumn && styles.firstColumnSticky,
                          stickyHeader &&
                            stickyFirstColumn &&
                            isFirstColumn &&
                            styles.cornerCellSticky,
                        )}
                        data-align={align}
                        data-sortable={isSortable ? "true" : undefined}
                        data-first-column={isFirstColumn ? "true" : undefined}
                        data-column-id={column.id}
                        data-column-hovered={
                          highlightColumnOnHover && hoveredColumnId === column.id
                            ? "true"
                            : undefined
                        }
                        scope="col"
                        onMouseEnter={() => setHoveredColumn(column.id)}
                        onClick={(event) => {
                          column.onHeaderClick?.(event);
                          if (!isSortable) return;
                          const next = nextOrder(sortState, column.id);
                          setSortState(next);
                          setPageState(1);
                        }}
                      >
                        {column.sortable ? (
                          <span className={styles.sortButton}>
                            <span className={styles.sortLabel}>{column.header}</span>
                            <span className={styles.sortIcon} aria-hidden="true">
                              {indicator === "asc" ? (
                                <ArrowUp className={styles.sortGlyph} strokeWidth={2} />
                              ) : indicator === "desc" ? (
                                <ArrowDown className={styles.sortGlyph} strokeWidth={2} />
                              ) : (
                                <ArrowUpDown className={styles.sortGlyph} strokeWidth={2} />
                              )}
                            </span>
                          </span>
                        ) : (
                          <span className={styles.headLabel}>{column.header}</span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
            ) : null}

            <tbody className={styles.body}>
              {loading && displayedRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className={styles.stateCell}>
                    {loadingText}
                  </td>
                </tr>
              ) : null}

              {!loading && displayedRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className={styles.stateCell}>
                    {emptyText}
                  </td>
                </tr>
              ) : null}

              {displayedRows.map((row, index) => (
                <tr
                  key={getRowKey ? getRowKey(row, index) : index}
                  className={styles.row}
                  data-stripe={striped && index % 2 === 1 ? "alt" : undefined}
                  onClick={(event) => onRowClick?.(row, index, event)}
                >
                  {columns.map((column, columnIndex) => {
                    const isFirstColumn = columnIndex === 0;
                    const isCellClickable = Boolean(column.onCellClick);
                    return (
                      <td
                        key={column.id}
                        className={cx(
                          styles.cell,
                          stickyFirstColumn && isFirstColumn && styles.firstColumnSticky,
                        )}
                        data-align={column.align ?? "start"}
                        data-first-column={isFirstColumn ? "true" : undefined}
                        data-column-id={column.id}
                        data-column-hovered={
                          highlightColumnOnHover && hoveredColumnId === column.id
                            ? "true"
                            : undefined
                        }
                        onMouseEnter={() => setHoveredColumn(column.id)}
                        onClick={(event) => column.onCellClick?.(row, event)}
                        role={isCellClickable ? "button" : undefined}
                        tabIndex={isCellClickable ? 0 : undefined}
                        onKeyDown={
                          isCellClickable
                            ? (event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                  event.preventDefault();
                                  column.onCellClick?.(row, event);
                                }
                              }
                            : undefined
                        }
                      >
                        {renderColumnCell(row, column)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {infiniteScroll ? (
            <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
          ) : null}
        </ScrollContainer>

        <div className={styles.footer}>
          <p className={styles.meta}>
            Показано {fromRow}–{toRow} из {totalRows}
          </p>

          {!infiniteScroll && showPagination && totalPages > 1 ? (
            <Pagination.Root
              page={safePage}
              totalPages={totalPages}
              onPageChange={setPageState}
              siblingCount={siblingCount}
              size={paginationSize ?? size}
            />
          ) : null}

          {infiniteScroll && (hasInternalMore || loadingMore || canRequestMore) ? (
            <p className={styles.meta}>
              {loadingMore ? "Догружаем строки…" : "Прокрутите вниз для загрузки"}
            </p>
          ) : null}
        </div>
      </div>
    </ControlSizeProvider>
  );
}

DataTableRoot.displayName = "DataTableRoot";

export const DataTable = {
  Root: DataTableRoot,
};
