import * as React from "react";

import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { useControllableState } from "@/hooks/useControllableState";
import { useEdgeOverflow } from "@/hooks/useEdgeOverflow";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { useStateSwap } from "@/hooks/useStateSwap";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { formatLabel } from "@/internal/formatLabel";
import type { ControlSize } from "@/internal/states";
import { SurfaceDepthProvider, useNestedSurfaceDepth } from "@/internal/surfaceDepth";
import swapMotion from "@/internal/swapMotion.module.css";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import styles from "./DataTable.module.css";
import { Footer } from "./Footer";
import { Head } from "./Head";
import { DataTableRow, MeasureBody, type RowShared } from "./Row";
import { flatten, nextSort, sortRows } from "./rows";
import { StateRows } from "./StateRows";
import type { DataTableColumn, DataTableSortState } from "./types";
import { useColumnHover } from "./useColumnHover";
import { useFrozenColumns } from "./useFrozenColumns";
import { useInfiniteRows } from "./useInfiniteRows";
import { useRowSelection } from "./useRowSelection";

export type { DataTableColumn, DataTableOrder, DataTableSortState } from "./types";

/** System strings; `{from}`, `{to}`, `{total}`, `{label}`, `{count}` are replaced. */
export type DataTableLabels = {
  /** Screen-reader announcement while skeleton rows are shown. */
  loading: string;
  /** Default empty-state text (when `empty` is not set). */
  empty: string;
  /** Footer range line. */
  range: string;
  /** Footer status while `loadingMore`. */
  loadingMore: string;
  /** Footer hint when more rows can be revealed or loaded by scrolling. */
  scrollForMore: string;
  /** `aria-label` of the header «select all» checkbox. */
  selectAll: string;
  /** `aria-label` of a row checkbox; `{label}` is `getRowLabel(row)` (empty without it). */
  selectRow: string;
  /** Screen-reader announcement after the selection changes. */
  selectedCount: string;
  /** `aria-label` of the expand toggle of a collapsed row. */
  expand: string;
  /** `aria-label` of the expand toggle of an expanded row. */
  collapse: string;
};

const DEFAULT_LABELS: DataTableLabels = {
  loading: "Загрузка данных…",
  empty: "Нет данных для отображения.",
  range: "Показано {from}–{to} из {total}",
  loadingMore: "Догружаем строки…",
  scrollForMore: "Прокрутите вниз для загрузки",
  selectAll: "Выбрать все строки",
  selectRow: "Выбрать строку {label}",
  selectedCount: "Выбрано: {count}",
  expand: "Развернуть строку {label}",
  collapse: "Свернуть строку {label}",
};

