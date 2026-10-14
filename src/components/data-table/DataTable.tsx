import * as React from "react";

import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { useControllableState } from "@/hooks/useControllableState";
import { useEdgeOverflow } from "@/hooks/useEdgeOverflow";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { readCssLengthPx } from "@/hooks/usePosition";
import { exitTimeoutMs } from "@/hooks/usePresence";
import { useStateSwap } from "@/hooks/useStateSwap";
import { rowGaps, useVirtualRows } from "@/hooks/useVirtualRows";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { formatLabel } from "@/internal/formatLabel";
import type { ControlSize } from "@/internal/states";
import { SurfaceDepthProvider, useNestedSurfaceDepth } from "@/internal/surfaceDepth";
import swapMotion from "@/internal/swapMotion.module.css";
import { VisuallyHidden } from "@/internal/VisuallyHidden";
import { DataTableColumnsMenu } from "./ColumnsMenu";
import { DataTableColumnsContext, type DataTableColumnsContextValue } from "./context";
import styles from "./DataTable.module.css";
import { Footer } from "./Footer";
import { Head } from "./Head";
import { DataTableRow, GroupRow, MeasureBody, type RowShared } from "./Row";
import { ReorderBody, ReorderRoot, useRowReorder } from "./reorder";
import { type FlatRow, flatten, groupRows, nextSort, scaleDomains, sortRows } from "./rows";
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

export type { DataTableColumnsMenuProps } from "./ColumnsMenu";
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
  /** Text of the `DataTable.ColumnsMenu` trigger; `{shown}` and `{total}` are column counts. */
  columns: string;
  /** The `DataTable.ColumnsMenu` item that shows every column again. */
  showAllColumns: string;
  /** `aria-label` of a row's drag handle (`onReorder`); `{label}` is `getRowLabel(row)`. */
  reorderRow: string;
  /** Tooltip of the handles while the table is sorted by a column (reordering is off). */
  reorderSorted: string;
  /** `aria-label` of the toggle of a collapsed group; `{group}` is the group key. */
  expandGroup: string;
  /** `aria-label` of the toggle of an expanded group; `{group}` is the group key. */
  collapseGroup: string;
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
  columns: "Колонки",
  showAllColumns: "Показать все",
  reorderRow: "Переместить строку {label}",
  reorderSorted: "Порядок задан сортировкой. Сбросьте её, чтобы перемещать строки",
  expandGroup: "Развернуть группу {group}",
  collapseGroup: "Свернуть группу {group}",
};

