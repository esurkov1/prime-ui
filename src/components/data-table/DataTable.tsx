import * as React from "react";

import { moveBefore } from "@/components/dnd/Dnd";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { useControllableState } from "@/hooks/useControllableState";
import { useEdgeOverflow } from "@/hooks/useEdgeOverflow";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { readCssLengthPx } from "@/hooks/usePosition";
import { rowGaps, useVirtualRows } from "@/hooks/useVirtualRows";
import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import { fieldTierClass } from "@/internal/fieldClasses";
import { formatLabel } from "@/internal/formatLabel";
import { useLabels } from "@/internal/labels";
import { exitTimeoutMs } from "@/internal/motionTiming";
import { usePartPresence } from "@/internal/partPresence";
import { useSwapIn } from "@/internal/RegionSwap";
import { type ControlSize, compactTier, stepDown } from "@/internal/states";
import { SurfaceDepthProvider, useNestedSurfaceDepth } from "@/internal/surfaceDepth";
import { ToolCell, ToolChips, ToolRow } from "@/internal/ToolRow";
import { useFlipList } from "@/internal/useFlipList";
import { sameIds } from "@/internal/ViewMenu";
import { ColumnsMenu, type ColumnsMenuReorder, lockedInChooser } from "./ColumnsMenu";
import { orderColumns, placeColumn } from "./columnOrder";
import styles from "./DataTable.module.css";
import { Footer } from "./Footer";
import { Head, type HeadColumnReorder } from "./Head";
import { DataTableRow, GroupRow, MeasureBody, type RowShared } from "./Row";
import { ReorderBody, ReorderRoot, useRowReorder } from "./reorder";
import { type FlatRow, flatten, groupRows, nextSort, scaleDomains, sortRows } from "./rows";
import { SelectionMenu } from "./SelectionMenu";
import { StateRows } from "./StateRows";
import { rowsChange } from "./serverMode";
import type {
  DataTableColumn,
  DataTableGroup,
  DataTableRowClickEvent,
  DataTableSortState,
} from "./types";
import { useColumnHover } from "./useColumnHover";
import { useFrozenColumns } from "./useFrozenColumns";
import { useInfiniteRows } from "./useInfiniteRows";
import { useRowSelection } from "./useRowSelection";

export type {
  DataTableColumn,
  DataTableGroup,
  DataTableOrder,
  DataTableRowClickEvent,
  DataTableSortState,
} from "./types";

/** System strings; `{from}`, `{to}`, `{total}`, `{label}`, `{count}`, `{group}` are replaced. */
export type DataTableLabels = {
  /** Screen-reader announcement while skeleton rows are shown. */
  loading: string;
  /** Default empty-state text (when `empty` is not set). */
  empty: string;
  /** Footer range line (`showRange`). */
  range: string;
  /** Footer status while more rows load. */
  loadingMore: string;
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
  /** Text of the menu button of the actions on the selected rows (`renderSelectionActions`). */
  selectionActions: string;
  /** The first item of the selection actions menu: clears the selection. */
  clearSelection: string;
  /** Name and tooltip of the column chooser (`columnsMenu`); `{shown}` and `{total}` are counts. */
  columns: string;
  /** The heading of the column chooser's list of columns. */
  showColumns: string;
  /** The column chooser item that puts the default hidden columns and the order of `columns` back. */
  resetColumns: string;
  /** `aria-label` of a column's grip in the column chooser (`columnOrder`); `{label}` is its header. */
  reorderColumn: string;
  /** `aria-label` of a row's drag handle (`onReorder`); `{label}` is `getRowLabel(row)`. */
  reorderRow: string;
  /** Tooltip of the handles while the table is sorted by a column (reordering is off). */
  reorderSorted: string;
  /** `aria-label` of the toggle of a collapsed group; `{group}` is the group key. */
  expandGroup: string;
  /** `aria-label` of the toggle of an expanded group; `{group}` is the group key. */
  collapseGroup: string;
  /** Name of the info glyph of a column with a `description` (the tooltip holds the text). */
  columnInfo: string;
};

export const DATA_TABLE_LABELS: DataTableLabels = {
  loading: "Загрузка данных…",
  empty: "Нет данных для отображения.",
  range: "Показано {from}–{to} из {total}",
  loadingMore: "Догружаем строки…",
  selectAll: "Выбрать все строки",
  selectRow: "Выбрать строку {label}",
  selectedCount: "Выбрано: {count}",
  selectionActions: "Действия",
  clearSelection: "Снять выбор",
  expand: "Развернуть строку {label}",
  collapse: "Свернуть строку {label}",
  columns: "Колонки",
  showColumns: "В таблице",
  resetColumns: "По умолчанию",
  reorderColumn: "Переместить колонку {label}",
  reorderRow: "Переместить строку {label}",
  reorderSorted: "Порядок задан сортировкой. Сбросьте её, чтобы перемещать строки",
  expandGroup: "Развернуть группу {group}",
  collapseGroup: "Свернуть группу {group}",
  columnInfo: "Пояснение",
};

