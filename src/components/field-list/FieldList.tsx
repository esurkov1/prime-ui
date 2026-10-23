import * as React from "react";
import { Button } from "@/components/button/Button";
import { Dnd, moveBefore } from "@/components/dnd/Dnd";
import { Dropdown } from "@/components/dropdown/Dropdown";
import type { HintTone } from "@/components/hint/Hint";
import { Label } from "@/components/label/Label";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { VisuallyHidden, visuallyHiddenClass } from "@/components/visually-hidden/VisuallyHidden";
import { useControllableState } from "@/hooks/useControllableState";
import { useResizeEffect } from "@/hooks/useElementSize";
import { readCssLengthPx } from "@/hooks/usePosition";
import { Icon } from "@/icons";
import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { DisabledProvider, useInheritedDisabled } from "@/internal/disabledContext";
import enterMotion from "@/internal/enterMotion.module.css";
import { FieldFrame, type FieldRootDomProps, useFieldFrame } from "@/internal/FieldFrame";
import { type FieldCell, FieldCellContext } from "@/internal/fieldCell";
import { fieldTierClass } from "@/internal/fieldClasses";
import { formatLabel } from "@/internal/formatLabel";
import hairline from "@/internal/hairline.module.css";
import { hasContent } from "@/internal/hasContent";
import { useLabels } from "@/internal/labels";
import { leaveInPlace } from "@/internal/leaveInPlace";
import { useListPresence } from "@/internal/listPresence";
import { usePartPresence } from "@/internal/partPresence";
import type { ControlSize } from "@/internal/states";
import { SurfaceDepthProvider, useNestedSurfaceDepth } from "@/internal/surfaceDepth";
import { TOKEN_DEFAULTS } from "@/internal/tokenDefaults";
import { useFlipList } from "@/internal/useFlipList";
import { isPromiseLike, usePendingChanges } from "@/internal/usePendingChanges";

import styles from "./FieldList.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FieldListLabels = {
  /** `aria-label` of a row's remove button; `{row}` is the row's name. */
  remove: string;
  /** `aria-label` of a row's drag handle; `{row}` is the row's name. */
  reorder: string;
  /** `aria-label` of a row's actions menu button (`rowActions="menu"`); `{row}` is the row's name. */
  actions: string;
  /** Menu item that moves the row one place up. */
  moveUp: string;
  /** Menu item that moves the row one place down. */
  moveDown: string;
  /** Menu item that removes the row. */
  removeItem: string;
  /** Announced after a move from the menu or its keys; `{row}`, `{position}`, `{total}`. */
  moved: string;
  /** Name of a row without `getLabel` text; `{index}` counts from 1. */
  row: string;
  /** Name of a row with `getLabel` text; `{label}` is that text. */
  namedRow: string;
  /** Why a pinned row cannot be removed: the tooltip of its remove button, the note in its menu. */
  lockedReason: string;
  /** Name of the totals row (`renderTotals`), shown in its first cell when that has no total. */
  totals: string;
};

export const FIELD_LIST_LABELS: FieldListLabels = {
  remove: "Удалить: {row}",
  reorder: "Переместить: {row}",
  actions: "Действия: {row}",
  moveUp: "Выше",
  moveDown: "Ниже",
  removeItem: "Удалить",
  moved: "{row}: позиция {position} из {total}",
  row: "строка {index}",
  namedRow: "«{label}»",
  lockedReason: "Закреплённую строку нельзя удалить",
  totals: "Итого",
};

/** Width of a column: the same track in the heading row and in every row. */
export type FieldListColumnWidth = "fill" | "compact" | "xs" | "s" | "m";

export type FieldListColumn = {
  /** Column heading, shown once above the rows; it names the field of this column in every row. */
  label: string;
  /**
   * `fill` (default) shares the free width; `compact` is as wide as its widest control or heading
   * (an icon Select, a swatch button, a checkbox); `xs` a number of a few digits (a share, a percent); `s` a short
   * value (a quantity, a code); `m` an amount or a date.
   */
  width?: FieldListColumnWidth;
  /** A red `*` after the heading (decorative): every field of the column is required. */
  required?: boolean;
};

/** What `renderItem` gets beside the item: its place and the edits of its row. */
export type FieldListRow<T> = {
  /** Place of the row, from 0. */
  index: number;
  /** Merges `patch` into the item and reports the new list through `onValueChange`. */
  update: (patch: Partial<T>) => void;
  /** Takes the row out of the list (the row's remove button does the same). */
  remove: () => void;
};

