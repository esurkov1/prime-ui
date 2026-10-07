import * as React from "react";

import { Button } from "@/components/button/Button";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { EmptyPage } from "@/components/empty-page/EmptyPage";
import { Pagination } from "@/components/pagination/Pagination";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { useControllableState } from "@/hooks/useControllableState";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import { DATA_TABLE_INFINITE_ROOT_MARGIN } from "@/internal/runtimeUnits";
import type { ControlSize } from "@/internal/states";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import styles from "./DataTable.module.css";
import { columnValue, nextSort, sortRows } from "./sort";
import { useFrozenColumns } from "./useFrozenColumns";

export type DataTableOrder = "asc" | "desc";
export type DataTableSortState = { columnId: string; order: DataTableOrder } | null;
type CellAlign = "start" | "center" | "end";

export type DataTableColumn<Row> = {
  id: string;
  header: React.ReactNode;
  accessor?: keyof Row | ((row: Row) => unknown);
  cell?: (row: Row) => React.ReactNode;
  sortable?: boolean;
  sortAccessor?: (row: Row) => unknown;
  sortComparator?: (a: Row, b: Row, order: DataTableOrder) => number;
  align?: CellAlign;
  /**
   * Header alignment, independent of `align`: headers start at the start edge so every header lines
   * up, with the sort indicator at the end edge.
   */
  headerAlign?: CellAlign;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  /** `tabular-nums`, no wrapping, `end` alignment unless `align` is set. */
  numeric?: boolean;
  /** One line with an ellipsis; width from `maxWidth` (or `width`); string values get a `title`. */
  truncate?: boolean;
  /**
   * The column takes the free width of the table and wraps its text (descriptions, comments). With
   * such a column the table fills its container instead of growing to its content width.
   */
  grow?: boolean;
  onHeaderClick?: (event: React.MouseEvent<HTMLTableCellElement>) => void;
  onCellClick?: (
    row: Row,
    event: React.MouseEvent<HTMLTableCellElement> | React.KeyboardEvent<HTMLTableCellElement>,
  ) => void;
};

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

function fill(template: string, values: Record<string, string | number | undefined>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? "")).trim();
}