export type DataTableProps<Row> = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** The outer card-fill `<div>`. */
  ref?: React.Ref<HTMLDivElement>;
  columns: DataTableColumn<Row>[];
  hiddenColumns?: string[];
  defaultHiddenColumns?: string[];
  onHiddenColumnsChange?: (hiddenColumns: string[]) => void;
  columnOrder?: string[];
  defaultColumnOrder?: string[];
  onColumnOrderChange?: (columnOrder: string[]) => void;
  columnsMenu?: boolean;
  rows: Row[];
  source?: "client" | "server";
  rowCount?: number;
  size?: ControlSize;
  className?: string;
  showHeader?: boolean;
  stickyHeader?: boolean;
  stickyFirstColumn?: boolean;
  stickyLastColumn?: boolean;
  getRowKey?: (row: Row, index: number) => React.Key;
  getRowLabel?: (row: Row) => string;
  getRowHref?: (row: Row) => string;
  onRowClick?: (row: Row, index: number, event: DataTableRowClickEvent) => void;
  isRowClickable?: (row: Row) => boolean;
  loading?: boolean;
  empty?: React.ReactNode;
  labels?: Partial<DataTableLabels>;
  rowDividers?: boolean;
  columnDividers?: boolean;
  sort?: DataTableSortState;
  defaultSort?: DataTableSortState;
  onSortChange?: (sort: DataTableSortState) => void;
  paging?: "pages" | "infinite" | "none";
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  showRange?: boolean;
  pageSize?: number;
  infiniteBatchSize?: number;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void | Promise<void>;
  scrollHeight?: number | string;
  fullWidth?: boolean;
  highlightRowOnHover?: boolean;
  highlightColumnOnHover?: boolean;
  striped?: boolean;
  selectable?: boolean;
  selected?: React.Key[];
  defaultSelected?: React.Key[];
  onSelectedChange?: (selected: React.Key[]) => void;
  onReorder?: (id: React.Key, beforeId: React.Key | null) => void | Promise<void>;
  reorderHandle?: "start" | "end" | "row";
  getRowChildren?: (row: Row) => Row[] | undefined;
  renderExpanded?: (row: Row) => React.ReactNode;
  isRowExpandable?: (row: Row) => boolean;
  expanded?: React.Key[];
  defaultExpanded?: React.Key[];
  onExpandedChange?: (expanded: React.Key[]) => void;
  loadError?: React.ReactNode;
  loadingRows?: number;
  toolbar?: React.ReactNode;
  toolbarChips?: React.ReactNode;
  renderSelectionActions?: (selected: React.Key[]) => React.ReactNode;
  getRowGroup?: (row: Row) => string | number;
  renderGroupHeader?: (group: DataTableGroup<Row>) => React.ReactNode;
  stickyGroupHeaders?: boolean;
  collapsedGroups?: (string | number)[];
  defaultCollapsedGroups?: (string | number)[];
  onCollapsedGroupsChange?: (collapsedGroups: (string | number)[]) => void;
};

const EMPTY_KEYS: React.Key[] = [];
const EMPTY_IDS: string[] = [];
const EMPTY_GROUPS: (string | number)[] = [];
const NO_GROUPS: ReadonlySet<string | number> = new Set();
const SKELETON_ROWS = 5;
const NO_KEYS: ReadonlySet<React.Key> = new Set();
const INFINITE_SCROLL_HEIGHT = 360;
/** Rows above which a body in a bounded viewport renders only the rows around the view. */
const VIRTUAL_FROM = 100;
/** Rows share one measured height until each is measured itself. */
const ONE_GROUP = () => 0;

const domIdPart = (key: React.Key) => String(key).replace(/[^A-Za-z0-9_-]/g, "_");

/** The head cells of the columns: they glide when the order changes from outside the head row. */
const headCells = (table: HTMLElement) =>
  table.querySelectorAll<HTMLElement>(":scope > thead > tr > [data-column-id]");
const columnCellKey = (cell: HTMLElement) => cell.dataset.columnId;

/**
 * The columns that changed places between two orders of the same columns: the one that moved (a
 * drop, a key, the chooser), or every one off its place (several moved at once, a reset).
 */
function movedColumns(before: readonly string[], after: readonly string[]): string[] {
  if (before.length !== after.length || before.join("\u0000") === after.join("\u0000")) return [];
  const set = new Set(before);
  if (after.some((id) => !set.has(id))) return [];
  const single = after.find((id) => {
    const rest = (list: readonly string[]) => list.filter((each) => each !== id).join("\u0000");
    return rest(before) === rest(after);
  });
  return single !== undefined ? [single] : after.filter((id, index) => before[index] !== id);
}

/**
 * `flat` while the rows on screen stay the same rows (by data, key and depth): a re-render that only
 * rebuilt it (an inline `getRowKey`, a selection) keeps the previous one, so the column widths are
 * not re-checked against every cell's layout.
 */
function useSameRows<Row>(flat: { rows: FlatRow<Row>[]; measure: unknown[] }) {
  const ref = React.useRef(flat);
  const previous = ref.current;
  if (
    previous !== flat &&
    (previous.rows.length !== flat.rows.length ||
      previous.measure.length !== flat.measure.length ||
      flat.rows.some((item, index) => {
        const before = previous.rows[index];
        return before?.row !== item.row || before.key !== item.key || before.depth !== item.depth;
      }))
  ) {
    ref.current = flat;
  }
  return ref.current;
}