/** How a row offers its remove and its moves. */
export type FieldListRowActions = "buttons" | "menu";

/** The look of the list: on a fill of its own, or on the host surface. */
export type FieldListVariant = "plain" | "surface";

export type FieldListProps<T extends object> = Omit<FieldRootDomProps, "onChange"> & {
  value?: readonly T[];
  defaultValue?: readonly T[];
  onValueChange?: (value: T[]) => void | Promise<void>;
  getId: (item: T) => string;
  columns: readonly FieldListColumn[];
  renderItem: (item: T, row: FieldListRow<T>) => React.ReactNode;
  renderTotals?: (items: readonly T[]) => React.ReactNode;
  createItem?: () => T | Promise<T>;
  addLabel?: string;
  getLabel?: (item: T) => string;
  getLocked?: (item: T) => boolean;
  getLockedReason?: (item: T) => string | undefined;
  reorderable?: boolean;
  stackedLabels?: boolean;
  hideHeadings?: boolean;
  rowActions?: FieldListRowActions;
  variant?: FieldListVariant;
  min?: number;
  max?: number;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  hintTone?: HintTone;
  error?: React.ReactNode;
  disabled?: boolean;
  size?: ControlSize;
  labels?: Partial<FieldListLabels>;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** A track the row stylesheet sizes (`FieldList.module.css`), read by its name. */
const track = (name: `--fl-${string}`) => `var(${name})`;

/**
 * Track of each width. The end track fits the row's action button (remove or menu), the grip
 * track after it (`auto`) its `xs` box; every row, the heading row and the totals row share the
 * same list (`--fl-columns`), so the columns line up like a table's.
 */
const TRACKS: Record<Exclude<FieldListColumnWidth, "compact">, string> = {
  fill: "minmax(0, 1fr)",
  xs: track("--fl-xs"),
  s: track("--fl-s"),
  m: track("--fl-m"),
};

/**
 * A compact column is as wide as the widest of its cells (the control, the heading, the total),
 * measured on the body (`--fl-compact-<column>`), so the gap after it is the column gap like every
 * other; before the first measure each row sizes it by its own content. Measured, not a subgrid:
 * a row Dnd carries flies outside the list, and its tracks go with it.
 */
const compactTrack = (column: number) => `var(--fl-compact-${column}, max-content)`;

/** The cells of a row: the top-level elements of what `renderItem` returned, fragments opened. */
function cellsOf(node: React.ReactNode): React.ReactNode[] {
  return React.Children.toArray(node).flatMap((child) =>
    React.isValidElement<{ children?: React.ReactNode }>(child) && child.type === React.Fragment
      ? cellsOf(child.props.children)
      : [child],
  );
}

/**
 * The totals of a row of columns: one node per column in order, `null` where a column has none, a
 * fragment opened (`React.Children` keeps the empty places, so the totals stay under their columns).
 */
function totalsOf(node: React.ReactNode): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  React.Children.forEach(node, (child) => {
    if (
      React.isValidElement<{ children?: React.ReactNode }>(child) &&
      child.type === React.Fragment
    )
      out.push(...totalsOf(child.props.children));
    else out.push(child);
  });
  return out;
}

/** The text box of a cell's field: an input that holds text, or a textarea. */
const TEXT_BOX = "input:not([type='checkbox'], [type='radio'], [type='hidden']), textarea";

/**
 * Whether the field in a cell ends its text at the end edge (a number with its unit after it, as
 * `Input` sets it): the total of that column then ends there too.
 */
function endsText(cell: Element | undefined): boolean {
  const box = cell?.querySelector(TEXT_BOX);
  if (!box) return false;
  const { textAlign, direction } = getComputedStyle(box);
  return textAlign === "end" || textAlign === (direction === "rtl" ? "left" : "right");
}

/** The last change wins: the list a pending `onValueChange` was called with. */
function takeNext<V>(_current: V, next: V): V {
  return next;
}

const FOCUSABLE = "input, textarea, select, button, [tabindex]:not([tabindex='-1'])";

/** The keys that move a row from its menu button (`rowActions="menu"`), as Dnd's handle takes them. */
const MOVE_KEYS = "Alt+ArrowUp Alt+ArrowDown";

/** The rows that glide when the list changes: the list's own rows, not one closing up. */
const flipRows = (list: HTMLElement) =>
  list.querySelectorAll<HTMLElement>(":scope > li[data-fl-row]:not([data-leaving])");