export type DataTableProps<Row> = {
  columns: DataTableColumn<Row>[];
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
  initialVisibleRows?: number;
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

function columnAlign<Row>(column: DataTableColumn<Row>): CellAlign {
  return column.align ?? (column.numeric ? "end" : "start");
}

const ARIA_SORT = { asc: "ascending", desc: "descending" } as const;
const SORT_ICON = { asc: "sort.ascending", desc: "sort.descending" } as const;

type FlatRow<Row> = {
  row: Row;
  key: React.Key;
  depth: number;
  /** Ids of the direct sub-rows (empty when none). */
  childKeys: React.Key[];
  expandable: boolean;
  expanded: boolean;
  /** Mounted by the latest expand, or newly added to `rows`: plays the enter animation. */
  animate: boolean;
};

const EMPTY_KEYS: React.Key[] = [];

/** Toggle buttons sit one tier below the table tier (m table → xs button, 28). */
const TOGGLE_SIZE: Record<ControlSize, ControlSize> = {
  xs: "xs",
  s: "xs",
  m: "xs",
  l: "s",
  xl: "s",
};

const domIdPart = (key: React.Key) => String(key).replace(/[^A-Za-z0-9_-]/g, "_");

const SKELETON_ROWS = 5;
const INFINITE_SCROLL_HEIGHT = 360;

function columnSizeStyle<Row>(column: DataTableColumn<Row>): React.CSSProperties | undefined {
  const { width, minWidth, maxWidth, grow } = column;
  if (!width && !minWidth && !maxWidth && !grow) return undefined;
  return { width: width ?? (grow ? "100%" : undefined), minWidth, maxWidth };
}

function renderCell<Row>(row: Row, column: DataTableColumn<Row>, withTitle: boolean) {
  const content = column.cell
    ? column.cell(row)
    : ((value) => (value == null ? "—" : String(value)))(columnValue(row, column));
  if (!column.truncate) return content;
  return (
    <span
      className={styles.truncate}
      style={{ maxWidth: column.maxWidth ?? column.width }}
      title={
        withTitle && (typeof content === "string" || typeof content === "number")
          ? String(content)
          : undefined
      }
    >
      {content}
    </span>
  );
}

export function DataTable<Row>({
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
  initialVisibleRows,
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
}: DataTableProps<Row>) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const infinite = paging === "infinite";
  const [hoveredColumnId, setHoveredColumnId] = React.useState<string | null>(null);
  const hoverColumn = (columnId: string) => {
    if (highlightColumnOnHover) setHoveredColumnId(columnId);
  };

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

  const safePageSize = Math.max(1, pageSize);
  const initialVisible = Math.max(1, initialVisibleRows ?? safePageSize);
  const [visibleRowCount, setVisibleRowCount] = React.useState(initialVisible);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const tableRef = React.useRef<HTMLTableElement | null>(null);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const sortColumn =
    sortState && columns.find((column) => column.sortable && column.id === sortState.columnId);

  /** Sub-rows of a row, sorted like the top level. */
  const childrenOf = (row: Row): Row[] => {
    const list = getRowChildren?.(row) ?? [];
    return sortColumn && sortState && list.length > 1
      ? sortRows(list, sortColumn, sortState.order)
      : list;
  };

  const sortedRows = React.useMemo(
    () => (sortColumn && sortState ? sortRows(rows, sortColumn, sortState.order) : rows),
    [rows, sortColumn, sortState],
  );

  const keyOf = (row: Row, index: number, parentKey: React.Key | null): React.Key => {
    if (getRowKey) return getRowKey(row, index);
    return parentKey === null ? index : `${String(parentKey)}.${index}`;
  };

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

  const expandEnabled = Boolean(getRowChildren || renderExpanded);
  const [expandedKeys, setExpandedKeys] = useControllableState<React.Key[]>({
    value: expanded,
    defaultValue: defaultExpanded,
    onChange: onExpandedChange,
  });
  const expandedSet = new Set(expandedKeys);
  /** Row whose latest expand mounted new rows: only those animate in. */
  const [lastExpandedKey, setLastExpandedKey] = React.useState<React.Key | null>(null);

  const [selectedKeys, setSelectedKeys] = useControllableState<React.Key[]>({
    value: selected,
    defaultValue: defaultSelected,
    onChange: onSelectedChange,
  });
  const selectedSet = new Set(selectedKeys);

  const totalRows = sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / safePageSize));
  const paged = paging === "pages";
  const safePage = paged ? Math.min(Math.max(pageState, 1), totalPages) : 1;

  React.useEffect(() => {
    if (paged && safePage !== pageState) setPageState(safePage);
  }, [paged, pageState, safePage, setPageState]);

  React.useEffect(() => {
    if (infinite) setVisibleRowCount(initialVisible);
    else setPageState(1);
  }, [infinite, initialVisible, setPageState]);

  React.useEffect(() => {
    if (!infinite) return;
    setVisibleRowCount((prev) =>
      Math.min(Math.max(prev, initialVisible), Math.max(initialVisible, totalRows)),
    );
  }, [infinite, initialVisible, totalRows]);

  const pageOffset = paged ? (safePage - 1) * safePageSize : 0;
  const displayedRows = infinite
    ? sortedRows.slice(0, visibleRowCount)
    : paged
      ? sortedRows.slice(pageOffset, pageOffset + safePageSize)
      : sortedRows;

  /*
   * Rendered rows in order: page rows plus the sub-rows of expanded rows. `measureRows` are the
   * sub-rows of collapsed rows: drawn collapsed so the columns are already as wide as they will be
   * once a row opens.
   */
  const flatRows: FlatRow<Row>[] = [];
  const measureRows: { row: Row; key: React.Key; depth: number }[] = [];
  const collect = (list: Row[], depth: number, parentKey: React.Key) => {
    list.forEach((row, i) => {
      const key = keyOf(row, i, parentKey);
      measureRows.push({ row, key, depth });
      collect(childrenOf(row), depth + 1, key);
    });
  };
  const visit = (
    list: Row[],
    depth: number,
    parentKey: React.Key | null,
    parentAnimate: boolean,
    offset: number,
  ) => {
    list.forEach((row, i) => {
      const key = keyOf(row, offset + i, parentKey);
      const children = expandEnabled ? childrenOf(row) : [];
      const expandable = expandEnabled
        ? (isRowExpandable?.(row) ?? (children.length > 0 || Boolean(renderExpanded)))
        : false;
      const isExpanded = expandable && expandedSet.has(key);
      flatRows.push({
        row,
        key,
        depth,
        childKeys: children.map((child, ci) => keyOf(child, ci, key)),
        expandable,
        expanded: isExpanded,
        animate: parentAnimate || (depth === 0 && rowArrival.added.has(key)),
      });
      if (isExpanded && children.length > 0) {
        visit(children, depth + 1, key, parentAnimate || lastExpandedKey === key, 0);
      } else if (children.length > 0) {
        collect(children, depth + 1, key);
      }
    });
  };
  visit(displayedRows, 0, null, false, pageOffset);

  /** Every row id in the data (all pages, all depths): the scope of «select all». */
  const allKeys: React.Key[] = [];
  if (selectable) {
    const gather = (list: Row[], parentKey: React.Key | null) => {
      list.forEach((row, i) => {
        const key = keyOf(row, i, parentKey);
        allKeys.push(key);
        const children = getRowChildren?.(row);
        if (children?.length) gather(children, key);
      });
    };
    gather(sortedRows, null);
  }
  const selectedInData = allKeys.filter((key) => selectedSet.has(key)).length;
  const allSelected = allKeys.length > 0 && selectedInData === allKeys.length;
  const someSelected = selectedInData > 0 && !allSelected;

  // ─── Selection interactions ───
  const [announcement, setAnnouncement] = React.useState("");
  const [dragging, setDragging] = React.useState(false);
  const selectedRef = React.useRef(selectedSet);
  selectedRef.current = selectedSet;
  const flatRef = React.useRef(flatRows);
  flatRef.current = flatRows;
  const anchorRef = React.useRef<React.Key | null>(null);
  const shiftKeyRef = React.useRef(false);
  /** The pointer already applied the change: the click that follows must not toggle again. */
  const pointerHandledRef = React.useRef(false);
  /** Set while a cancelled pointer click is dispatched: its checkbox change (if any) is ignored. */
  const ignoreChangeRef = React.useRef(false);
  const dragCleanupRef = React.useRef<(() => void) | null>(null);
  React.useEffect(() => () => dragCleanupRef.current?.(), []);

  const commitSelection = (next: Set<React.Key>) => {
    selectedRef.current = next;
    setSelectedKeys(Array.from(next));
    setAnnouncement(fill(labels.selectedCount, { count: next.size }));
  };

  /** Sets every rendered row between two visible indices (inclusive) to `value`. */
  const applyRange = (from: number, to: number, value: boolean) => {
    const next = new Set(selectedRef.current);
    for (let i = Math.min(from, to); i <= Math.max(from, to); i += 1) {
      const item = flatRef.current[i];
      if (!item) continue;
      if (value) next.add(item.key);
      else next.delete(item.key);
    }
    commitSelection(next);
  };

  const selectAt = (index: number, value: boolean, extend: boolean) => {
    const anchor = anchorRef.current;
    const anchorIndex =
      anchor === null ? -1 : flatRef.current.findIndex((item) => item.key === anchor);
    applyRange(extend && anchorIndex >= 0 ? anchorIndex : index, index, value);
    anchorRef.current = flatRef.current[index]?.key ?? null;
  };

  const handleSelectPointerDown = (index: number, event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || event.pointerType === "touch") return;
    // No native text selection and no focus jump while pressing / dragging; focus the box ourselves.
    event.preventDefault();
    // `focusVisible: false`: a pointer press shows no ring; Space continues from this box.
    event.currentTarget
      .querySelector("input")
      ?.focus({ preventScroll: true, focusVisible: false } as FocusOptions);
    pointerHandledRef.current = true;
    const key = flatRef.current[index]?.key;
    if (key === undefined) return;
    const value = !selectedRef.current.has(key);
    selectAt(index, value, event.shiftKey);

    let last = index;
    let dragActive = false;
    const onMove = (moveEvent: PointerEvent) => {
      const target = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY);
      const cell = target?.closest<HTMLElement>("[data-select-index]");
      if (!cell || !tableRef.current?.contains(cell)) return;
      const nextIndex = Number(cell.dataset.selectIndex);
      if (Number.isNaN(nextIndex) || nextIndex === last) return;
      if (!dragActive) {
        dragActive = true;
        setDragging(true);
      }
      applyRange(last, nextIndex, value);
      last = nextIndex;
      anchorRef.current = flatRef.current[nextIndex]?.key ?? anchorRef.current;
    };
    const stop = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      dragCleanupRef.current = null;
      setDragging(false);
    };
    dragCleanupRef.current?.();
    dragCleanupRef.current = stop;
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  };

  const handleSelectClickCapture = (event: React.MouseEvent<HTMLElement>) => {
    // Pointer clicks were applied on pointerdown (the native toggle lands on the same value), so the
    // change they cause is ignored; keyboard clicks (detail 0) go through.
    if (pointerHandledRef.current && event.detail > 0) {
      pointerHandledRef.current = false;
      ignoreChangeRef.current = true;
      window.setTimeout(() => {
        ignoreChangeRef.current = false;
      }, 0);
    }
  };

  const handleSelectAll = () => {
    const next = new Set(selectedRef.current);
    for (const key of allKeys) {
      if (allSelected) next.delete(key);
      else next.add(key);
    }
    commitSelection(next);
  };

  const toggleExpanded = (key: React.Key) => {
    const isOpen = expandedSet.has(key);
    setLastExpandedKey(isOpen ? null : key);
    setExpandedKeys(isOpen ? expandedKeys.filter((k) => k !== key) : [...expandedKeys, key]);
  };

  const baseId = React.useId();
  const rowDomId = (key: React.Key) => `${baseId}-row-${domIdPart(key)}`;
  const detailDomId = (key: React.Key) => `${baseId}-detail-${domIdPart(key)}`;
  const totalColumns = columns.length + (selectable ? 1 : 0) + (expandEnabled ? 1 : 0);

  const hasInternalMore = infinite && displayedRows.length < totalRows;
  const canRequestMore = infinite && Boolean(onLoadMore) && hasMore && !loadingMore;

  const reachEndRef = React.useRef(() => {});
  reachEndRef.current = () => {
    if (hasInternalMore) {
      setVisibleRowCount((prev) => Math.min(prev + Math.max(1, infiniteBatchSize), totalRows));
    } else if (canRequestMore) {
      void onLoadMore?.();
    }
  };

  // Re-observed whenever more rows can appear: a still-visible sentinel then reports again.
  // biome-ignore lint/correctness/useExhaustiveDependencies: the deps are the re-observe triggers.
  React.useEffect(() => {
    const root = scrollRef.current;
    const target = sentinelRef.current;
    if (!infinite || !root || !target) return;
    if (typeof IntersectionObserver === "undefined") {
      const onScroll = () => {
        if (root.scrollTop + root.clientHeight >= root.scrollHeight - 64) reachEndRef.current();
      };
      root.addEventListener("scroll", onScroll);
      return () => root.removeEventListener("scroll", onScroll);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) reachEndRef.current();
      },
      { root, rootMargin: DATA_TABLE_INFINITE_ROOT_MARGIN, threshold: 0.01 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [infinite, hasInternalMore, canRequestMore, totalRows]);

  const hasError = error != null && error !== false;
  const showSkeleton = !hasError && loading && displayedRows.length === 0;
  const showEmpty = !hasError && !loading && displayedRows.length === 0;
  /* «Показано 0–0 из 0» means nothing in loading / empty / error states: the body already says it,
     and «Показано 1–5 из 5» says nothing when every row is already on screen. */
  const showRange =
    !hasError && !showSkeleton && !showEmpty && (infinite || (paged && totalPages > 1));
  const showPagination = paged && totalPages > 1;
  const showInfiniteStatus =
    !hasError && infinite && (hasInternalMore || loadingMore || canRequestMore);
  const bodyRows = hasError ? [] : flatRows;
  const skeletonCount = Math.max(1, loadingRows ?? Math.min(safePageSize, SKELETON_ROWS));
  const maxHeight = scrollHeight ?? (infinite ? INFINITE_SCROLL_HEIGHT : undefined);

  useFrozenColumns(
    tableRef,
    rootRef,
    columns.map((column) => column.id).join("\u0000"),
    !hasError && !showSkeleton && displayedRows.length > 0,
  );

  const stickyLead = stickyFirstColumn && styles.stickyLead;
  const leadCells = (kind: "head" | "body" | "skeleton") => {
    const base = kind === "head" ? styles.headCell : styles.cell;
    const corner = kind === "head" && stickyHeader && stickyFirstColumn && styles.cornerCellSticky;
    return {
      select: cx(base, styles.selectCell, kind !== "skeleton" && stickyLead, corner),
      toggle: cx(base, styles.toggleCell, kind !== "skeleton" && stickyLead, corner),
    };
  };

  return (
    <ControlSizeProvider value={size}>
      <div
        ref={rootRef}
        className={cx(styles.root, className)}
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
          dragging: dragging || undefined,
        })}
      >
        {toolbar != null ? <div className={styles.toolbar}>{toolbar}</div> : null}

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
            onMouseLeave={highlightColumnOnHover ? () => setHoveredColumnId(null) : undefined}
          >
            <colgroup>
              {selectable ? <col /> : null}
              {expandEnabled ? <col /> : null}
              {columns.map((column) => (
                <col key={column.id} data-grow={column.grow ? "true" : undefined} />
              ))}
            </colgroup>
            {showHeader ? (
              <thead>
                <tr>
                  {selectable ? (
                    <th scope="col" className={leadCells("head").select}>
                      <Checkbox.Root
                        size={size}
                        checked={allSelected}
                        indeterminate={someSelected}
                        disabled={allKeys.length === 0}
                        onCheckedChange={handleSelectAll}
                        aria-label={labels.selectAll}
                      >
                        <Checkbox.Label />
                      </Checkbox.Root>
                    </th>
                  ) : null}
                  {expandEnabled ? <th scope="col" className={leadCells("head").toggle} /> : null}
                  {columns.map((column, columnIndex) => {
                    const order =
                      column.sortable && sortState?.columnId === column.id ? sortState.order : null;
                    const isFirstColumn = columnIndex === 0;
                    return (
                      <th
                        key={column.id}
                        scope="col"
                        className={cx(
                          styles.headCell,
                          stickyFirstColumn && isFirstColumn && styles.firstColumnSticky,
                          stickyHeader &&
                            stickyFirstColumn &&
                            isFirstColumn &&
                            styles.cornerCellSticky,
                        )}
                        style={columnSizeStyle(column)}
                        data-align={column.headerAlign ?? "start"}
                        data-sortable={column.sortable ? "true" : undefined}
                        data-sorted={order ? "true" : undefined}
                        aria-sort={
                          column.sortable ? (order ? ARIA_SORT[order] : "none") : undefined
                        }
                        data-first-column={isFirstColumn ? "true" : undefined}
                        data-column-id={column.id}
                        data-column-hovered={hoveredColumnId === column.id ? "true" : undefined}
                        onMouseEnter={() => hoverColumn(column.id)}
                        onClick={(event) => {
                          column.onHeaderClick?.(event);
                          if (!column.sortable) return;
                          setSortState(nextSort(sortState, column.id));
                          setPageState(1);
                        }}
                      >
                        {column.sortable ? (
                          // A full-cell button: the head cell draws its inset focus ring (see CSS).
                          <button type="button" className={styles.sortButton}>
                            <span className={styles.headLabel}>{column.header}</span>
                            <Icon
                              name={order ? SORT_ICON[order] : "sort.none"}
                              className={styles.sortIcon}
                              strokeWidth={2}
                            />
                          </button>
                        ) : (
                          <span className={styles.headLabel}>{column.header}</span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
            ) : null}

            <tbody>
              {hasError ? (
                <tr>
                  <td colSpan={totalColumns} className={cx(styles.stateCell, styles.stateError)}>
                    <div className={styles.stateContent} role="alert">
                      {error}
                    </div>
                  </td>
                </tr>
              ) : null}

              {showSkeleton
                ? Array.from({ length: skeletonCount }, (_, rowIndex) => (
                    <tr
                      // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder rows
                      key={rowIndex}
                      className={cx(styles.row, styles.skeletonRow)}
                      data-skeleton="true"
                    >
                      {selectable ? (
                        <td className={leadCells("skeleton").select}>
                          <span className={styles.skeleton} aria-hidden="true" />
                        </td>
                      ) : null}
                      {expandEnabled ? <td className={leadCells("skeleton").toggle} /> : null}
                      {columns.map((column) => (
                        <td
                          key={column.id}
                          className={styles.cell}
                          style={columnSizeStyle(column)}
                          data-align={columnAlign(column)}
                        >
                          <span className={styles.skeleton} aria-hidden="true" />
                        </td>
                      ))}
                    </tr>
                  ))
                : null}

              {showEmpty ? (
                <tr>
                  <td colSpan={totalColumns} className={styles.stateCell}>
                    {empty == null || typeof empty === "string" ? (
                      <EmptyPage.Root layout="compact" size={size} role="status">
                        <EmptyPage.Description>{empty ?? labels.empty}</EmptyPage.Description>
                      </EmptyPage.Root>
                    ) : (
                      <div className={styles.stateContent}>{empty}</div>
                    )}
                  </td>
                </tr>
              ) : null}

              {bodyRows.map((item, index) => {
                const { row, key, depth } = item;
                const isSelected = selectable && selectedSet.has(key);
                const rowLabel = getRowLabel?.(row);
                const detail = item.expanded && renderExpanded ? renderExpanded(row) : null;
                const hasDetail = detail != null && detail !== false;
                const controls = [
                  ...(hasDetail ? [detailDomId(key)] : []),
                  ...(item.expanded ? item.childKeys.map(rowDomId) : []),
                ].join(" ");
                const enter = item.animate && enterMotion.enterBase;
                // One keyed fragment either way, so opening the detail never remounts the row
                // (the toggle keeps focus).
                return (
                  <React.Fragment key={String(key)}>
                    <tr
                      id={rowDomId(key)}
                      className={styles.row}
                      style={
                        depth > 0 ? ({ "--dt-depth": depth } as React.CSSProperties) : undefined
                      }
                      data-stripe={striped && index % 2 === 1 ? "alt" : undefined}
                      data-clickable={onRowClick ? "true" : undefined}
                      data-depth={depth > 0 ? depth : undefined}
                      data-expanded={item.expanded ? "true" : undefined}
                      data-animate={item.animate ? "true" : undefined}
                      aria-selected={selectable ? isSelected : undefined}
                      onClick={(event) => onRowClick?.(row, index, event)}
                    >
                      {selectable ? (
                        <td
                          className={cx(leadCells("body").select, enter)}
                          data-select-index={index}
                          onPointerDown={(event) => handleSelectPointerDown(index, event)}
                          onClickCapture={handleSelectClickCapture}
                          onClick={(event) => event.stopPropagation()}
                          onKeyDown={(event) => {
                            shiftKeyRef.current = event.shiftKey;
                          }}
                        >
                          <Checkbox.Root
                            size={size}
                            checked={isSelected}
                            onCheckedChange={(value) => {
                              if (ignoreChangeRef.current) return;
                              selectAt(index, value, shiftKeyRef.current);
                              shiftKeyRef.current = false;
                            }}
                            aria-label={fill(labels.selectRow, { label: rowLabel })}
                          >
                            <Checkbox.Label />
                          </Checkbox.Root>
                        </td>
                      ) : null}
                      {expandEnabled ? (
                        <td className={cx(leadCells("body").toggle, enter)}>
                          {item.expandable ? (
                            <Button.Root
                              variant="ghost"
                              tone="neutral"
                              size={TOGGLE_SIZE[size]}
                              aria-expanded={item.expanded}
                              aria-controls={controls || undefined}
                              aria-label={fill(item.expanded ? labels.collapse : labels.expand, {
                                label: rowLabel,
                              })}
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleExpanded(key);
                              }}
                            >
                              <Button.Icon>
                                <Icon name="nav.chevronRight" className={styles.chevron} />
                              </Button.Icon>
                            </Button.Root>
                          ) : null}
                        </td>
                      ) : null}
                      {columns.map((column, columnIndex) => {
                        const isFirstColumn = columnIndex === 0;
                        const clickable = Boolean(column.onCellClick);
                        return (
                          <td
                            key={column.id}
                            className={cx(
                              styles.cell,
                              stickyFirstColumn && isFirstColumn && styles.firstColumnSticky,
                              enter,
                            )}
                            style={columnSizeStyle(column)}
                            data-align={columnAlign(column)}
                            data-numeric={column.numeric ? "true" : undefined}
                            data-first-column={isFirstColumn ? "true" : undefined}
                            data-column-id={column.id}
                            data-column-hovered={hoveredColumnId === column.id ? "true" : undefined}
                            onMouseEnter={() => hoverColumn(column.id)}
                            onClick={(event) => column.onCellClick?.(row, event)}
                            role={clickable ? "button" : undefined}
                            tabIndex={clickable ? 0 : undefined}
                            onKeyDown={
                              clickable
                                ? (event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                      event.preventDefault();
                                      column.onCellClick?.(row, event);
                                    }
                                  }
                                : undefined
                            }
                          >
                            {renderCell(row, column, true)}
                          </td>
                        );
                      })}
                    </tr>
                    {hasDetail ? (
                      <tr
                        id={detailDomId(key)}
                        className={styles.detailRow}
                        data-animate={lastExpandedKey === key || item.animate ? "true" : undefined}
                      >
                        <td colSpan={totalColumns} className={styles.detailCell}>
                          <div className={styles.detailMotion}>
                            <div className={styles.detailContent}>{detail}</div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </tbody>

            {measureRows.length > 0 && !hasError ? (
              <tbody className={styles.measureBody} aria-hidden="true" inert>
                {measureRows.map(({ row, key, depth }) => (
                  <tr
                    key={String(key)}
                    className={styles.row}
                    style={{ "--dt-depth": depth } as React.CSSProperties}
                    data-depth={depth}
                  >
                    {selectable ? <td className={cx(styles.cell, styles.selectCell)} /> : null}
                    {expandEnabled ? <td className={cx(styles.cell, styles.toggleCell)} /> : null}
                    {columns.map((column, columnIndex) => (
                      <td
                        key={column.id}
                        className={styles.cell}
                        style={columnSizeStyle(column)}
                        data-align={columnAlign(column)}
                        data-numeric={column.numeric ? "true" : undefined}
                        data-first-column={columnIndex === 0 ? "true" : undefined}
                      >
                        {renderCell(row, column, false)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ) : null}
          </table>

          {infinite ? (
            <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
          ) : null}
        </ScrollContainer>

        {showSkeleton ? <VisuallyHidden role="status">{labels.loading}</VisuallyHidden> : null}

        {selectable ? (
          <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">
            {announcement}
          </VisuallyHidden>
        ) : null}

        {showRange || showPagination || showInfiniteStatus ? (
          <div className={styles.footer}>
            {showRange ? (
              <p className={styles.meta}>
                {fill(labels.range, {
                  from: totalRows === 0 ? 0 : pageOffset + 1,
                  to: pageOffset + displayedRows.length,
                  total: totalRows,
                })}
              </p>
            ) : null}

            {showPagination ? (
              <Pagination
                className={styles.pagination}
                value={safePage}
                totalPages={totalPages}
                onValueChange={setPageState}
                size={size}
                compact="auto"
              />
            ) : null}

            {showInfiniteStatus ? (
              <p className={styles.meta} aria-live="polite">
                {loadingMore ? labels.loadingMore : labels.scrollForMore}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </ControlSizeProvider>
  );
}
