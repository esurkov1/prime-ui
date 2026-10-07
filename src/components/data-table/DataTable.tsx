import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/button/Button";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { useControllableState } from "@/hooks/useControllableState";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { DATA_TABLE_INFINITE_ROOT_MARGIN } from "@/internal/runtimeUnits";
import type { ControlSize } from "@/internal/states";

import { Pagination } from "../pagination/Pagination";
import styles from "./DataTable.module.css";

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
  width?: string;
  minWidth?: string;
  /** Ограничение ширины колонки (например `12rem` или `min(100%, 20rem)`). */
  maxWidth?: string;
  /**
   * Числовая колонка: `tabular-nums`, выравнивание по умолчанию `end` (явный `align` важнее).
   */
  numeric?: boolean;
  /**
   * Длинный текст в одну строку с многоточием. Ширину ограничивает `maxWidth` (или `width`);
   * для строковых значений полный текст попадает в `title`.
   */
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

export type DataTableLabels = {
  /** Screen-reader announcement while skeleton rows are shown. */
  loading: string;
  /** Default empty-state text (when `empty` is not set). */
  empty: string;
  /** Footer range line. */
  range: (from: number, to: number, total: number) => string;
  /** Footer status while `loadingMore`. */
  loadingMore: string;
  /** Footer hint when more rows can be revealed or loaded by scrolling. */
  scrollForMore: string;
  /** `aria-label` of the header «select all» checkbox. */
  selectAll: string;
  /** `aria-label` of a row checkbox; `label` comes from `getRowLabel`. */
  selectRow: (label?: string) => string;
  /** Screen-reader announcement after the selection changes. */
  selectedCount: (count: number) => string;
  /** `aria-label` of the expand toggle of a collapsed row. */
  expand: (label?: string) => string;
  /** `aria-label` of the expand toggle of an expanded row. */
  collapse: (label?: string) => string;
};

const DEFAULT_LABELS: DataTableLabels = {
  loading: "Загрузка данных…",
  empty: "Нет данных для отображения.",
  range: (from, to, total) => `Показано ${from}–${to} из ${total}`,
  loadingMore: "Догружаем строки…",
  scrollForMore: "Прокрутите вниз для загрузки",
  selectAll: "Выбрать все строки",
  selectRow: (label) => (label ? `Выбрать: ${label}` : "Выбрать строку"),
  selectedCount: (count) => `Выбрано: ${count}`,
  expand: (label) => (label ? `Развернуть: ${label}` : "Развернуть строку"),
  collapse: (label) => (label ? `Свернуть: ${label}` : "Свернуть строку"),
};