const flipRowKey = (row: HTMLElement) => row.dataset.flRow;

/** The tier of the grip column: the handle and the lock are `xs` controls on every row tier. */
const GRIP_TIER: ControlSize = "xs";

/**
 * The last cell of a row (handle or lock, after the remove button) or of the heading and totals
 * rows (empty): one `xs` box wide, so every row ends on the same line.
 */
function GripBox({ children }: { children?: React.ReactNode }) {
  return (
    <span className={cx(fieldTierClass, styles.grip)} data-size={GRIP_TIER}>
      {children}
    </span>
  );
}

type CellPlace = "lead" | "main" | "value" | "rest";

/**
 * Where a cell stands once the rows stack: the leading run of `compact` columns and the first
 * other column open the row (`lead`, `main`), the next column is the row's second line (`value`),
 * the rest take a line each (`rest`). The row's actions end the first line while the main field
 * keeps room for its text beside them (`data-stack` on the body says what moves down otherwise).
 */
function placesOf(columns: readonly FieldListColumn[]): CellPlace[] {
  const main = columns.findIndex((column) => column.width !== "compact");
  return columns.map((_, index) => {
    if (main === -1 || index < main) return "lead";
    if (index === main) return "main";
    return index === main + 1 ? "value" : "rest";
  });
}

/** The least width the main field of a stacked row keeps beside the actions: 160 at 16px. */
const mainMinWidth = () =>
  readCssLengthPx("--prime-space-20", TOKEN_DEFAULTS["--prime-space-20"]) * 2;

// ─── Root ─────────────────────────────────────────────────────────────────────

/**
 * An editable list of records of the same shape: one row per record on one grid, the column
 * headings shown once above the rows, the row's actions at its end (a remove button and a handle,
 * or one menu), an add button under them and pinned rows. In a narrow container a row keeps its
 * first fields and its actions on one line and puts the rest under them, each with its label
 * (`stackedLabels`).
 */