export type DataTableProps<Row> = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** The outer card-fill `<div>`. */
  ref?: React.Ref<HTMLDivElement>;
  columns: DataTableColumn<Row>[];
  /**
   * Ids of columns not rendered (head, body, skeleton, state rows), controlled. A column with
   * `hideable: false` stays. `DataTable.ColumnsMenu` in `toolbar` changes it.
   */
  hiddenColumns?: string[];
  /** Initially hidden column ids, uncontrolled. */
  defaultHiddenColumns?: string[];
  /** The hidden column ids changed (`DataTable.ColumnsMenu`); keep them to restore the choice. */
  onHiddenColumnsChange?: (hiddenColumns: string[]) => void;
  rows: Row[];
  /**
   * Who sorts and pages the rows. `client` — the table sorts `rows` and slices pages itself;
   * `server` — `rows` is the one page (or the loaded batches) the owner fetched, already sorted:
   * the table never re-sorts or slices them, `sort` / `page` drive the request and `rowCount`
   * the Pagination and the range line.
   */
  source?: "client" | "server";
  /** Total rows on the server (`source="server"`): Pagination and «Показано … из {total}». */
  rowCount?: number;
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
  /**
   * The row is a link: the key cell (first visible column) holds a real `<a>` and the same link
   * covers every other cell, so a click, ⌘/Ctrl-click, a middle click and «open in new tab» work
   * anywhere on the row; Tab stops on the link.
   */
  getRowHref?: (row: Row) => string;
  /**
   * Opens a row in place: a click on the row (never on a control inside it, never from a portal)
   * or Enter / Space on the focused row. With `getRowHref` it gets the plain clicks only — call
   * `event.preventDefault()` there to route in the app instead of loading the page.
   */
  onRowClick?: (row: Row, index: number, event: DataTableRowClickEvent) => void;
  /** Which rows open (`getRowHref` / `onRowClick`); `false` for totals and service rows. */
  isRowClickable?: (row: Row) => boolean;
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
  /**
   * Asks for the next batch. A returned promise shows the loading status until it settles; a
   * rejected one stops asking until the rows change.
   */
  onLoadMore?: () => void | Promise<void>;
  /**
   * Max height of the scroll viewport (number = px); `"fill"` — the table takes the height of
   * its flex / grid parent and the rows scroll inside. 360 with `paging="infinite"`.
   */
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
  /**
   * Rows reorder: a leading handle column (drag, a touch hold, Alt + ↑ / ↓). The row `id` now
   * stands in front of `beforeId` (`getRowKey` values; `null` — last); on a page, a row put last
   * stands in front of the first row of the next page. Return a promise to save on a server: the
   * row stays in its new place with a busy handle, a rejection moves it back. Off while the table
   * is sorted by a column; with `getRowGroup` rows move inside their group. Not combined with
   * expandable rows (`getRowChildren`, `renderExpanded`).
   */
  onReorder?: (id: React.Key, beforeId: React.Key | null) => void | Promise<void>;
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
  /**
   * Group key of a row: rows are drawn under a header row per group. Groups keep the order they
   * first appear in `rows`; a sort orders the rows inside each group.
   */
  getRowGroup?: (row: Row) => string | number;
  /** Content of a group header row (name, totals); defaults to the group key. */
  renderGroupHeader?: (group: DataTableGroup<Row>) => React.ReactNode;
  /** Group header rows stick under the head while their rows scroll. */
  stickyGroupHeaders?: boolean;
  /**
   * Keys of the collapsed groups, controlled. Passing any of `collapsedGroups`,
   * `defaultCollapsedGroups`, `onCollapsedGroupsChange` makes groups fold: each group header gets
   * a disclosure toggle and its rows fold away and back.
   */
  collapsedGroups?: (string | number)[];
  /** Initially collapsed group keys, uncontrolled (`[]` — every group open, but foldable). */
  defaultCollapsedGroups?: (string | number)[];
  /** The collapsed group keys changed (a group header toggle). */
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
  rows,
  source = "client",
  rowCount,
  size = "m",
  className,
  showHeader = true,
  stickyHeader = false,
  stickyFirstColumn = false,
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
  getRowChildren,
  renderExpanded,
  isRowExpandable,
  expanded,
  defaultExpanded = EMPTY_KEYS,
  onExpandedChange,
  error,
  loadingRows,
  toolbar,
  getRowGroup,
  renderGroupHeader,
  stickyGroupHeaders = false,
  collapsedGroups,
  defaultCollapsedGroups,
  onCollapsedGroupsChange,
  ref,
  ...rest
}: DataTableProps<Row>) {
  // Keyed by content: an inline `labels` object would otherwise re-render every row on each render.
  const labelsKey = labelsProp ? JSON.stringify(labelsProp) : "";
  // biome-ignore lint/correctness/useExhaustiveDependencies: `labelsKey` is the content of `labelsProp`.
  const labels = React.useMemo(() => ({ ...DEFAULT_LABELS, ...labelsProp }), [labelsKey]);
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
  const columns = React.useMemo(() => {
    if (hiddenSet.size === 0) return allColumns;
    return allColumns.filter((column) => column.hideable === false || !hiddenSet.has(column.id));
  }, [allColumns, hiddenSet]);
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
    onReorder,
    expandEnabled: Boolean(getRowChildren || renderExpanded),
    // The order on screen is the column's, not the manual one.
    sorted: sortOrder !== undefined,
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
      : reorder.isOwnMove(previousIds, nextIds)
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

  // ─── States ───
  const hasError = error != null && error !== false;
  const showSkeleton = !hasError && loading && displayedCount === 0;
  const showEmpty = !hasError && !loading && displayedCount === 0;
  const bodyState = hasError ? "error" : showSkeleton ? "loading" : showEmpty ? "empty" : "rows";
  /* Body state swaps (loading → rows → empty / error) cross-fade: the body remounts under its
     state key and fades in; the first render, sorting and paging stay still (same state). A
     replaced server page (`rowArrival.batch`) cross-fades the same way. */
  const stateSwapped = useStateSwap(bodyState);
  const bodySwapped = stateSwapped || rowArrival.batch > 0;
  const bodyKey = bodySwapped ? `${bodyState}-${rowArrival.batch}` : undefined;
  const totalColumns =
    columns.length + (reorder.enabled ? 1 : 0) + (selectable ? 1 : 0) + (expandEnabled ? 1 : 0);
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
  // biome-ignore lint/correctness/useExhaustiveDependencies: the rendered range is the trigger, not a value read here.
  const renderedRows = React.useMemo(
    () => ({ rows: sameRows }),
    [sameRows, firstRendered, lastRendered],
  );
  useFrozenColumns(
    tableRef,
    rootRef,
    columns.map((column) => column.id).join("\u0000"),
    renderedRows,
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
  const showRange = bodyState === "rows" && (infinite || (paged && totalPages > 1));
  const showInfiniteStatus =
    !hasError &&
    infinite &&
    (infiniteRows.hasInternalMore || infiniteRows.loading || infiniteRows.canRequestMore);

  const columnsMenu = React.useMemo<DataTableColumnsContextValue>(
    () => ({
      columns: allColumns as DataTableColumn<never>[],
      hidden: hiddenSet,
      setHidden: setHiddenIds,
      labels,
      size,
    }),
    [allColumns, hiddenSet, setHiddenIds, labels, size],
  );

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
  const swapClass = bodySwapped ? swapMotion.swapIn : undefined;

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
    <ReorderRoot enabled={reorder.enabled}>
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
              reorderable: reorder.enabled || undefined,
              selectable: selectable || undefined,
              expandable: expandEnabled || undefined,
              dragging: selection.dragging || undefined,
              "overflow-start": edges.start || undefined,
              "overflow-end": edges.end || undefined,
              "scroll-height": fillHeight ? "fill" : undefined,
            })}
          >
            {toolbar != null ? (
              <DataTableColumnsContext value={columnsMenu}>
                <div className={styles.toolbar}>{toolbar}</div>
              </DataTableColumnsContext>
            ) : null}

            {/* The frame holds the edge shadows over the viewport; they never scroll with the table. */}
            <div className={styles.frame}>
              <ScrollContainer
                ref={scrollRef}
                axis="both"
                edges="none"
                overscrollBehavior="none"
                className={styles.viewport}
                style={{ maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight }}
              >
                <table
                  ref={tableRef}
                  className={styles.table}
                  aria-busy={loading || infiniteRows.loading || undefined}
                  aria-rowcount={virtualized ? flatRows.length + headRows : undefined}
                  {...columnHover}
                >
                  <colgroup>
                    {reorder.enabled ? <col /> : null}
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
                      stickyHeader={stickyHeader}
                      stickyCorner={stickyHeader && stickyFirstColumn}
                      expandEnabled={expandEnabled}
                      reorderable={reorder.enabled}
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
                          reorderable={reorder.enabled}
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
                  )}

                  {flat.measure.length > 0 && !hasError ? (
                    <MeasureBody
                      rows={flat.measure}
                      columns={columns}
                      selectable={selectable}
                      expandEnabled={expandEnabled}
                      reorderable={reorder.enabled}
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
              <VisuallyHidden live="polite">{selection.announcement}</VisuallyHidden>
            ) : null}

            <Footer
              size={size}
              range={
                showRange
                  ? formatLabel(labels.range, {
                      from: rangeOffset + 1,
                      to: rangeOffset + displayedCount,
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
                showInfiniteStatus
                  ? infiniteRows.loading
                    ? labels.loadingMore
                    : labels.scrollForMore
                  : null
              }
            />
          </div>
        </ControlSizeProvider>
      </SurfaceDepthProvider>
    </ReorderRoot>
  );
}

/** The column chooser of the table it sits in; place it into `toolbar`. */
DataTable.ColumnsMenu = DataTableColumnsMenu;