export type DataTableRootProps<Row> = {
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
  /** Built-in strings (Russian defaults). */
  labels?: Partial<DataTableLabels>;
  /** Row divider line. Default `standard` (hairline). */
  dividerStyle?: "standard" | "dashed" | "dotted" | "none";
  sort?: DataTableSortState;
  defaultSort?: DataTableSortState;
  onSortChange?: (sort: DataTableSortState) => void;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  showPagination?: boolean;
  siblingCount?: number;
  paginationSize?: ControlSize;
  infiniteScroll?: boolean;
  initialVisibleRows?: number;
  infiniteBatchSize?: number;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void | Promise<void>;
  /**
   * Максимальная высота области прокрутки (число — px). При `infiniteScroll` по умолчанию 360.
   * Без `infiniteScroll` задаётся только явно: обычная таблица с ограниченной высотой и
   * прокруткой тела (вместе со `stickyHeader` шапка остаётся видимой).
   */
  scrollHeight?: number | string;
  /**
   * Растянуть `<table>` на 100% ширины контейнера. Лишняя ширина распределяется движком таблицы
   * (`table-layout: auto`) по правилам браузера — с опорой на содержимое и `width` / `minWidth` / `maxWidth` колонок.
   * При `false` ширина таблицы по содержимому (`width: max-content`).
   */
  fillWidth?: boolean;
  /** Подсветка строки при наведении (полупрозрачная смесь с фоном строки). */
  highlightRowOnHover?: boolean;
  /** Подсветка колонки под курсором (шапка + ячейки). */
  highlightColumnOnHover?: boolean;
  /** Чередование фона строк (зебра). */
  striped?: boolean;
  /** Vertical hairlines between content columns (default `true`); `false` keeps only row separators. */
  columnDividers?: boolean;
  /**
   * Built-in row selection: a leading checkbox column, header «select all» (indeterminate when
   * partial), Shift+click range, press-and-drag across checkboxes, Space on a focused checkbox,
   * `aria-selected` + `accent-soft` rows and a polite «Выбрано: N» announcement.
   */
  selectable?: boolean;
  /** Selected row ids (controlled). */
  selected?: React.Key[];
  /** Initially selected row ids (uncontrolled). */
  defaultSelected?: React.Key[];
  onSelectedChange?: (selected: React.Key[]) => void;
  /** Tree sub-rows: rendered under the parent with the same columns, indented by depth. */
  getRowChildren?: (row: Row) => Row[] | undefined;
  /** Detail panel rendered in a full-width row under an expanded row. */
  renderExpanded?: (row: Row) => React.ReactNode;
  /**
   * Whether a row gets an expand toggle. Default: it has sub-rows, or `renderExpanded` is set.
   */
  isRowExpandable?: (row: Row) => boolean;
  /** Expanded row ids (controlled). */
  expanded?: React.Key[];
  /** Initially expanded row ids (uncontrolled). */
  defaultExpanded?: React.Key[];
  onExpandedChange?: (expanded: React.Key[]) => void;
  /** Ошибка загрузки: заменяет тело таблицы сообщением с `role="alert"`. */
  error?: React.ReactNode;
  /** Количество строк-скелетонов при `loading` без данных. По умолчанию `min(pageSize, 5)`. */
  loadingRows?: number;
  /** Панель над таблицей (поиск, фильтры, действия). Переносится на узкой ширине. */
  toolbar?: React.ReactNode;
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

function columnAlign<Row>(column: DataTableColumn<Row>): CellAlign {
  if (column.align) return column.align;
  return column.numeric ? "end" : "start";
}

function ariaSortValue(indicator: string): "ascending" | "descending" | "none" {
  if (indicator === "asc") return "ascending";
  if (indicator === "desc") return "descending";
  return "none";
}

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

function sortRowList<Row>(list: Row[], column: DataTableColumn<Row>, order: DataTableOrder): Row[] {
  const direction = order === "asc" ? 1 : -1;
  return list
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const compared = column.sortComparator
        ? column.sortComparator(a.row, b.row, order)
        : comparePrimitive(getColumnValue(a.row, column), getColumnValue(b.row, column));
      if (compared === 0) return a.index - b.index;
      return compared * direction;
    })
    .map((item) => item.row);
}

function domIdPart(key: React.Key): string {
  return String(key).replace(/[^A-Za-z0-9_-]/g, "_");
}

const SKELETON_DEFAULT_ROWS = 5;
const DEFAULT_INFINITE_SCROLL_HEIGHT = 360;