export function FieldList<T extends object>({
  value: valueProp,
  defaultValue,
  onValueChange,
  getId,
  columns,
  renderItem,
  renderTotals,
  createItem,
  addLabel,
  getLabel,
  getLocked,
  getLockedReason,
  reorderable = false,
  stackedLabels = true,
  hideHeadings = false,
  rowActions = "buttons",
  variant = "plain",
  min = 0,
  max,
  label,
  hint,
  hintTone,
  error,
  disabled: disabledProp = false,
  size: sizeProp,
  labels: labelsProp,
  className,
  ref,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...rest
}: FieldListProps<T>) {
  const tier = useHostTier(sizeProp);
  const size = tier.size;
  const disabled = useInheritedDisabled(disabledProp);
  const labels = useLabels(FIELD_LIST_LABELS, labelsProp);
  const depth = useNestedSurfaceDepth();
  const surface = variant === "surface";
  const [stored, setStored] = useControllableState<readonly T[]>({
    value: valueProp,
    defaultValue: defaultValue ?? [],
  });
  // A list the owner is still saving (a promise from `onValueChange`) is drawn ahead of its answer;
  // on a rejection the rows show the owner's list again.
  const changes = usePendingChanges<readonly T[], readonly T[]>(stored, takeNext);
  const items = changes.shown;
  const busy = changes.pending.length > 0;
  // Read synchronously: two edits in one handler chain on each other.
  const latest = React.useRef(items);
  latest.current = items;
  // An add that waits for its item reports to the handler of the render that finishes it.
  const onChange = React.useRef(onValueChange);
  onChange.current = onValueChange;
  const setItems = (edit: (current: readonly T[]) => T[]) => {
    const next = edit(latest.current);
    latest.current = next;
    const outcome = onChange.current?.(next);
    if (!isPromiseLike(outcome)) {
      setStored(next);
      return;
    }
    changes.track(next, outcome, { onResolve: () => setStored(next) });
  };
  // A row `createItem` is still making (its promise): drawn as a placeholder in the row's geometry
  // until the item arrives; one at a time.
  const [creating, setCreating] = React.useState(false);
  const alive = React.useRef(true);
  React.useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  // Rows that took the place of their placeholder: the item arrives in place, it does not rise in.
  const arrived = React.useRef(new Set<string>());
  const ids = useFieldFrame(undefined, { label, hint, error });
  // The list is named by the visible label, else by the consumer's `aria-labelledby` / `aria-label`,
  // and described by the list's hint and error, which speak for every row.
  const listName = {
    "aria-labelledby": ids.labelledBy ?? ariaLabelledBy,
    "aria-label": ids.labelledBy || ariaLabelledBy ? undefined : ariaLabel,
    "aria-describedby": ids.describedBy,
    "aria-busy": busy || creating || undefined,
  };
  const addRef = React.useRef<HTMLButtonElement>(null);
  const rows = React.useRef(new Map<string, HTMLElement>());
  // Rows the data adds rise in; rows it takes out close up in place (the kit's keyed list presence).
  const keys = items.map(getId);
  const presence = useListPresence(keys);
  // Where focus goes once the list re-renders: the new row's first field, or a row's action button
  // (the neighbour's after a removal, the moved row's own after a move).
  const focusNext = React.useRef<{ id: string | null; part: "first" | "action" } | null>(null);
  const [announcement, setAnnouncement] = React.useState("");

  const menu = rowActions === "menu";
  // The handle is the move of the buttons mode; the menu carries its own moves.
  const grip = reorderable && !menu;
  const single = columns.length === 1;
  // A cell's field shows its column heading only once the rows stack, and only when the list asks
  // for it: a one-column list and a list whose values name themselves keep the names read, unseen.
  const cellLabels = single || !stackedLabels ? "always" : "wide";
  const places = placesOf(columns);
  const leadCount = places.filter((place) => place === "lead").length;
  const template = [
    ...columns.map((column, index) =>
      column.width === "compact" ? compactTrack(index) : TRACKS[column.width ?? "fill"],
    ),
    track("--fl-end"),
    grip ? "auto" : null,
  ]
    .filter(Boolean)
    .join(" ");
  // The stacked row (narrow container): the leading compact columns, the first other column, the
  // end slots; the rest of the cells span the row on lines of their own.
  const stackedTemplate = [
    ...places.flatMap((place, index) => (place === "lead" ? [compactTrack(index)] : [])),
    "minmax(0, 1fr)",
    "auto",
    grip ? "auto" : null,
  ]
    .filter(Boolean)
    .join(" ");
  const trackStyle = {
    "--fl-columns": template,
    "--fl-stacked": stackedTemplate,
    "--fl-main-column": leadCount + 1,
    "--fl-end-column": leadCount + 2,
  } as React.CSSProperties;
  // The heading row comes with the first row and leaves with the last one; `hideHeadings` drops it
  // (the fields keep the column names as their accessible names).
  const shownCount = items.length + (creating ? 1 : 0);
  const hasHead = shownCount > 0 && !single && !hideHeadings;
  const head = usePartPresence<HTMLDivElement>({ present: hasHead, axis: "block" });
  const totalCells = renderTotals && items.length > 0 ? totalsOf(renderTotals(items)) : null;
  if (totalCells && totalCells.length !== columns.length)
    throw new Error(
      `FieldList: renderTotals returns ${totalCells.length} cells for ${columns.length} columns`,
    );
  // The totals come with the first row and leave with the last one, as the headings do.
  const totals = usePartPresence<HTMLDivElement>({ present: totalCells !== null, axis: "block" });
  // A total stands where its column's field puts its text: read from the first row's fields after
  // every render (the fields are the consumer's), one flag per column ("1" ends at the end edge).
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const [endColumns, setEndColumns] = React.useState("");
  React.useLayoutEffect(() => {
    if (!totalCells) return;
    const cells = bodyRef.current?.querySelector("[data-fl-cells]")?.children;
    setEndColumns(columns.map((_, column) => (endsText(cells?.[column]) ? "1" : "0")).join(""));
  });
  const atMax = max !== undefined && shownCount >= max;
  const atMin = items.length <= min;
  // A full list has nothing to offer: the add button closes up in place and comes back once a row
  // leaves (a limit the person should know is the consumer's `hint`).
  const canAdd = createItem !== undefined && !atMax;
  const addZone = usePartPresence<HTMLDivElement>({ present: canAdd, axis: "block" });

  const compactColumns = columns.flatMap((column, index) =>
    column.width === "compact" ? [index] : [],
  );
  const measureCompact = () => {
    const body = bodyRef.current;
    if (!body) return;
    const rowsOfCells = body.querySelectorAll(`.${styles.cells}`);
    for (const column of compactColumns) {
      let width = 0;
      for (const cells of rowsOfCells) {
        const cell = cells.children[column];
        if (cell) width = Math.max(width, cell.getBoundingClientRect().width);
      }
      body.style.setProperty(`--fl-compact-${column}`, width > 0 ? `${width}px` : null);
    }
    // A stacked row keeps its main field at its least width: the actions move down to the value
    // line when the field is too narrow beside them, the field takes a line of its own (under the
    // compact columns and the actions) when it is too narrow even without them. Read from widths
    // the choice does not change (the row, the compact tracks, the action buttons), so it never
    // flips back and forth.
    const row = body.querySelector<HTMLElement>(`.${styles.record}`);
    if (!row) {
      delete body.dataset.stack;
      return;
    }
    const style = getComputedStyle(row);
    const gap = Number.parseFloat(style.columnGap) || 0;
    let free =
      row.clientWidth -
      (Number.parseFloat(style.paddingInlineStart) || 0) -
      (Number.parseFloat(style.paddingInlineEnd) || 0) -
      gap * leadCount;
    for (const [index, place] of places.entries())
      if (place === "lead")
        free -= Number.parseFloat(body.style.getPropertyValue(`--fl-compact-${index}`)) || 0;
    let actions = 0;
    for (const end of row.querySelectorAll<HTMLElement>(
      `:scope > .${styles.end}, :scope > .${styles.grip}`,
    ))
      actions += end.getBoundingClientRect().width + gap;
    const least = mainMinWidth();
    const hasValue = places.includes("value");
    let stack: "actions" | "main" | null = null;
    if (free - actions < least) {
      if (hasValue && free >= least) stack = "actions";
      else if (leadCount > 0) stack = "main";
      else if (hasValue) stack = "actions";
    }
    if (stack) body.dataset.stack = stack;
    else delete body.dataset.stack;
  };
  React.useLayoutEffect(measureCompact);
  // The container crossing the stacking width, or a font arriving, changes the cells' widths.
  useResizeEffect(bodyRef, measureCompact);

  // Any change of the rows' set or order the presence asks to glide (a row added in the middle, a
  // move from the menu, a new order from the owner) glides the rows from where they stood; a plain
  // removal leaves it to the closing row, which the rows below follow. A drag or a handle's keys
  // is Dnd's own glide: that order change only takes the new baseline here.
  const [listElement, setListElement] = React.useState<HTMLElement | null>(null);
  const order = keys.join("\u0000");
  const dragOrder = React.useRef<string | null>(null);
  const flip = React.useRef({ presence: presence.settle, settle: 0 });
  if (flip.current.presence !== presence.settle) {
    flip.current.presence = presence.settle;
    if (order !== dragOrder.current) flip.current.settle += 1;
  }
  if (order !== dragOrder.current) dragOrder.current = null;
  useFlipList({
    container: listElement,
    nodes: flipRows,
    keyOf: flipRowKey,
    layoutKey: order,
    settle: flip.current.settle,
  });

  React.useLayoutEffect(() => {
    const target = focusNext.current;
    if (!target) return;
    focusNext.current = null;
    const row = target.id === null ? null : rows.current.get(target.id);
    if (!row) {
      addRef.current?.focus();
      return;
    }
    const element =
      target.part === "action"
        ? row.querySelector<HTMLElement>("[data-fl-action]")
        : row.querySelector<HTMLElement>(`[data-fl-cells] :is(${FOCUSABLE})`);
    (element ?? addRef.current)?.focus();
  });

  const rowName = (item: T, index: number) => {
    const text = getLabel?.(item).trim();
    return text
      ? formatLabel(labels.namedRow, { label: text })
      : formatLabel(labels.row, { index: index + 1 });
  };

  const isLocked = (item: T | undefined) => (item ? (getLocked?.(item) ?? false) : false);

  /** Focus follows an async add only while it is still with the add button (or nowhere). */
  const focusIsFree = () =>
    document.activeElement === document.body || document.activeElement === addRef.current;

  const append = (item: T, quiet: boolean) => {
    const id = getId(item);
    if (quiet) arrived.current.add(id);
    focusNext.current = { id, part: "first" };
    setItems((current) => [...current, item]);
  };

  const add = () => {
    if (!createItem || atMax || disabled || creating) return;
    const made = createItem();
    if (!isPromiseLike(made)) {
      append(made, false);
      return;
    }
    setCreating(true);
    (made as PromiseLike<T>).then(
      (item) => {
        if (!alive.current) return;
        const free = focusIsFree();
        setCreating(false);
        if (free) append(item, true);
        else {
          arrived.current.add(getId(item));
          setItems((current) => [...current, item]);
        }
      },
      () => {
        // Nothing was made: the placeholder goes and the add button is where focus was. The owner
        // says why through `error`, as for a refused `onValueChange`.
        if (!alive.current) return;
        if (focusIsFree()) focusNext.current = { id: null, part: "first" };
        setCreating(false);
      },
    );
  };

  const remove = (id: string) => {
    const index = items.findIndex((item) => getId(item) === id);
    if (index < 0 || atMin) return;
    const neighbour = items[index + 1] ?? items[index - 1];
    focusNext.current = {
      id: neighbour && (menu || !isLocked(neighbour)) ? getId(neighbour) : null,
      part: "action",
    };
    setItems((current) => current.filter((item) => getId(item) !== id));
  };

  const update = (id: string, patch: Partial<T>) =>
    setItems((current) =>
      current.map((item) => (getId(item) === id ? ({ ...item, ...patch } as T) : item)),
    );

  /**
   * Whether the row at `index` can trade places with its neighbour in `step`: both free, the
   * neighbour there. A pinned row holds its place, as it does under Dnd.
   */
  const canMove = (index: number, step: -1 | 1) =>
    reorderable &&
    !disabled &&
    !isLocked(items[index]) &&
    items[index + step] !== undefined &&
    !isLocked(items[index + step]);

  const move = (id: string, step: -1 | 1) => {
    const index = items.findIndex((item) => getId(item) === id);
    if (index < 0 || !canMove(index, step)) return;
    const item = items[index] as T;
    const before = step < 0 ? items[index - 1] : items[index + 2];
    focusNext.current = { id, part: "action" };
    setAnnouncement(
      formatLabel(labels.moved, {
        row: rowName(item, index),
        position: index + step + 1,
        total: items.length,
      }),
    );
    setItems((current) => moveBefore(current, id, before ? getId(before) : null, getId));
  };

  const renderRow = (item: T, index: number) => {
    const id = getId(item);
    const locked = isLocked(item);
    const name = rowName(item, index);
    const cells = cellsOf(
      renderItem(item, { index, update: (patch) => update(id, patch), remove: () => remove(id) }),
    );
    if (cells.length !== columns.length)
      throw new Error(
        `FieldList: row "${id}" renders ${cells.length} cells for ${columns.length} columns`,
      );
    // Every row has the same slots: a pinned row's remove is there, off, and says why.
    const reason = locked && !disabled ? getLockedReason?.(item) || labels.lockedReason : null;
    const removeOff = disabled || atMin || locked;
    let action: React.ReactNode;
    if (menu) {
      const canUp = canMove(index, -1);
      const canDown = canMove(index, 1);
      action = (
        <Dropdown.Root>
          <Dropdown.Trigger>
            <Button.Root
              variant="soft"
              tone="neutral"
              aria-label={formatLabel(labels.actions, { row: name })}
              aria-keyshortcuts={reorderable ? MOVE_KEYS : undefined}
              disabled={disabled}
              data-fl-action=""
              onKeyDown={(event) => {
                if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
                if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
                // Taken from the menu's own arrow keys: Alt+arrows move the row, they never open.
                event.preventDefault();
                move(id, event.key === "ArrowUp" ? -1 : 1);
              }}
            >
              <Button.Icon>
                <Icon name="action.more" />
              </Button.Icon>
            </Button.Root>
          </Dropdown.Trigger>
          <Dropdown.Content align="end">
            {reorderable ? (
              <>
                <Dropdown.Item disabled={!canUp} onSelect={() => move(id, -1)}>
                  <Dropdown.ItemIcon>
                    <Icon name="nav.chevronUp" />
                  </Dropdown.ItemIcon>
                  {labels.moveUp}
                  <Dropdown.ItemShortcut>Alt ↑</Dropdown.ItemShortcut>
                </Dropdown.Item>
                <Dropdown.Item disabled={!canDown} onSelect={() => move(id, 1)}>
                  <Dropdown.ItemIcon>
                    <Icon name="nav.chevronDown" />
                  </Dropdown.ItemIcon>
                  {labels.moveDown}
                  <Dropdown.ItemShortcut>Alt ↓</Dropdown.ItemShortcut>
                </Dropdown.Item>
                <Dropdown.Separator />
              </>
            ) : null}
            <Dropdown.Item tone="danger" disabled={removeOff} onSelect={() => remove(id)}>
              <Dropdown.ItemIcon>
                <Icon name="action.delete" />
              </Dropdown.ItemIcon>
              {labels.removeItem}
              {reason ? <Dropdown.ItemDescription>{reason}</Dropdown.ItemDescription> : null}
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      );
    } else {
      // The row's action takes the fill of the fields beside it: the row ends on a filled edge, as
      // it starts, and reads as one block; the menu button of `rowActions="menu"` does the same.
      // It deletes, so it is the danger trash (a disabled one greys out).
      const removeButton = (
        <Button.Root
          variant="soft"
          tone="danger"
          aria-label={formatLabel(labels.remove, { row: name })}
          disabled={removeOff}
          onClick={() => remove(id)}
          data-fl-action=""
        >
          <Button.Icon>
            <Icon name="action.delete" />
          </Button.Icon>
        </Button.Root>
      );
      action = reason ? (
        <Tooltip.Root>
          <Tooltip.Trigger>{removeButton}</Tooltip.Trigger>
          <Tooltip.Content>{reason}</Tooltip.Content>
        </Tooltip.Root>
      ) : (
        removeButton
      );
    }
    const content = (
      <>
        <div className={styles.cells} data-fl-cells="">
          {cells.map((cell, column) => {
            const heading = columns[column];
            return (
              <FieldCellContext
                // biome-ignore lint/suspicious/noArrayIndexKey: a cell is its column
                key={column}
                value={cellValue(heading?.label ?? "", cellLabels, Boolean(heading?.required))}
              >
                <div
                  className={styles.cell}
                  data-width={heading?.width ?? "fill"}
                  data-place={places[column]}
                >
                  {cell}
                </div>
              </FieldCellContext>
            );
          })}
        </div>
        <span className={styles.end}>{action}</span>
        {/* The grip ends the row, after the remove button: Tab reaches the fields and the remove
            button first; a pinned row's handle turns into Dnd's lock in the same box. */}
        {grip ? (
          <GripBox>
            <Dnd.Handle
              aria-label={formatLabel(labels.reorder, { row: name })}
              disabled={disabled}
            />
          </GripBox>
        ) : null}
      </>
    );
    const rowProps = {
      // Registers the row (focus after an add, a remove or a move); a removed row leaves in place
      // and the rows below glide up into its room.
      ref: (node: HTMLElement | null) => {
        if (!node) return;
        rows.current.set(id, node);
        return () => {
          rows.current.delete(id);
          if (presence.leaving.delete(id)) leaveInPlace(node, "block");
        };
      },
      // An added row rises in once: the class stays until the list changes again.
      className: cx(
        fieldTierClass,
        styles.row,
        styles.record,
        // A list on its own fill draws lines between its rows; a plain one only once they stack
        // (its one-line rows are parted by air: FieldList.module.css).
        hairline.between,
        presence.entering.has(id) && !arrived.current.has(id) && enterMotion.enter,
      ),
      style: trackStyle,
      "data-size": size,
      "data-fl-row": id,
      "data-locked": locked || undefined,
      "data-single": single || undefined,
      "data-unlabelled": cellLabels === "always" || undefined,
    };
    return grip ? (
      <Dnd.SortableItem key={id} id={id} locked={locked} {...rowProps}>
        {content}
      </Dnd.SortableItem>
    ) : (
      <li key={id} {...rowProps}>
        {content}
      </li>
    );
  };

  const sheet = (
    <div
      className={styles.sheet}
      data-variant={variant}
      data-depth={surface ? depth : undefined}
      data-empty={shownCount === 0 || undefined}
    >
      {hasHead ? (
        <div
          ref={head.ref}
          className={cx(fieldTierClass, styles.row, styles.head, head.className)}
          style={trackStyle}
          data-size={size}
          aria-hidden="true"
        >
          <div className={styles.cells}>
            {columns.map((column, index) => (
              <Label.Root
                // biome-ignore lint/suspicious/noArrayIndexKey: columns are positional
                key={index}
                size={size}
                required={column.required}
                disabled={disabled}
                secondary
                className={styles.heading}
                data-width={column.width ?? "fill"}
              >
                {column.label}
              </Label.Root>
            ))}
          </div>
          <span />
          {grip ? <GripBox /> : null}
        </div>
      ) : null}
      {grip ? (
        <Dnd.Root>
          <Dnd.Sortable
            role="list"
            as="ol"
            handle
            disabled={disabled}
            className={styles.rows}
            {...listName}
            items={items}
            getId={getId}
            getLabel={(item) => rowName(item, items.indexOf(item))}
            ref={setListElement}
            onReorder={(id, beforeId) =>
              setItems((current) => {
                const next = moveBefore(current, id, beforeId, getId);
                dragOrder.current = next.map(getId).join("\u0000");
                return next;
              })
            }
            renderItem={renderRow}
          />
        </Dnd.Root>
      ) : (
        <ol
          ref={setListElement}
          // biome-ignore lint/a11y/noRedundantRoles: `list-style: none` drops the list semantics in WebKit; the role keeps them
          role="list"
          className={styles.rows}
          {...listName}
        >
          {items.map(renderRow)}
        </ol>
      )}
      {creating ? (
        // The row being made: the cells' geometry in placeholders, replaced in place by the item.
        <ol className={styles.rows} aria-hidden="true" data-fl-creating="">
          <li
            className={cx(fieldTierClass, styles.row, styles.record, hairline.between)}
            style={trackStyle}
            data-size={size}
            data-single={single || undefined}
            data-unlabelled={cellLabels === "always" || undefined}
          >
            <div className={styles.cells}>
              {columns.map((column, index) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: a cell is its column
                  key={index}
                  className={styles.cell}
                  data-width={column.width ?? "fill"}
                  data-place={places[index]}
                >
                  <Skeleton shape="control" />
                </div>
              ))}
            </div>
            <span className={styles.end} />
            {grip ? <GripBox /> : null}
          </li>
        </ol>
      ) : null}
      {totalCells ? (
        // biome-ignore lint/a11y/useSemanticElements: a row of figures, not a form fieldset
        <div
          ref={totals.ref}
          role="group"
          aria-label={labels.totals}
          className={cx(fieldTierClass, styles.row, styles.totals, hairline.top, totals.className)}
          style={trackStyle}
          data-size={size}
        >
          <div className={styles.cells}>
            {totalCells.map((total, column) => {
              const heading = columns[column];
              const shown = hasContent(total);
              return (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: a total is its column
                  key={column}
                  className={cx(styles.cell, styles.total)}
                  data-width={heading?.width ?? "fill"}
                  data-empty={(!shown && column > 0) || undefined}
                  data-align={endColumns[column] === "1" ? "end" : undefined}
                >
                  {shown ? (
                    <>
                      {/* Read on wide rows, where the heading names the column; shown once
                          the rows stack. */}
                      <span className={cx(visuallyHiddenClass, styles.totalName)}>
                        {heading?.label}
                      </span>
                      <span className={styles.totalValue}>{total}</span>
                    </>
                  ) : column === 0 ? (
                    // The group's name says it to screen readers.
                    <span className={styles.totalsLabel} aria-hidden="true">
                      {labels.totals}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
          {/* The end and grip columns stay as wide as a row's action button and grip, so the
              totals end where the fields do. */}
          <span className={cx(styles.end, styles.totalsEnd)} />
          {grip ? <GripBox /> : null}
        </div>
      ) : null}
    </div>
  );

  return tier.provide(
    <DisabledProvider disabled={disabled}>
      <FieldFrame
        {...rest}
        ref={ref}
        size={size}
        ids={ids}
        label={label}
        hint={hint}
        hintTone={hintTone}
        error={error}
        disabled={disabled}
        optionalLabel=""
        group
        className={cx(styles.root, className)}
        {...toDataAttributes({ disabled: disabled || undefined })}
      >
        <div ref={bodyRef} className={styles.body}>
          {surface ? <SurfaceDepthProvider value={depth}>{sheet}</SurfaceDepthProvider> : sheet}
          {canAdd ? (
            <div ref={addZone.ref} className={cx(styles.add, addZone.className)}>
              <Button.Root
                ref={addRef}
                variant="soft"
                tone="neutral"
                disabled={disabled}
                onClick={add}
              >
                <Button.Icon>
                  <Icon name="action.add" />
                </Button.Icon>
                {addLabel}
              </Button.Root>
            </div>
          ) : null}
          {menu && reorderable ? (
            <VisuallyHidden live="polite">{announcement}</VisuallyHidden>
          ) : null}
        </div>
      </FieldFrame>
    </DisabledProvider>,
  );
}
FieldList.displayName = "FieldList";

const cellValues = new Map<string, FieldCell>();

/** One stable context value per heading, so the cells do not re-render the fields for nothing. */
function cellValue(label: string, hidden: FieldCell["hidden"], required: boolean): FieldCell {
  const key = `${hidden}:${required ? "r" : "o"}:${label}`;
  let value = cellValues.get(key);
  if (!value) {
    value = { label, hidden, required };
    cellValues.set(key, value);
  }
  return value;
}