export type DataTableProps<Row> = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** The outer card-fill `<div>`. */
  ref?: React.Ref<HTMLDivElement>;
  columns: DataTableColumn<Row>[];
  /**
   * Ids of columns not rendered (head, body, skeleton, state rows). A column with
   * `hideable: false` stays. The consumer owns the list and the control that changes it.
   */
  hiddenColumns?: string[];
  rows: Row[];
  size?: ControlSize;
  className?: string;
  showHeader?: boolean;
  stickyHeader?: boolean;
  stickyFirstColumn?: boolean;
  /**
   * Stable row id (also for sub-rows from `getRowChildren`; `index` is the index among siblings).
   * Selection and expansion are keyed by it. Without it the id is the row's position, which breaks
   * when sorting — pass it whenever `selectable` or expansion is used.
   */
  getRowKey?: (row: Row, index: number) => React.Key;
  /** Human name of a row for the checkbox / expand toggle `aria-label`s (e.g. the person's name). */
  getRowLabel?: (row: Row) => string;
  onRowClick?: (row: Row, index: number, event: React.MouseEvent<HTMLTableRowElement>) => void;
  loading?: boolean;
  /** Empty-state content (e.g. `EmptyPage`); defaults to `labels.empty`. */
  empty?: React.ReactNode;
  labels?: Partial<DataTableLabels>;
  /** Hairlines between rows. */
  rowDividers?: boolean;
  /** Hairlines between content columns. */
  columnDividers?: boolean;
  sort?: DataTableSortState;
  defaultSort?: DataTableSortState;
  onSortChange?: (sort: DataTableSortState) => void;
  /**
   * `pages` — Pagination in the footer; `infinite` — rows are revealed while scrolling;
   * `none` — every row at once.
   */
  paging?: "pages" | "infinite" | "none";
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** Rows per page (also the first batch in infinite scroll). */
  pageSize?: number;
  infiniteBatchSize?: number;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void | Promise<void>;
  /** Max height of the scroll viewport (number = px). 360 with `paging="infinite"`. */
  scrollHeight?: number | string;
  /** The table spans its container; `false` sizes it by its content. */
  fullWidth?: boolean;
  highlightRowOnHover?: boolean;
  highlightColumnOnHover?: boolean;
  striped?: boolean;
  /**
   * Built-in row selection: a leading checkbox column, header «select all» (indeterminate when
   * partial), Shift+click range, press-and-drag across checkboxes, Space on a focused checkbox,
   * `aria-selected` + `accent-soft` rows and a polite «Выбрано: N» announcement.
   */
  selectable?: boolean;
  selected?: React.Key[];
  defaultSelected?: React.Key[];
  onSelectedChange?: (selected: React.Key[]) => void;
  /** Tree sub-rows: rendered under the parent with the same columns, indented by depth. */
  getRowChildren?: (row: Row) => Row[] | undefined;
  /** Detail panel rendered in a full-width row under an expanded row. */
  renderExpanded?: (row: Row) => React.ReactNode;
  /** Whether a row gets an expand toggle. Default: it has sub-rows, or `renderExpanded` is set. */
  isRowExpandable?: (row: Row) => boolean;
  expanded?: React.Key[];
  defaultExpanded?: React.Key[];
  onExpandedChange?: (expanded: React.Key[]) => void;
  /** Load error: replaces the body with a message in `role="alert"`. */
  error?: React.ReactNode;
  /** Skeleton rows while `loading` without rows. Default `min(pageSize, 5)`. */
  loadingRows?: number;
  /** Panel above the table (search, filters, actions). Wraps on narrow widths. */
  toolbar?: React.ReactNode;
};

const EMPTY_KEYS: React.Key[] = [];
const SKELETON_ROWS = 5;
const INFINITE_SCROLL_HEIGHT = 360;

const domIdPart = (key: React.Key) => String(key).replace(/[^A-Za-z0-9_-]/g, "_");