function columnSizeStyle<Row>(column: DataTableColumn<Row>): React.CSSProperties | undefined {
  const { width, minWidth, maxWidth, grow } = column;
  if (!width && !minWidth && !maxWidth && !grow) return undefined;
  return { width: width ?? (grow ? "100%" : undefined), minWidth, maxWidth };
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
  empty,
  labels: labelsProp,
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
  scrollHeight,
  fillWidth = true,
  highlightRowOnHover = true,
  highlightColumnOnHover = false,
  striped = false,
  columnDividers = true,
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
}: DataTableRootProps<Row>) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
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

    const maxHeight = scrollHeight ?? (infiniteScroll ? DEFAULT_INFINITE_SCROLL_HEIGHT : undefined);
    viewport.style.maxHeight =
      maxHeight === undefined ? "" : typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
  }, [infiniteScroll, scrollHeight]);

  const sortableColumns = React.useMemo(
    () => new Set(columns.filter((c) => c.sortable).map((c) => c.id)),
    [columns],
  );

  const sortColumn = React.useMemo(() => {
    if (!sortState || !sortableColumns.has(sortState.columnId)) return null;
    return columns.find((item) => item.id === sortState.columnId) ?? null;
  }, [columns, sortState, sortableColumns]);

  /** Sub-rows of a row, sorted like the top level. */
  const childrenOf = React.useCallback(
    (row: Row): Row[] => {
      const list = getRowChildren?.(row) ?? [];
      if (!sortColumn || !sortState || list.length < 2) return list;
      return sortRowList(list, sortColumn, sortState.order);
    },
    [getRowChildren, sortColumn, sortState],
  );

  const sortedRows = React.useMemo(() => {
    if (!sortColumn || !sortState) return rows;
    return sortRowList(rows, sortColumn, sortState.order);
  }, [rows, sortColumn, sortState]);

  const keyOf = React.useCallback(
    (row: Row, index: number, parentKey: React.Key | null): React.Key => {
      if (getRowKey) return getRowKey(row, index);
      return parentKey === null ? index : `${String(parentKey)}.${index}`;
    },
    [getRowKey],
  );

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
  const addedKeys = rowArrival.added;

  const expandEnabled = Boolean(getRowChildren || renderExpanded);
  const [expandedKeys, setExpandedKeys] = useControllableState<React.Key[]>({
    value: expanded,
    defaultValue: defaultExpanded,
    onChange: onExpandedChange,
  });
  const expandedSet = React.useMemo(() => new Set(expandedKeys), [expandedKeys]);
  /** Row whose latest expand mounted new rows: only those animate in. */
  const [lastExpandedKey, setLastExpandedKey] = React.useState<React.Key | null>(null);

  const [selectedKeys, setSelectedKeys] = useControllableState<React.Key[]>({
    value: selected,
    defaultValue: defaultSelected,
    onChange: onSelectedChange,
  });
  const selectedSet = React.useMemo(() => new Set(selectedKeys), [selectedKeys]);

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

  /** Rendered rows in order: page rows plus the sub-rows of expanded rows. */
  const flatRows = React.useMemo(() => {
    const out: FlatRow<Row>[] = [];
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
        const childKeys = children.map((child, ci) => keyOf(child, ci, key));
        const expandable = expandEnabled
          ? (isRowExpandable?.(row) ?? (children.length > 0 || Boolean(renderExpanded)))
          : false;
        const isExpanded = expandable && expandedSet.has(key);
        out.push({
          row,
          key,
          depth,
          childKeys,
          expandable,
          expanded: isExpanded,
          animate: parentAnimate || (depth === 0 && addedKeys.has(key)),
        });
        if (isExpanded && children.length > 0) {
          visit(children, depth + 1, key, parentAnimate || lastExpandedKey === key, 0);
        }
      });
    };
    const pageOffset = infiniteScroll ? 0 : (safePage - 1) * safePageSize;
    visit(displayedRows, 0, null, false, pageOffset);
    return out;
  }, [
    addedKeys,
    childrenOf,
    displayedRows,
    expandEnabled,
    expandedSet,
    infiniteScroll,
    isRowExpandable,
    keyOf,
    lastExpandedKey,
    renderExpanded,
    safePage,
    safePageSize,
  ]);

  /** Every row id in the data (all pages, all depths): the scope of «select all». */
  const allKeys = React.useMemo(() => {
    if (!selectable) return EMPTY_KEYS;
    const out: React.Key[] = [];
    const visit = (list: Row[], parentKey: React.Key | null) => {
      list.forEach((row, i) => {
        const key = keyOf(row, i, parentKey);
        out.push(key);
        const children = getRowChildren?.(row);
        if (children?.length) visit(children, key);
      });
    };
    visit(sortedRows, null);
    return out;
  }, [getRowChildren, keyOf, selectable, sortedRows]);

  const selectedInData = selectable ? allKeys.filter((key) => selectedSet.has(key)).length : 0;
  const allSelected = selectable && allKeys.length > 0 && selectedInData === allKeys.length;
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
  const tableRef = React.useRef<HTMLTableElement | null>(null);

  React.useEffect(() => () => dragCleanupRef.current?.(), []);

  const selectedCountLabel = labels.selectedCount;
  const commitSelection = React.useCallback(
    (next: Set<React.Key>) => {
      selectedRef.current = next;
      setSelectedKeys(Array.from(next));
      setAnnouncement(selectedCountLabel(next.size));
    },
    [selectedCountLabel, setSelectedKeys],
  );

  /** Sets every rendered row between two visible indices (inclusive) to `value`. */
  const applyRange = React.useCallback(
    (from: number, to: number, value: boolean) => {
      const list = flatRef.current;
      const next = new Set(selectedRef.current);
      for (let i = Math.min(from, to); i <= Math.max(from, to); i += 1) {
        const item = list[i];
        if (!item) continue;
        if (value) next.add(item.key);
        else next.delete(item.key);
      }
      commitSelection(next);
    },
    [commitSelection],
  );

  const indexOfKey = (key: React.Key | null) =>
    key === null ? -1 : flatRef.current.findIndex((item) => item.key === key);

  const selectAt = (index: number, value: boolean, extend: boolean) => {
    const anchorIndex = indexOfKey(anchorRef.current);
    if (extend && anchorIndex >= 0) applyRange(anchorIndex, index, value);
    else applyRange(index, index, value);
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
    if (allSelected) for (const key of allKeys) next.delete(key);
    else for (const key of allKeys) next.add(key);
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
  const leadCount = (selectable ? 1 : 0) + (expandEnabled ? 1 : 0);
  const totalColumns = columns.length + leadCount;

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

  const hasError = error != null && error !== false;
  const showSkeleton = !hasError && loading && displayedRows.length === 0;
  const showEmpty = !hasError && !loading && displayedRows.length === 0;
  /* «Показано 0–0 из 0» means nothing in loading / empty / error states: the body already says it,
     and «Показано 1–5 из 5» says nothing when every row is already on screen. */
  const showRangeMeta =
    !hasError && !showSkeleton && !showEmpty && totalRows > 0 && (infiniteScroll || totalPages > 1);
  const showPaginationControl = !infiniteScroll && showPagination && totalPages > 1;
  const showInfiniteMeta =
    !hasError && infiniteScroll && (hasInternalMore || loadingMore || canRequestMore);
  const showFooter = showRangeMeta || showPaginationControl || showInfiniteMeta;
  const bodyRows = hasError ? [] : flatRows;
  const skeletonCount = Math.max(1, loadingRows ?? Math.min(safePageSize, SKELETON_DEFAULT_ROWS));

  return (
    <ControlSizeProvider value={size}>
      <div
        className={cx(styles.root, className)}
        {...toDataAttributes({
          size,
          divider: dividerStyle,
          "column-dividers": columnDividers ? undefined : "false",
          "show-header": showHeader,
          "sticky-header": stickyHeader,
          "sticky-first-column": stickyFirstColumn,
          "table-width": columns.some((c) => c.grow) ? "grow" : fillWidth ? "fill" : "auto",
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
          overscrollBehavior="auto"
          className={styles.viewport}
        >
          <table
            ref={tableRef}
            className={styles.table}
            aria-busy={loading || loadingMore ? true : undefined}
            onMouseLeave={highlightColumnOnHover ? clearHoveredColumn : undefined}
          >
            {showHeader ? (
              <thead className={styles.head}>
                <tr className={styles.headRow}>
                  {selectable ? (
                    <th
                      scope="col"
                      className={cx(
                        styles.headCell,
                        styles.selectCell,
                        stickyFirstColumn && styles.stickyLead,
                        stickyFirstColumn && stickyHeader && styles.cornerCellSticky,
                      )}
                    >
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
                  {expandEnabled ? (
                    <th
                      scope="col"
                      className={cx(
                        styles.headCell,
                        styles.toggleCell,
                        stickyFirstColumn && styles.stickyLead,
                        stickyFirstColumn && stickyHeader && styles.cornerCellSticky,
                      )}
                    />
                  ) : null}
                  {columns.map((column, columnIndex) => {
                    const align = columnAlign(column);
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
                        style={columnSizeStyle(column)}
                        data-align={align}
                        data-sortable={isSortable ? "true" : undefined}
                        data-sorted={isSortable && indicator !== "none" ? "true" : undefined}
                        aria-sort={isSortable ? ariaSortValue(indicator) : undefined}
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
                        {isSortable ? (
                          <button type="button" className={styles.sortButton}>
                            <span className={styles.headLabel}>{column.header}</span>
                            <span className={styles.sortIcon} aria-hidden="true">
                              {indicator === "asc" ? (
                                <ArrowUp className={styles.sortGlyph} strokeWidth={2} />
                              ) : indicator === "desc" ? (
                                <ArrowDown className={styles.sortGlyph} strokeWidth={2} />
                              ) : (
                                <ArrowUpDown className={styles.sortGlyph} strokeWidth={2} />
                              )}
                            </span>
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

            <tbody className={styles.body}>
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
                      key={`skeleton-${rowIndex}`}
                      className={cx(styles.row, styles.skeletonRow)}
                      data-skeleton="true"
                    >
                      {selectable ? (
                        <td className={cx(styles.cell, styles.selectCell)}>
                          <span className={styles.skeleton} aria-hidden="true" />
                        </td>
                      ) : null}
                      {expandEnabled ? <td className={cx(styles.cell, styles.toggleCell)} /> : null}
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
                    <div className={styles.stateContent}>{empty ?? labels.empty}</div>
                  </td>
                </tr>
              ) : null}

              {bodyRows.map((item, index) => {
                const { row, key, depth } = item;
                const isSelected = selectable && selectedSet.has(key);
                const rowLabel = getRowLabel?.(row);
                const detail = item.expanded && renderExpanded ? renderExpanded(row) : null;
                const hasDetail = detail !== null && detail !== undefined && detail !== false;
                const controls = [
                  ...(hasDetail ? [detailDomId(key)] : []),
                  ...(item.expanded ? item.childKeys.map(rowDomId) : []),
                ].join(" ");
                const tr = (
                  <tr
                    id={rowDomId(key)}
                    className={styles.row}
                    style={depth > 0 ? ({ "--dt-depth": depth } as React.CSSProperties) : undefined}
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
                        className={cx(
                          styles.cell,
                          styles.selectCell,
                          stickyFirstColumn && styles.stickyLead,
                        )}
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
                          aria-label={labels.selectRow(rowLabel)}
                        >
                          <Checkbox.Label />
                        </Checkbox.Root>
                      </td>
                    ) : null}
                    {expandEnabled ? (
                      <td
                        className={cx(
                          styles.cell,
                          styles.toggleCell,
                          stickyFirstColumn && styles.stickyLead,
                        )}
                      >
                        {item.expandable ? (
                          <Button.Root
                            variant="ghost"
                            tone="neutral"
                            size={TOGGLE_SIZE[size]}
                            className={styles.toggle}
                            aria-expanded={item.expanded}
                            aria-controls={controls || undefined}
                            aria-label={
                              item.expanded ? labels.collapse(rowLabel) : labels.expand(rowLabel)
                            }
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleExpanded(key);
                            }}
                          >
                            <Button.Icon>
                              <ChevronRight className={styles.chevron} strokeWidth={2} />
                            </Button.Icon>
                          </Button.Root>
                        ) : null}
                      </td>
                    ) : null}
                    {columns.map((column, columnIndex) => {
                      const isFirstColumn = columnIndex === 0;
                      const isCellClickable = Boolean(column.onCellClick);
                      const content = renderColumnCell(row, column);
                      return (
                        <td
                          key={column.id}
                          className={cx(
                            styles.cell,
                            stickyFirstColumn && isFirstColumn && styles.firstColumnSticky,
                          )}
                          style={columnSizeStyle(column)}
                          data-align={columnAlign(column)}
                          data-numeric={column.numeric ? "true" : undefined}
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
                          {column.truncate ? (
                            <span
                              className={styles.truncate}
                              style={{ maxWidth: column.maxWidth ?? column.width }}
                              title={
                                typeof content === "string" || typeof content === "number"
                                  ? String(content)
                                  : undefined
                              }
                            >
                              {content}
                            </span>
                          ) : (
                            content
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
                // One keyed fragment either way, so opening the detail never remounts the row
                // (the toggle keeps focus).
                return (
                  <React.Fragment key={String(key)}>
                    {tr}
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
          </table>

          {infiniteScroll ? (
            <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
          ) : null}
        </ScrollContainer>

        {showSkeleton ? (
          <span className={styles.srOnly} role="status">
            {labels.loading}
          </span>
        ) : null}

        {selectable ? (
          <span className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">
            {announcement}
          </span>
        ) : null}

        {showFooter ? (
          <div className={styles.footer}>
            {showRangeMeta ? (
              <p className={styles.meta}>{labels.range(fromRow, toRow, totalRows)}</p>
            ) : null}

            {showPaginationControl ? (
              <Pagination.Root
                className={styles.pagination}
                value={safePage}
                totalPages={totalPages}
                onValueChange={setPageState}
                siblingCount={siblingCount}
                size={paginationSize ?? size}
                compact="auto"
              />
            ) : null}

            {showInfiniteMeta ? (
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

DataTableRoot.displayName = "DataTableRoot";

export const DataTable = {
  Root: DataTableRoot,
};
