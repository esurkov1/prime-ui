import * as React from "react";
import { Button } from "@/components/button/Button";
import { Dnd, DndLock, moveBefore } from "@/components/dnd/Dnd";
import type { HintTone } from "@/components/hint/Hint";
import { Label } from "@/components/label/Label";
import { visuallyHiddenClass } from "@/components/visually-hidden/VisuallyHidden";
import { useControllableState } from "@/hooks/useControllableState";
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
import textRole from "@/internal/textRole.module.css";
import { isPromiseLike, usePendingChanges } from "@/internal/usePendingChanges";

import styles from "./FieldList.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FieldListLabels = {
  /** `aria-label` of a row's remove button; `{row}` is the row's name. */
  remove: string;
  /** `aria-label` of a row's drag handle (`reorderable`); `{row}` is the row's name. */
  reorder: string;
  /** Name of a row without `getLabel` text; `{index}` counts from 1. */
  row: string;
  /** Name of a row with `getLabel` text; `{label}` is that text. */
  namedRow: string;
  /** Spoken name of the lock on a `getLocked` row of a list without `reorderable`. */
  locked: string;
  /** Text beside the disabled add button once the list holds `max` rows; `{max}` is the limit. */
  maxReached: string;
  /** Name of the totals row (`renderTotals`), shown in its first cell when that has no total. */
  totals: string;
};

export const FIELD_LIST_LABELS: FieldListLabels = {
  remove: "Удалить {row}",
  reorder: "Переместить {row}",
  row: "строку {index}",
  namedRow: "«{label}»",
  locked: "Закреплена",
  maxReached: "Не больше {max}",
  totals: "Итого",
};

/** Width of a column: the same track in the heading row and in every row. */
export type FieldListColumnWidth = "fill" | "compact" | "xs" | "s" | "m";