export function DataTable<Row>({
  columns: allColumns,
  hiddenColumns,
  rows,
  size = "m",
  className,
  showHeader = true,
  stickyHeader = false,
  stickyFirstColumn = false,
  getRowKey,
  onRowClick,
  loading = false,
  empty,
  labels: labelsProp,
  rowDividers = true,
  columnDividers = true,
  sort,
  defaultSort = null,
  onSortChange,
  paging = "pages",
  page,
  defaultPage = 1,
  onPageChange,
  pageSize = 10,
  infiniteBatchSize = 20,
  hasMore = false,
  loadingMore = false,
  onLoadMore,
  scrollHeight,
  fullWidth = true,
  highlightRowOnHover = true,
  highlightColumnOnHover = false,
  striped = false,
  getRowLabel,
  selectable = false,
  selected,
  defaultSelected = EMPTY_KEYS,
  onSelectedChange,
  getRowChildren,
  renderExpanded,
  isRowExpandable,
  expanded,
  defaultExpanded = EMPTY_KEYS,
  onExpandedChange,
  error,
  loadingRows,
  toolbar,
  ref,
  ...rest
}: DataTableProps<Row>) {
  const labels = React.useMemo(() => ({ ...DEFAULT_LABELS, ...labelsProp }), [labelsProp]);
  const infinite = paging === "infinite";
  const paged = paging === "pages";
  const safePageSize = Math.max(1, pageSize);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const tableRef = React.useRef<HTMLTableElement | null>(null);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const mergedRootRef = useMergedRefs(rootRef, ref);
  const depth = useNestedSurfaceDepth();

  // ─── Columns ───
  // Hidden columns are not rendered at all; sorting still reads every column, so hiding the sorted
  // column keeps the row order.
  const columns = React.useMemo(() => {
    if (!hiddenColumns?.length) return allColumns;
    const hidden = new Set(hiddenColumns);
    return allColumns.filter((column) => column.hideable === false || !hidden.has(column.id));
  }, [allColumns, hiddenColumns]);
  // Horizontal overflow of the viewport: the edge cue (shadows at the edges that hide columns).
  const edges = useEdgeOverflow(scrollRef, true, true);

  // ─── Sort and page ───
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
  const sortColumn = sortState
    ? allColumns.find((column) => column.sortable && column.id === sortState.columnId)
    : undefined;
  const sortOrder = sortColumn ? sortState?.order : undefined;
  const sortedRows = React.useMemo(
    () => (sortColumn && sortOrder ? sortRows(rows, sortColumn, sortOrder) : rows),
    [rows, sortColumn, sortOrder],
  );
  const totalRows = sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / safePageSize));
  // An out-of-range page (the data shrank) shows the nearest page; nothing is written back.
  const safePage = paged ? Math.min(Math.max(pageState, 1), totalPages) : 1;
  const pageOffset = paged ? (safePage - 1) * safePageSize : 0;

  // A new sort changes the order of the whole data set: back to page 1.
  const handleSort = (columnId: string) => {
    setSortState(nextSort(sortState, columnId));
    setPageState(1);
  };

  const infiniteRows = useInfiniteRows({
    enabled: infinite,
    pageSize: safePageSize,
    batchSize: infiniteBatchSize,
    totalRows,
    hasMore,
    loadingMore,
    onLoadMore,
    scrollRef,
  });
  const end = infinite ? infiniteRows.visibleCount : paged ? pageOffset + safePageSize : totalRows;
  const displayedCount = Math.max(0, Math.min(end, totalRows) - pageOffset);

  /*
   * Rows that appeared in `rows` since the previous data (by `getRowKey`; positional ids cannot tell
   * a new row from a shifted one). They play the enter animation once when mounted. The first fill
   * (from no rows) is not an addition. The set is kept until the next real addition, so unrelated
   * re-renders never cut a running animation short. Removed rows unmount at once.
   */
  const [rowArrival, setRowArrival] = React.useState<{ rows: Row[]; added: Set<React.Key> }>(
    () => ({ rows, added: new Set() }),
  );
  if (rowArrival.rows !== rows) {
    let added = rowArrival.added;
    if (getRowKey && rowArrival.rows.length > 0) {
      const previous = new Set(rowArrival.rows.map((row, i) => getRowKey(row, i)));
      const fresh = new Set<React.Key>();
      rows.forEach((row, i) => {
        const key = getRowKey(row, i);
        if (!previous.has(key)) fresh.add(key);
      });
      if (fresh.size > 0) added = fresh;
    }
    setRowArrival({ rows, added });
  }

  // ─── Expansion ───
  const expandEnabled = Boolean(getRowChildren || renderExpanded);
  const [expandedKeys, setExpandedKeys] = useControllableState<React.Key[]>({
    value: expanded,
    defaultValue: defaultExpanded,
    onChange: onExpandedChange,
  });
  const expandedSet = React.useMemo(() => new Set(expandedKeys), [expandedKeys]);
  /** Row whose latest expand mounted new rows: only those animate in. */
  const [lastExpandedKey, setLastExpandedKey] = React.useState<React.Key | null>(null);
  /** The latest expansion for the stable toggle (memoized rows keep their props). */
  const expansion = React.useRef({ expandedKeys, setExpandedKeys });
  expansion.current = { expandedKeys, setExpandedKeys };
  const toggleExpanded = React.useCallback((key: React.Key) => {
    const { expandedKeys: keys, setExpandedKeys: setKeys } = expansion.current;
    const isOpen = keys.includes(key);
    setLastExpandedKey(isOpen ? null : key);
    setKeys(isOpen ? keys.filter((k) => k !== key) : [...keys, key]);
  }, []);

  const flat = React.useMemo(
    () =>
      flatten(sortedRows, {
        start: pageOffset,
        end,
        getRowKey,
        getRowChildren,
        sortColumn,
        order: sortOrder,
        expandEnabled,
        withDetail: Boolean(renderExpanded),
        isRowExpandable,
        expanded: expandedSet,
        arrived: rowArrival.added,
        lastExpandedKey,
        collectKeys: selectable,
      }),
    [
      sortedRows,
      pageOffset,
      end,
      getRowKey,
      getRowChildren,
      sortColumn,
      sortOrder,
      expandEnabled,
      renderExpanded,
      isRowExpandable,
      expandedSet,
      rowArrival.added,
      lastExpandedKey,
      selectable,
    ],
  );
  const visibleKeys = React.useMemo(() => flat.rows.map((item) => item.key), [flat]);

  // ─── Selection ───
  const selection = useRowSelection({
    selected,
    defaultSelected,
    onSelectedChange,
    visibleKeys,
    allKeys: flat.keys,
    tableRef,
    announce: (count) => formatLabel(labels.selectedCount, { count }),
  });

  // ─── States ───
  const hasError = error != null && error !== false;
  const showSkeleton = !hasError && loading && displayedCount === 0;
  const showEmpty = !hasError && !loading && displayedCount === 0;
  const bodyState = hasError ? "error" : showSkeleton ? "loading" : showEmpty ? "empty" : "rows";
  /* Body state swaps (loading → rows → empty / error) cross-fade: the body remounts under its
     state key and fades in; the first render, sorting and paging stay still (same state). */
  const bodySwapped = useStateSwap(bodyState);
  const totalColumns = columns.length + (selectable ? 1 : 0) + (expandEnabled ? 1 : 0);
  const maxHeight = scrollHeight ?? (infinite ? INFINITE_SCROLL_HEIGHT : undefined);
  const columnHover = useColumnHover(highlightColumnOnHover);

  useFrozenColumns(
    tableRef,
    rootRef,
    columns.map((column) => column.id).join("\u0000"),
    flat,
    bodyState === "rows",
  );

  const baseId = React.useId();
  const rowDomId = React.useCallback(
    (key: React.Key) => `${baseId}-row-${domIdPart(key)}`,
    [baseId],
  );
  const detailDomId = React.useCallback(
    (key: React.Key) => `${baseId}-detail-${domIdPart(key)}`,
    [baseId],
  );

  const shared = React.useMemo<RowShared<Row>>(
    () => ({
      columns,
      size,
      labels,
      selectable,
      expandEnabled,
      stickyFirstColumn,
      striped,
      totalColumns,
      getRowLabel,
      onRowClick,
      renderExpanded,
      rowDomId,
      detailDomId,
      selection: selection.handlers,
      toggleExpanded,
    }),
    [
      columns,
      size,
      labels,
      selectable,
      expandEnabled,
      stickyFirstColumn,
      striped,
      totalColumns,
      getRowLabel,
      onRowClick,
      renderExpanded,
      rowDomId,
      detailDomId,
      selection.handlers,
      toggleExpanded,
    ],
  );

  /* «Показано 0–0 из 0» means nothing in loading / empty / error states: the body already says it,
     and «Показано 1–5 из 5» says nothing when every row is already on screen. */
  const showRange = bodyState === "rows" && (infinite || (paged && totalPages > 1));
  const showInfiniteStatus =
    !hasError &&
    infinite &&
    (infiniteRows.hasInternalMore || loadingMore || infiniteRows.canRequestMore);

  return (
    <SurfaceDepthProvider value={depth}>
      <ControlSizeProvider value={size}>
        <div
          {...rest}
          ref={mergedRootRef}
          className={cx(styles.root, className)}
          data-depth={depth}
          {...toDataAttributes({
            size,
            "row-dividers": rowDividers ? undefined : "false",
            "column-dividers": columnDividers ? undefined : "false",
            "sticky-header": stickyHeader,
            "sticky-first-column": stickyFirstColumn,
            "table-width": columns.some((c) => c.grow) ? "grow" : fullWidth ? "fill" : "auto",
            "highlight-row": highlightRowOnHover,
            "highlight-column": highlightColumnOnHover,
            striped,
            loading: loading || undefined,
            selectable: selectable || undefined,
            expandable: expandEnabled || undefined,
            dragging: selection.dragging || undefined,
            "overflow-start": edges.start || undefined,
            "overflow-end": edges.end || undefined,
          })}
        >
          {toolbar != null ? <div className={styles.toolbar}>{toolbar}</div> : null}

          {/* The frame holds the edge shadows over the viewport; they never scroll with the table. */}
          <div className={styles.frame}>
            <ScrollContainer
              ref={scrollRef}
              axis="both"
              overscrollBehavior="none"
              className={styles.viewport}
              style={{ maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight }}
            >
              <table
                ref={tableRef}
                className={styles.table}
                aria-busy={loading || loadingMore || undefined}
                {...columnHover}
              >
                <colgroup>
                  {selectable ? <col /> : null}
                  {expandEnabled ? <col /> : null}
                  {columns.map((column) => (
                    <col key={column.id} data-grow={column.grow ? "true" : undefined} />
                  ))}
                </colgroup>
                {showHeader ? (
                  <Head
                    columns={columns}
                    size={size}
                    sort={sortState}
                    onSort={handleSort}
                    stickyFirstColumn={stickyFirstColumn}
                    stickyCorner={stickyHeader && stickyFirstColumn}
                    expandEnabled={expandEnabled}
                    selectAll={
                      selectable
                        ? {
                            checked: selection.allSelected,
                            indeterminate: selection.someSelected,
                            disabled: flat.keys.length === 0,
                            label: labels.selectAll,
                            onToggle: selection.toggleAll,
                          }
                        : undefined
                    }
                  />
                ) : null}

                <tbody
                  key={bodySwapped ? bodyState : undefined}
                  className={bodySwapped ? swapMotion.swapIn : undefined}
                >
                  {bodyState === "rows" ? (
                    flat.rows.map((item, index) => (
                      <DataTableRow
                        key={String(item.key)}
                        shared={shared}
                        row={item.row}
                        rowKey={item.key}
                        index={index}
                        depth={item.depth}
                        expandable={item.expandable}
                        expanded={item.expanded}
                        animate={item.animate}
                        detailAnimate={lastExpandedKey === item.key}
                        selected={selectable && selection.selectedSet.has(item.key)}
                        childControls={item.childKeys.map(rowDomId).join(" ")}
                      />
                    ))
                  ) : (
                    <StateRows
                      state={bodyState}
                      columns={columns}
                      size={size}
                      totalColumns={totalColumns}
                      selectable={selectable}
                      expandEnabled={expandEnabled}
                      error={error}
                      empty={empty}
                      emptyLabel={labels.empty}
                      skeletonRows={Math.max(
                        1,
                        loadingRows ?? Math.min(safePageSize, SKELETON_ROWS),
                      )}
                    />
                  )}
                </tbody>

                {flat.measure.length > 0 && !hasError ? (
                  <MeasureBody
                    rows={flat.measure}
                    columns={columns}
                    selectable={selectable}
                    expandEnabled={expandEnabled}
                  />
                ) : null}
              </table>

              {infinite ? (
                <div
                  ref={infiniteRows.sentinelRef}
                  className={styles.sentinel}
                  aria-hidden="true"
                />
              ) : null}
            </ScrollContainer>
          </div>

          {showSkeleton ? <VisuallyHidden role="status">{labels.loading}</VisuallyHidden> : null}

          {selectable ? (
            <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">
              {selection.announcement}
            </VisuallyHidden>
          ) : null}

          <Footer
            size={size}
            range={
              showRange
                ? formatLabel(labels.range, {
                    from: pageOffset + 1,
                    to: pageOffset + displayedCount,
                    total: totalRows,
                  })
                : null
            }
            pagination={
              paged && totalPages > 1
                ? { page: safePage, totalPages, onPageChange: setPageState }
                : null
            }
            status={
              showInfiniteStatus ? (loadingMore ? labels.loadingMore : labels.scrollForMore) : null
            }
          />
        </div>
      </ControlSizeProvider>
    </SurfaceDepthProvider>
  );
}