export function DataTable<Row>({
  columns: allColumns,
  hiddenColumns,
  defaultHiddenColumns = EMPTY_IDS,
  onHiddenColumnsChange,
  columnOrder,
  defaultColumnOrder,
  onColumnOrderChange,
  columnsMenu = false,
  rows,
  source = "client",
  rowCount,
  size: sizeProp,
  className,
  showHeader = true,
  stickyHeader = false,
  stickyFirstColumn = false,
  stickyLastColumn = false,
  getRowKey,
  getRowHref,
  onRowClick,
  isRowClickable,
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
  showRange = false,
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
  onReorder,
  reorderHandle = "end",
  getRowChildren,
  renderExpanded,
  isRowExpandable,
  expanded,
  defaultExpanded = EMPTY_KEYS,
  onExpandedChange,
  loadError,
  loadingRows,
  toolbar,
  toolbarChips,
  renderSelectionActions,
  getRowGroup,
  renderGroupHeader,
  stickyGroupHeaders = false,
  collapsedGroups,
  defaultCollapsedGroups,
  onCollapsedGroupsChange,
  ref,
  ...rest
}: DataTableProps<Row>) {
  // Stable across inline `labels` objects: otherwise every row would re-render on each render.
  const labels = useLabels(DATA_TABLE_LABELS, labelsProp);
  const tier = useHostTier(sizeProp);
  const size = tier.size;
  const infinite = paging === "infinite";
  const paged = paging === "pages";
  const server = source === "server";
  const safePageSize = Math.max(1, pageSize);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const tableRef = React.useRef<HTMLTableElement | null>(null);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const mergedRootRef = useMergedRefs(rootRef, ref);
  const depth = useNestedSurfaceDepth();

  // ─── Columns ───
  // Hidden columns are not rendered at all; sorting still reads every column, so hiding the sorted
  // column keeps the row order.
  const [hiddenIds, setHiddenIds] = useControllableState<string[]>({
    value: hiddenColumns,
    defaultValue: defaultHiddenColumns,
    onChange: onHiddenColumnsChange,
  });
  const hiddenSet = React.useMemo(() => new Set(hiddenIds), [hiddenIds]);
  const visibleOf = React.useCallback(
    (list: DataTableColumn<Row>[]) =>
      hiddenSet.size === 0
        ? list
        : list.filter((column) => column.hideable === false || !hiddenSet.has(column.id)),
    [hiddenSet],
  );
  // Columns reorder once the owner passes any of the triad (like folding groups): headers carry
  // their columns, the chooser sorts its items. The kit stores nothing: the owner keeps the order.
  const reorderColumns =
    columnOrder !== undefined ||
    defaultColumnOrder !== undefined ||
    onColumnOrderChange !== undefined;
  const [orderState, setOrderState] = useControllableState<string[]>({
    value: columnOrder,
    defaultValue: defaultColumnOrder ?? EMPTY_IDS,
    onChange: onColumnOrderChange,
  });
  const orderedColumns = React.useMemo(
    () => orderColumns(allColumns, orderState),
    [allColumns, orderState],
  );
  const orderIds = React.useMemo(() => orderedColumns.map((column) => column.id), [orderedColumns]);
  const orderedVisible = React.useMemo(
    () => visibleOf(orderedColumns),
    [visibleOf, orderedColumns],
  );
  const visibleIds = React.useMemo(
    () => orderedVisible.map((column) => column.id),
    [orderedVisible],
  );
  // Columns that hold their place: `reorderable: false`, the row actions (`hideHeader`, nothing to
  // grab), and a pinned first or last column (it stays at its edge).
  const lockedColumns = React.useMemo(() => {
    const locked = lockedInChooser(allColumns as DataTableColumn<never>[]);
    const first = orderedVisible[0];
    const last = orderedVisible.at(-1);
    if (stickyFirstColumn && first) locked.add(first.id);
    if (stickyLastColumn && last) locked.add(last.id);
    return locked;
  }, [allColumns, orderedVisible, stickyFirstColumn, stickyLastColumn]);
  const [tableElement, setTableElement] = React.useState<HTMLTableElement | null>(null);
  const mergedTableRef = useMergedRefs(tableRef, setTableElement);
  /**
   * The visible order a move from the head row asked for (a drop, a key): the head row drew it
   * already, so the head cells do not glide to it again.
   */
  const headMove = React.useRef<string | null>(null);
  const refocusHead = React.useRef<HTMLElement | null>(null);
  React.useLayoutEffect(() => {
    const node = refocusHead.current;
    if (!node) return;
    refocusHead.current = null;
    if (node.isConnected && document.activeElement !== node) {
      node.focus({ focusVisible: true } as FocusOptions);
    }
  });
  const headReorder = React.useMemo<HeadColumnReorder | null>(
    () =>
      reorderColumns
        ? {
            locked: lockedColumns,
            onReorder: (id, beforeId) => {
              // A keyboard move: the header (or its sort button) keeps the focus where it lands.
              const focused = document.activeElement;
              if (focused instanceof HTMLElement && tableRef.current?.tHead?.contains(focused)) {
                refocusHead.current = focused;
              }
              const next = placeColumn(orderIds, visibleIds, id, beforeId, lockedColumns);
              if (!next) return;
              headMove.current = visibleOf(orderColumns(allColumns, next))
                .map((column) => column.id)
                .join("\u0000");
              setOrderState(next);
            },
          }
        : null,
    [reorderColumns, lockedColumns, orderIds, visibleIds, setOrderState, visibleOf, allColumns],
  );
  const columns = orderedVisible;
  // Horizontal overflow of the viewport: the edge cue (shadows at the edges that hide columns).
  const edges = useEdgeOverflow(scrollRef, "horizontal");

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
  // Groups keep their first-appearance order; a sort orders the rows inside each group.
  // Server rows arrive sorted: the order the owner gave is the order on screen.
  const localSort = server ? undefined : sortColumn;
  const { sortedRows, groups } = React.useMemo(() => {
    const sorted = localSort && sortOrder ? sortRows(rows, localSort, sortOrder) : rows;
    if (!getRowGroup) return { sortedRows: sorted, groups: null };
    const grouped = groupRows(rows, sorted, getRowGroup);
    return { sortedRows: grouped.rows, groups: grouped.groups };
  }, [rows, localSort, sortOrder, getRowGroup]);
  const loadedRows = sortedRows.length;
  // Server: the owner's total; never less than what is already loaded.
  const totalRows = server ? Math.max(rowCount ?? loadedRows, loadedRows) : loadedRows;
  const totalPages = Math.max(1, Math.ceil(totalRows / safePageSize));
  // An out-of-range page (the data shrank) shows the nearest page; nothing is written back.
  const safePage = paged ? Math.min(Math.max(pageState, 1), totalPages) : 1;
  /** Position of the first row of the page in the whole data (the range line). */
  const rangeOffset = paged ? (safePage - 1) * safePageSize : 0;
  /** Where the page starts in `rows`: server rows are the page itself. */
  const pageOffset = server ? 0 : rangeOffset;

  // A new sort changes the order of the whole data set: back to page 1.
  const handleSort = (columnId: string) => {
    setSortState(nextSort(sortState, columnId));
    setPageState(1);
  };

  const infiniteRows = useInfiniteRows({
    enabled: infinite,
    // Server batches are shown whole: every loaded row at once, the next one comes from the owner.
    pageSize: server ? Math.max(1, loadedRows) : safePageSize,
    batchSize: infiniteBatchSize,
    totalRows: loadedRows,
    hasMore,
    loadingMore,
    onLoadMore,
    scrollRef,
  });
  const end = infinite
    ? infiniteRows.visibleCount
    : paged && !server
      ? pageOffset + safePageSize
      : loadedRows;
  const displayedCount = Math.max(0, Math.min(end, loadedRows) - pageOffset);

  // ─── Reorder ───
  const reorder = useRowReorder({
    handle: reorderHandle,
    onReorder,
    expandEnabled: Boolean(getRowChildren || renderExpanded),
    // The order on screen is the column's, not the manual one.
    sorted: sortOrder !== undefined,
    rows,
    orderedRows: sortedRows,
    offset: pageOffset,
    getRowKey,
    getRowGroup,
    getRowLabel,
    handleLabel: labels.reorderRow,
    lockedHint: labels.reorderSorted,
  });

  /*
   * Rows that appeared in `rows` since the previous data (by `getRowKey`; positional ids cannot tell
   * a new row from a shifted one). They play the enter animation once when mounted. The first fill
   * (from no rows) is not an addition. The set is kept until the next real addition, so unrelated
   * re-renders never cut a running animation short. Removed rows unmount at once.
   * Server rows that replace the previous ones (another page, sort or filter) are no additions: the
   * body cross-fades as a whole (`batch`) instead.
   */
  const [rowArrival, setRowArrival] = React.useState<{
    rows: Row[];
    added: Set<React.Key>;
    batch: number;
  }>(() => ({ rows, added: new Set(), batch: 0 }));
  if (rowArrival.rows !== rows) {
    let added = rowArrival.added;
    let batch = rowArrival.batch;
    const previousIds = getRowKey ? rowArrival.rows.map(getRowKey) : rowArrival.rows;
    const nextIds = getRowKey ? rows.map(getRowKey) : rows;
    // The owner's rows after a move the table made: the same rows, nothing replaced.
    const change = !server
      ? null
      : reorder.isOwnMove(rowArrival.rows, previousIds, nextIds)
        ? "same"
        : rowsChange<unknown>(previousIds, nextIds);
    if (change === "replace") {
      batch += 1;
      added = new Set();
    } else if (change !== "same" && getRowKey && rowArrival.rows.length > 0) {
      const previous = new Set(rowArrival.rows.map((row, i) => getRowKey(row, i)));
      const fresh = new Set<React.Key>();
      rows.forEach((row, i) => {
        const key = getRowKey(row, i);
        if (!previous.has(key)) fresh.add(key);
      });
      if (fresh.size > 0) added = fresh;
    }
    setRowArrival({ rows, added, batch });
  }
  // A replaced server page starts at its top; the table scrolls only its own viewport.
  React.useEffect(() => {
    if (rowArrival.batch > 0 && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [rowArrival.batch]);

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
  /** Rows collapsed a moment ago: their sub-rows stay drawn while they fold away (base). */
  const [closingKeys, setClosingKeys] = React.useState<ReadonlySet<React.Key>>(NO_KEYS);
  const toggleExpanded = React.useCallback((key: React.Key) => {
    const { expandedKeys: keys, setExpandedKeys: setKeys } = expansion.current;
    const isOpen = keys.includes(key);
    setLastExpandedKey(isOpen ? null : key);
    setKeys(isOpen ? keys.filter((k) => k !== key) : [...keys, key]);
    setClosingKeys((prev) => {
      const next = new Set(prev);
      if (isOpen) next.add(key);
      else next.delete(key);
      return next;
    });
    if (isOpen) {
      window.setTimeout(
        () =>
          setClosingKeys((prev) => {
            if (!prev.has(key)) return prev;
            const next = new Set(prev);
            next.delete(key);
            return next;
          }),
        exitTimeoutMs("base"),
      );
    }
  }, []);

  // ─── Collapsible groups ───
  // Groups fold once the owner passes any of the triad (like `Chat` selection): no extra flag.
  const foldGroups =
    Boolean(getRowGroup) &&
    (collapsedGroups !== undefined ||
      defaultCollapsedGroups !== undefined ||
      onCollapsedGroupsChange !== undefined);
  const [collapsedKeys, setCollapsedKeys] = useControllableState<(string | number)[]>({
    value: collapsedGroups,
    defaultValue: defaultCollapsedGroups ?? EMPTY_GROUPS,
    onChange: onCollapsedGroupsChange,
  });
  const collapsedSet = React.useMemo<ReadonlySet<string | number>>(
    () => (foldGroups ? new Set(collapsedKeys) : NO_GROUPS),
    [foldGroups, collapsedKeys],
  );
  /*
   * Whatever changed the collapsed keys (a toggle, or the owner of a controlled table), a group
   * that closes keeps its rows drawn while they fold away (`closing`), and the rows of a group that
   * opens fold in (`opened`); both clear after the `base` clock, like the sub-rows of a row.
   */
  const [groupFold, setGroupFold] = React.useState(() => ({
    collapsed: collapsedSet,
    closing: NO_GROUPS,
    opened: null as string | number | null,
  }));
  if (groupFold.collapsed !== collapsedSet) {
    const closing = new Set(groupFold.closing);
    let opened = groupFold.opened;
    for (const key of collapsedSet) if (!groupFold.collapsed.has(key)) closing.add(key);
    for (const key of groupFold.collapsed) {
      if (collapsedSet.has(key)) continue;
      closing.delete(key);
      opened = key;
    }
    setGroupFold({ collapsed: collapsedSet, closing: closing.size ? closing : NO_GROUPS, opened });
  }
  React.useEffect(() => {
    if (groupFold.closing.size === 0 && groupFold.opened === null) return;
    const timer = window.setTimeout(
      () => setGroupFold((state) => ({ ...state, closing: NO_GROUPS, opened: null })),
      exitTimeoutMs("base"),
    );
    return () => window.clearTimeout(timer);
  }, [groupFold.closing, groupFold.opened]);
  const toggleGroup = React.useCallback(
    (key: string | number) =>
      setCollapsedKeys((keys) =>
        keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key],
      ),
    [setCollapsedKeys],
  );

  const flat = React.useMemo(
    () =>
      flatten(sortedRows, {
        start: pageOffset,
        end,
        getRowKey,
        getRowChildren,
        sortColumn: localSort,
        order: sortOrder,
        expandEnabled,
        withDetail: Boolean(renderExpanded),
        isRowExpandable,
        expanded: expandedSet,
        closing: closingKeys,
        arrived: rowArrival.added,
        lastExpandedKey,
        collectKeys: selectable,
        groupOf: getRowGroup,
        foldGroups,
        collapsedGroups: collapsedSet,
        closingGroups: groupFold.closing,
        openedGroup: groupFold.opened,
      }),
    [
      getRowGroup,
      foldGroups,
      collapsedSet,
      groupFold.closing,
      groupFold.opened,
      sortedRows,
      pageOffset,
      end,
      getRowKey,
      getRowChildren,
      localSort,
      sortOrder,
      expandEnabled,
      renderExpanded,
      isRowExpandable,
      expandedSet,
      closingKeys,
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

  // The actions on the selected rows: a menu button last in the tool row while rows are selected.
  const selectedKeys = selection.selectedKeys ?? EMPTY_KEYS;
  const showSelectionActions = renderSelectionActions != null && selectedKeys.length > 0;
  const selectionActions = usePartPresence<HTMLDivElement>({
    present: showSelectionActions,
    axis: "inline",
  });
  const hasToolbar = toolbar != null || toolbarChips != null || showSelectionActions;
  const toolbarPresence = usePartPresence<HTMLDivElement>({ present: hasToolbar, axis: "block" });

  // ─── States ───
  const hasError = loadError != null && loadError !== false;
  const showSkeleton = !hasError && loading && displayedCount === 0;
  const showEmpty = !hasError && !loading && displayedCount === 0;
  const bodyState = hasError ? "error" : showSkeleton ? "loading" : showEmpty ? "empty" : "rows";
  /* Body state swaps (loading → rows → empty / error) fade in place: rows cannot be laid over a
     table, so the body remounts under its state key and fades in; the first render, sorting and
     paging stay still (same state). A replaced server page (`rowArrival.batch`) swaps the same way. */
  const { key: bodyKey, className: swapClass } = useSwapIn(
    bodyState === "loading" ? bodyState : `${bodyState}-${rowArrival.batch}`,
  );
  // A row grip leads or ends its row (`reorderHandle`), or the row itself is the grip.
  const rowHandle = reorder.enabled ? reorderHandle : null;
  const gripStart = rowHandle === "start";
  const gripEnd = rowHandle === "end";
  // The column chooser stands in one place: the head cell of the row-actions column (the last
  // visible column, `hideHeader`). A table without one shows it in the page's tools instead
  // (`DataTableColumnsMenu`).
  const actionsColumn = columns.at(-1)?.hideHeader === true;
  const menuInHead = columnsMenu && showHeader && actionsColumn;
  const misplacedMenu = columnsMenu && showHeader && !actionsColumn;
  React.useEffect(() => {
    if (!misplacedMenu) return;
    console.warn(
      "DataTable: `columnsMenu` stands in the head of a row-actions column (the last column, `hideHeader: true`). Without one, put `DataTableColumnsMenu` in the page's tools.",
    );
  }, [misplacedMenu]);
  // The trailing utility cell holds the end grip.
  const endCell = gripEnd;
  const totalColumns =
    columns.length +
    (gripStart ? 1 : 0) +
    (selectable ? 1 : 0) +
    (expandEnabled ? 1 : 0) +
    (endCell ? 1 : 0);
  const fillHeight = scrollHeight === "fill";
  const maxHeight = fillHeight
    ? undefined
    : (scrollHeight ?? (infinite ? INFINITE_SCROLL_HEIGHT : undefined));
  const columnHover = useColumnHover(highlightColumnOnHover);

  // ─── Virtual body ───
  /*
   * A long body in a bounded viewport (`scrollHeight`, `fill`, infinite paging) renders only the
   * rows around the view: spacer rows hold the height of the rest, so the scrollbar, the sticky
   * head and the infinite sentinel stay where they belong. The focused row stays rendered. Grouped,
   * reorderable and detail-panel bodies render every row (segmented bodies, rows of two `<tr>`).
   */
  const flatRows = flat.rows;
  const virtualized =
    bodyState === "rows" &&
    flatRows.length > VIRTUAL_FROM &&
    (fillHeight || maxHeight !== undefined) &&
    !groups &&
    !reorder.enabled &&
    !renderExpanded;
  const headRows = showHeader ? 1 : 0;
  const [focusedKey, setFocusedKey] = React.useState<React.Key | null>(null);
  const pinnedRows = React.useMemo(() => {
    if (focusedKey === null) return undefined;
    const index = flatRows.findIndex((item) => item.key === focusedKey);
    return index >= 0 ? [index] : undefined;
  }, [flatRows, focusedKey]);
  const getVirtualKey = React.useCallback(
    (index: number) => flatRows[index]?.key ?? index,
    [flatRows],
  );
  const rowEstimate = React.useMemo(
    () => readCssLengthPx(`--prime-table-row-height-${size}`, 44),
    [size],
  );
  const estimateRow = React.useCallback(() => rowEstimate, [rowEstimate]);
  const headOffset = React.useCallback(() => tableRef.current?.tHead?.offsetHeight ?? 0, []);
  const virtual = useVirtualRows({
    count: virtualized ? flatRows.length : 0,
    scrollRef,
    getKey: getVirtualKey,
    estimateSize: estimateRow,
    getGroup: ONE_GROUP,
    offset: headOffset,
    pinned: pinnedRows,
  });
  const trackFocus = virtualized
    ? {
        onFocus(event: React.FocusEvent<HTMLTableSectionElement>) {
          const row = (event.target as Element).closest<HTMLElement>("tr[aria-rowindex]");
          const index = Number(row?.getAttribute("aria-rowindex")) - headRows - 1;
          setFocusedKey(flatRows[index]?.key ?? null);
        },
        onBlur(event: React.FocusEvent<HTMLTableSectionElement>) {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocusedKey(null);
        },
      }
    : undefined;

  // A virtualized body brings new rows into view as it scrolls: their content may need wider
  // columns too.
  const sameRows = useSameRows(flat);
  const firstRendered = virtual.rows[0]?.index;
  const lastRendered = virtual.rows.at(-1)?.index;
  const renderedRows = React.useMemo(
    () => ({ rows: sameRows, first: firstRendered, last: lastRendered }),
    [sameRows, firstRendered, lastRendered],
  );
  const slots = React.useMemo(
    () => [
      ...(gripStart ? ["\u0000grip"] : []),
      ...(selectable ? ["\u0000select"] : []),
      ...(expandEnabled ? ["\u0000toggle"] : []),
      ...columns.map((column) => column.id),
      ...(endCell ? ["\u0000end"] : []),
    ],
    [gripStart, selectable, expandEnabled, columns, endCell],
  );
  // Widths are kept per column: a column that changes places (dropped, moved by its keys or in the
  // chooser) keeps its width, so the head cells a drag drew aside are already where they land.
  useFrozenColumns(tableRef, rootRef, slots, renderedRows, bodyState === "rows");

  // A new column order. The head cells glide to it unless the head row drew it (Dnd: a drop, a
  // key); the body is rebuilt once and the columns that changed places fade in there.
  const visibleKey = visibleIds.join("\u0000");
  const fromHead = headMove.current === visibleKey;
  useFlipList({
    container: reorderColumns ? tableElement : null,
    nodes: headCells,
    keyOf: columnCellKey,
    layoutKey: visibleKey,
    enabled: !fromHead,
  });
  const shownOrder = React.useRef(visibleIds);
  React.useLayoutEffect(() => {
    const before = shownOrder.current;
    shownOrder.current = visibleIds;
    headMove.current = null;
    const table = tableRef.current;
    if (!table || !reorderColumns) return;
    for (const id of movedColumns(before, visibleIds)) {
      for (const cell of table.querySelectorAll<HTMLElement>(
        `:scope > tbody > tr > [data-column-id="${CSS.escape(id)}"]`,
      )) {
        cell.classList.remove(enterMotion.enterFade);
        // A fresh start: the class may still be on the cell from a move a moment ago.
        void cell.offsetWidth;
        cell.classList.add(enterMotion.enterFade);
        cell.addEventListener("animationend", () => cell.classList.remove(enterMotion.enterFade), {
          once: true,
        });
      }
    }
  }, [visibleIds, reorderColumns]);

  const baseId = React.useId();
  const rowDomId = React.useCallback(
    (key: React.Key) => `${baseId}-row-${domIdPart(key)}`,
    [baseId],
  );
  const detailDomId = React.useCallback(
    (key: React.Key) => `${baseId}-detail-${domIdPart(key)}`,
    [baseId],
  );

  // Heatmap columns: the range over every row of the data, so paging never changes a cell's shade.
  const domains = React.useMemo(() => scaleDomains(rows, columns), [rows, columns]);

  // Rows get the owner's row callbacks as values (label, href, opens) and the click through a stable
  // wrapper: inline callbacks of a controlled owner never re-render every row on a selection.
  const rowClickRef = React.useRef(onRowClick);
  rowClickRef.current = onRowClick;
  const hasRowClick = onRowClick !== undefined;
  const openRow = React.useMemo<RowShared<Row>["openRow"]>(
    () => (hasRowClick ? (row, index, event) => rowClickRef.current?.(row, index, event) : null),
    [hasRowClick],
  );

  const shared = React.useMemo<RowShared<Row>>(
    () => ({
      columns,
      size,
      labels,
      selectable,
      expandEnabled,
      stickyFirstColumn,
      stickyLastColumn,
      endCell,
      striped,
      totalColumns,
      openRow,
      renderExpanded,
      rowDomId,
      detailDomId,
      scaleDomains: domains,
      selection: selection.handlers,
      toggleExpanded,
      reorder: reorder.shared,
    }),
    [
      reorder.shared,
      domains,
      columns,
      size,
      labels,
      selectable,
      expandEnabled,
      stickyFirstColumn,
      stickyLastColumn,
      endCell,
      striped,
      totalColumns,
      openRow,
      renderExpanded,
      rowDomId,
      detailDomId,
      selection.handlers,
      toggleExpanded,
    ],
  );

  /* «Показано 0–0 из 0» means nothing in loading / empty / error states: the body already says it,
     and «Показано 1–5 из 5» says nothing when every row is already on screen. */
  // Optional lines are off by default: the range only with `showRange`, the infinite status only
  // while more rows load. An empty label draws nothing.
  const rangeText =
    showRange && bodyState === "rows" && (infinite || (paged && totalPages > 1))
      ? formatLabel(labels.range, {
          from: rangeOffset + 1,
          to: rangeOffset + displayedCount,
          total: totalRows,
        })
      : "";
  const loadingMoreText = !hasError && infinite && infiniteRows.loading ? labels.loadingMore : "";

  const defaultOrder = allColumns.map((column) => column.id);
  const menuReorder: ColumnsMenuReorder | null = reorderColumns
    ? {
        locked: lockedColumns,
        // Dnd holds the locked items and announces the item's new place in the menu itself.
        onReorder: (id, beforeId) =>
          setOrderState(moveBefore(orderIds, id, beforeId, (each) => each)),
      }
    : null;
  const orderChanged = reorderColumns && orderIds.join("\u0000") !== defaultOrder.join("\u0000");
  const menuReset =
    sameIds(hiddenIds, defaultHiddenColumns) && !orderChanged
      ? null
      : () => {
          if (!sameIds(hiddenIds, defaultHiddenColumns)) setHiddenIds([...defaultHiddenColumns]);
          if (orderChanged) setOrderState(defaultOrder);
        };
  const columnsMenuTrigger = menuInHead ? (
    <ColumnsMenu
      columns={orderedColumns as DataTableColumn<never>[]}
      hidden={hiddenSet}
      setHidden={setHiddenIds}
      reorder={menuReorder}
      reset={menuReset}
      name={labels.columns}
      labels={labels}
      // A control in the head sits one tier below the table, like the controls in its cells.
      size={stepDown(size)}
      trigger="icon"
    />
  ) : null;

  const rowOpens = Boolean(getRowHref || onRowClick);
  const renderRow = (item: FlatRow<Row>, index: number, inWindow = false) => {
    // A row opens as a link (`getRowHref`) or in place (`onRowClick`); `isRowClickable` takes a row
    // (a total, a service row) out of both.
    const opens = rowOpens && (isRowClickable?.(item.row) ?? true);
    return (
      <DataTableRow
        key={String(item.key)}
        shared={shared}
        row={item.row}
        rowKey={item.key}
        rowLabel={getRowLabel?.(item.row)}
        opens={opens}
        href={opens ? getRowHref?.(item.row) : undefined}
        index={index}
        depth={item.depth}
        expandable={item.expandable}
        expanded={item.expanded}
        animate={item.animate}
        folding={item.folding}
        foldable={item.foldable}
        detailAnimate={lastExpandedKey === item.key}
        selected={selectable && selection.selectedSet.has(item.key)}
        childControls={item.childKeys.map(rowDomId).join(" ")}
        measureRef={inWindow ? virtual.measure(index) : undefined}
        ariaRowIndex={inWindow ? index + 1 + headRows : undefined}
      />
    );
  };

  /** Stands for rows not rendered in a virtualized body: their height, nothing to read or reach. */
  const spacerRow = (key: string, height: number) =>
    height > 0 ? (
      // biome-ignore lint/a11y/noAriaHiddenOnFocusable: a spacer `<tr>` holds nothing focusable
      <tr key={key} className={styles.spacerRow} aria-hidden="true">
        <td colSpan={totalColumns} className={styles.spacerCell} style={{ height }} />
      </tr>
    ) : null;
  const renderWindow = () => {
    const laid = rowGaps(virtual);
    return [
      ...laid.rows.flatMap(({ index, gap }) => {
        const item = flatRows[index];
        if (!item) return [];
        return [spacerRow(`gap-${String(item.key)}`, gap), renderRow(item, index, true)];
      }),
      spacerRow("gap-end", laid.end),
    ];
  };

  // Grouped rows: one `<tbody>` per group run on screen, headed by its group row (a collapsed
  // group's body holds the header alone).
  type Segment = { key: string | number; rows: { item: FlatRow<Row>; index: number }[] };
  const entries = (start: number, end: number) =>
    flat.rows.slice(start, end).map((item, offset) => ({ item, index: start + offset }));
  // Reorderable rows are one sortable `<tbody>` per run (the page, or each group: rows move inside
  // their group), so the segments are needed without groups too.
  const segments: Segment[] =
    bodyState !== "rows"
      ? []
      : groups
        ? flat.runs.map((run) => ({ key: run.key, rows: entries(run.start, run.end) }))
        : reorder.enabled
          ? [{ key: "", rows: entries(0, flat.rows.length) }]
          : [];

  const groupHeader = (segment: Segment) => {
    if (!groups) return null;
    const { key } = segment;
    const group = groups.get(key);
    const collapsed = collapsedSet.has(key);
    return (
      <GroupRow
        totalColumns={totalColumns}
        sticky={stickyGroupHeaders}
        size={size}
        toggle={
          foldGroups
            ? {
                collapsed,
                label: formatLabel(collapsed ? labels.expandGroup : labels.collapseGroup, {
                  group: String(key),
                }),
                // Reorderable rows carry no DOM id.
                controls:
                  collapsed || reorder.enabled
                    ? undefined
                    : segment.rows.map(({ item }) => rowDomId(item.key)).join(" "),
                onToggle: () => toggleGroup(key),
              }
            : undefined
        }
      >
        {renderGroupHeader && group ? renderGroupHeader(group) : String(key)}
      </GroupRow>
    );
  };

  return (
    <ReorderRoot enabled={reorder.enabled || (reorderColumns && showHeader)}>
      <SurfaceDepthProvider value={depth}>
        {tier.provide(
          <div
            {...rest}
            ref={mergedRootRef}
            className={cx(fieldTierClass, styles.root, className)}
            data-depth={depth}
            {...toDataAttributes({
              size,
              "row-dividers": rowDividers ? undefined : "false",
              "column-dividers": columnDividers ? undefined : "false",
              "sticky-header": stickyHeader,
              "sticky-first-column": stickyFirstColumn,
              "sticky-last-column": stickyLastColumn,
              "table-width": columns.some((c) => c.grow) ? "grow" : fullWidth ? "fill" : "auto",
              "highlight-row": highlightRowOnHover,
              "highlight-column": highlightColumnOnHover,
              striped,
              loading: loading || undefined,
              reorderable: reorder.enabled || undefined,
              "reorder-handle": rowHandle ?? undefined,
              selectable: selectable || undefined,
              expandable: expandEnabled || undefined,
              dragging: selection.dragging || undefined,
              "overflow-start": edges.start || undefined,
              "overflow-end": edges.end || undefined,
              "scroll-height": fillHeight ? "fill" : undefined,
            })}
          >
            {/* The table's own tools: the one tool row (as `Page.Tools`), the active filters under it. */}
            {hasToolbar ? (
              <div
                ref={toolbarPresence.ref}
                className={cx(styles.toolbar, toolbarPresence.className)}
              >
                {toolbar != null || showSelectionActions ? (
                  <ToolRow>
                    {toolbar}
                    {showSelectionActions ? (
                      <ToolCell
                        key="\u0000selection"
                        ref={selectionActions.ref}
                        className={selectionActions.className}
                      >
                        <SelectionMenu
                          selected={selectedKeys}
                          actions={renderSelectionActions(selectedKeys)}
                          onClear={selection.clear}
                          labels={labels}
                          size={size}
                        />
                      </ToolCell>
                    ) : null}
                  </ToolRow>
                ) : null}
                {toolbarChips != null ? <ToolChips>{toolbarChips}</ToolChips> : null}
              </div>
            ) : null}

            {/* The frame holds the edge shadows over the viewport; they never scroll with the table. */}
            <div className={cx(fieldTierClass, styles.frame)} data-size={compactTier(size)}>
              <ScrollContainer
                ref={scrollRef}
                axis="both"
                edges="none"
                className={cx(fieldTierClass, styles.viewport)}
                data-size="xs"
                style={{ maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight }}
              >
                <table
                  ref={mergedTableRef}
                  className={cx(fieldTierClass, styles.table)}
                  data-size={stepDown(size)}
                  aria-busy={loading || infiniteRows.loading || undefined}
                  aria-rowcount={virtualized ? flatRows.length + headRows : undefined}
                  {...columnHover}
                >
                  <colgroup>
                    {gripStart ? <col /> : null}
                    {selectable ? <col /> : null}
                    {expandEnabled ? <col /> : null}
                    {columns.map((column) => (
                      <col key={column.id} data-grow={column.grow ? "true" : undefined} />
                    ))}
                    {endCell ? <col /> : null}
                  </colgroup>
                  {showHeader ? (
                    <Head
                      columns={columns}
                      size={size}
                      sort={sortState}
                      onSort={handleSort}
                      stickyFirstColumn={stickyFirstColumn}
                      stickyLastColumn={stickyLastColumn}
                      stickyHeader={stickyHeader}
                      expandEnabled={expandEnabled}
                      infoLabel={labels.columnInfo}
                      gripStart={gripStart}
                      columnsMenu={columnsMenuTrigger}
                      endCell={endCell}
                      reorder={headReorder}
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

                  {reorder.enabled && bodyState === "rows" ? (
                    <React.Fragment key={bodyKey}>
                      {segments.map((segment) => (
                        <ReorderBody
                          key={`group-${String(segment.key)}`}
                          entries={segment.rows}
                          start={segment.rows[0]?.index ?? 0}
                          handle={rowHandle !== "row"}
                          locked={reorder.shared?.locked ?? false}
                          onReorder={reorder.reorderIn(segment.rows)}
                          getRowLabel={getRowLabel}
                          renderRow={renderRow}
                          header={groupHeader(segment)}
                          className={swapClass}
                        />
                      ))}
                    </React.Fragment>
                  ) : groups && bodyState === "rows" ? (
                    <React.Fragment key={bodyKey}>
                      {segments.map((segment) => (
                        <tbody key={`group-${String(segment.key)}`} className={swapClass}>
                          {groupHeader(segment)}
                          {segment.rows.map(({ item, index }) => renderRow(item, index))}
                        </tbody>
                      ))}
                    </React.Fragment>
                  ) : (
                    <tbody key={bodyKey} className={swapClass} {...trackFocus}>
                      {bodyState === "rows" ? (
                        virtualized ? (
                          renderWindow()
                        ) : (
                          flat.rows.map((item, index) => renderRow(item, index))
                        )
                      ) : (
                        <StateRows
                          state={bodyState}
                          columns={columns}
                          size={size}
                          totalColumns={totalColumns}
                          selectable={selectable}
                          expandEnabled={expandEnabled}
                          gripStart={gripStart}
                          endCell={endCell}
                          loadError={loadError}
                          empty={empty}
                          emptyLabel={labels.empty}
                          skeletonRows={Math.max(
                            1,
                            loadingRows ?? Math.min(safePageSize, SKELETON_ROWS),
                          )}
                        />
                      )}
                    </tbody>
                  )}

                  {flat.measure.length > 0 && !hasError ? (
                    <MeasureBody
                      rows={flat.measure}
                      columns={columns}
                      selectable={selectable}
                      expandEnabled={expandEnabled}
                      gripStart={gripStart}
                      endCell={endCell}
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

            {showSkeleton ? <VisuallyHidden live="polite">{labels.loading}</VisuallyHidden> : null}

            {selectable ? (
              <VisuallyHidden live="polite">{selection.announcement}</VisuallyHidden>
            ) : null}

            {infinite ? <VisuallyHidden live="polite">{loadingMoreText}</VisuallyHidden> : null}

            <Footer
              range={rangeText || null}
              pagination={
                paged && totalPages > 1
                  ? { page: safePage, totalPages, onPageChange: setPageState }
                  : null
              }
              status={loadingMoreText || null}
            />
          </div>,
        )}
      </SurfaceDepthProvider>
    </ReorderRoot>
  );
}