export type FieldListColumn = {
  /** Column heading, shown once above the rows; it names the field of this column in every row. */
  label: string;
  /**
   * `fill` (default) shares the free width; `compact` fits an icon-only control (an icon Select,
   * a swatch button, a checkbox); `xs` a number of a few digits (a share, a percent); `s` a short
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

export type FieldListProps<T extends object> = Omit<FieldRootDomProps, "onChange"> & {
  value?: readonly T[];
  defaultValue?: readonly T[];
  onValueChange?: (value: T[]) => void | Promise<void>;
  getId: (item: T) => string;
  columns: readonly FieldListColumn[];
  renderItem: (item: T, row: FieldListRow<T>) => React.ReactNode;
  renderTotals?: (items: readonly T[]) => React.ReactNode;
  createItem?: () => T;
  addLabel?: string;
  getLabel?: (item: T) => string;
  getLocked?: (item: T) => boolean;
  reorderable?: boolean;
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
 * Track of each width. The end track fits the remove button, the grip track after it (`auto`) its
 * `xs` box; every row and the heading row share the same list (`--fl-columns`).
 */
const TRACKS: Record<FieldListColumnWidth, string> = {
  fill: "minmax(0, 1fr)",
  compact: track("--fl-compact"),
  xs: track("--fl-xs"),
  s: track("--fl-s"),
  m: track("--fl-m"),
};

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

/** The last change wins: the list a pending `onValueChange` was called with. */
function takeNext<V>(_current: V, next: V): V {
  return next;
}

const FOCUSABLE = "input, textarea, select, button, [tabindex]:not([tabindex='-1'])";

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

// ─── Root ─────────────────────────────────────────────────────────────────────

/**
 * An editable list of records of the same shape: one row per record, the column headings shown
 * once above the rows, a remove button per row, an add button under them, an optional handle to
 * reorder and pinned rows. In a narrow container the rows stack into blocks and each field shows
 * its own label.
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
  reorderable = false,
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
  const setItems = (edit: (current: readonly T[]) => T[]) => {
    const next = edit(latest.current);
    latest.current = next;
    const outcome = onValueChange?.(next);
    if (!isPromiseLike(outcome)) {
      setStored(next);
      return;
    }
    changes.track(next, outcome, { onResolve: () => setStored(next) });
  };
  const ids = useFieldFrame(undefined, { label, hint, error });
  // The list is named by the visible label, else by the consumer's `aria-labelledby` / `aria-label`,
  // and described by the list's hint and error, which speak for every row.
  const listName = {
    "aria-labelledby": ids.labelledBy ?? ariaLabelledBy,
    "aria-label": ids.labelledBy || ariaLabelledBy ? undefined : ariaLabel,
    "aria-describedby": ids.describedBy,
    "aria-busy": busy || undefined,
  };
  const addRef = React.useRef<HTMLButtonElement>(null);
  const rows = React.useRef(new Map<string, HTMLElement>());
  // Rows the data adds rise in; rows it takes out close up in place (the kit's keyed list presence).
  const presence = useListPresence(items.map(getId));
  // Where focus goes once the list re-renders: the new row's first field, or the neighbour's remove.
  const focusNext = React.useRef<{ id: string | null; part: "first" | "remove" } | null>(null);

  const grip = reorderable || (getLocked !== undefined && items.some(getLocked));
  const template = [
    ...columns.map((column) => TRACKS[column.width ?? "fill"]),
    track("--fl-end"),
    grip ? "auto" : null,
  ]
    .filter(Boolean)
    .join(" ");
  const single = columns.length === 1;
  // The heading row comes with the first row and leaves with the last one.
  const hasHead = items.length > 0 && !single;
  const head = usePartPresence<HTMLDivElement>({ present: hasHead, axis: "block" });
  const totalCells = renderTotals && items.length > 0 ? totalsOf(renderTotals(items)) : null;
  if (totalCells && totalCells.length !== columns.length)
    throw new Error(
      `FieldList: renderTotals returns ${totalCells.length} cells for ${columns.length} columns`,
    );
  // The totals come with the first row and leave with the last one, as the headings do.
  const totals = usePartPresence<HTMLDivElement>({ present: totalCells !== null, axis: "block" });
  const atMax = max !== undefined && items.length >= max;
  const atMin = items.length <= min;

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
      target.part === "remove"
        ? row.querySelector<HTMLElement>("[data-fl-remove]")
        : row.querySelector<HTMLElement>(`[data-fl-cells] :is(${FOCUSABLE})`);
    (element ?? addRef.current)?.focus();
  });

  const rowName = (item: T, index: number) => {
    const text = getLabel?.(item).trim();
    return text
      ? formatLabel(labels.namedRow, { label: text })
      : formatLabel(labels.row, { index: index + 1 });
  };

  const add = () => {
    if (!createItem || atMax || disabled) return;
    const item = createItem();
    const id = getId(item);
    focusNext.current = { id, part: "first" };
    setItems((current) => [...current, item]);
  };

  const remove = (id: string) => {
    const index = items.findIndex((item) => getId(item) === id);
    if (index < 0 || atMin) return;
    const neighbour = items[index + 1] ?? items[index - 1];
    focusNext.current = {
      id: neighbour && !getLocked?.(neighbour) ? getId(neighbour) : null,
      part: "remove",
    };
    setItems((current) => current.filter((item) => getId(item) !== id));
  };

  const update = (id: string, patch: Partial<T>) =>
    setItems((current) =>
      current.map((item) => (getId(item) === id ? ({ ...item, ...patch } as T) : item)),
    );

  const renderRow = (item: T, index: number) => {
    const id = getId(item);
    const locked = getLocked?.(item) ?? false;
    const name = rowName(item, index);
    const cells = cellsOf(
      renderItem(item, { index, update: (patch) => update(id, patch), remove: () => remove(id) }),
    );
    if (cells.length !== columns.length)
      throw new Error(
        `FieldList: row "${id}" renders ${cells.length} cells for ${columns.length} columns`,
      );
    const content = (
      <>
        <div className={styles.cells} data-fl-cells="">
          {cells.map((cell, column) => {
            const heading = columns[column];
            return (
              <FieldCellContext
                // biome-ignore lint/suspicious/noArrayIndexKey: a cell is its column
                key={column}
                value={cellValue(heading?.label ?? "", single, Boolean(heading?.required))}
              >
                <div className={styles.cell} data-width={heading?.width ?? "fill"}>
                  {cell}
                </div>
              </FieldCellContext>
            );
          })}
        </div>
        <span className={styles.end}>
          {locked ? null : (
            <Button.Root
              variant="ghost"
              tone="neutral"
              aria-label={formatLabel(labels.remove, { row: name })}
              disabled={disabled || atMin}
              onClick={() => remove(id)}
              data-fl-remove=""
            >
              <Button.Icon>
                <Icon name="action.remove" />
              </Button.Icon>
            </Button.Root>
          )}
        </span>
        {/* The grip ends the row, after the remove button: Tab reaches the fields and the remove
            button first; a pinned row's lock takes the same box. */}
        {grip ? (
          <GripBox>
            {reorderable ? (
              <Dnd.Handle
                aria-label={formatLabel(labels.reorder, { row: name })}
                disabled={disabled}
              />
            ) : locked ? (
              <DndLock aria-label={labels.locked} />
            ) : null}
          </GripBox>
        ) : null}
      </>
    );
    const rowProps = {
      // Registers the row (focus after an add or a remove); a removed row leaves in place and the
      // rows below glide up into its room.
      ref: (node: HTMLElement | null) => {
        if (!node) return;
        rows.current.set(id, node);
        return () => {
          rows.current.delete(id);
          if (presence.leaving.delete(id)) leaveInPlace(node, "block");
        };
      },
      // An added row rises in once: the class stays until the list changes again.
      className: cx(fieldTierClass, styles.row, presence.entering.has(id) && enterMotion.enter),
      style: { "--fl-columns": template } as React.CSSProperties,
      "data-size": size,
      "data-locked": locked || undefined,
    };
    return reorderable ? (
      <Dnd.SortableItem key={id} id={id} locked={locked} {...rowProps}>
        {content}
      </Dnd.SortableItem>
    ) : (
      <li key={id} {...rowProps}>
        {content}
      </li>
    );
  };

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
        <div className={styles.body}>
          {hasHead ? (
            <div
              ref={head.ref}
              className={cx(fieldTierClass, styles.row, styles.head, head.className)}
              style={{ "--fl-columns": template } as React.CSSProperties}
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
                  >
                    {column.label}
                  </Label.Root>
                ))}
              </div>
              <span />
              {grip ? <GripBox /> : null}
            </div>
          ) : null}
          {reorderable ? (
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
                onReorder={(id, beforeId) =>
                  setItems((current) => moveBefore(current, id, beforeId, getId))
                }
                renderItem={renderRow}
              />
            </Dnd.Root>
          ) : (
            <ol
              // biome-ignore lint/a11y/noRedundantRoles: `list-style: none` drops the list semantics in WebKit; the role keeps them
              role="list"
              className={styles.rows}
              {...listName}
            >
              {items.map(renderRow)}
            </ol>
          )}
          {totalCells ? (
            // biome-ignore lint/a11y/useSemanticElements: a row of figures, not a form fieldset
            <div
              ref={totals.ref}
              role="group"
              aria-label={labels.totals}
              className={cx(
                fieldTierClass,
                styles.row,
                styles.totals,
                hairline.top,
                totals.className,
              )}
              style={{ "--fl-columns": template } as React.CSSProperties}
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
              {/* The end and grip columns stay as wide as a row's remove button and grip, so the
                  totals end where the fields do. */}
              <span className={cx(styles.end, styles.totalsEnd)} />
              {grip ? <GripBox /> : null}
            </div>
          ) : null}
          {createItem ? (
            <div className={styles.add}>
              <Button.Root
                ref={addRef}
                variant="soft"
                tone="neutral"
                disabled={disabled || atMax}
                onClick={add}
              >
                <Button.Icon>
                  <Icon name="action.add" />
                </Button.Icon>
                {addLabel}
              </Button.Root>
              {atMax && max !== undefined ? (
                <span className={cx(textRole.caption, styles.limit)}>
                  {formatLabel(labels.maxReached, { max })}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </FieldFrame>
    </DisabledProvider>,
  );
}
FieldList.displayName = "FieldList";

const cellValues = new Map<string, FieldCell>();

/** One stable context value per heading, so the cells do not re-render the fields for nothing. */
function cellValue(label: string, single: boolean, required: boolean): FieldCell {
  const key = `${single ? "1" : "n"}:${required ? "r" : "o"}:${label}`;
  let value = cellValues.get(key);
  if (!value) {
    value = { label, hidden: single ? "always" : "wide", required };
    cellValues.set(key, value);
  }
  return value;
}
