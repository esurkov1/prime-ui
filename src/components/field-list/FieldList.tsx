import * as React from "react";

import { Button } from "@/components/button/Button";
import { Dnd, DndLock, moveBefore } from "@/components/dnd/Dnd";
import { Label } from "@/components/label/Label";
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
import { useLabels } from "@/internal/labels";
import { leaveInPlace } from "@/internal/leaveInPlace";
import { useListPresence } from "@/internal/listPresence";
import { usePartPresence } from "@/internal/partPresence";
import type { ControlSize } from "@/internal/states";
import textRole from "@/internal/textRole.module.css";

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
};

export const FIELD_LIST_LABELS: FieldListLabels = {
  remove: "Удалить {row}",
  reorder: "Переместить {row}",
  row: "строку {index}",
  namedRow: "«{label}»",
  locked: "Закреплена",
  maxReached: "Не больше {max}",
};

/** Width of a column: the same track in the heading row and in every row. */
export type FieldListColumnWidth = "fill" | "compact" | "s" | "m";

export type FieldListColumn = {
  /** Column heading, shown once above the rows; it names the field of this column in every row. */
  label: string;
  /**
   * `fill` (default) shares the free width; `compact` fits an icon-only control (an icon Select,
   * a swatch button, a checkbox); `s` a short value (a quantity, a code); `m` an amount or a date.
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
  onValueChange?: (value: T[]) => void;
  getId: (item: T) => string;
  columns: readonly FieldListColumn[];
  renderItem: (item: T, row: FieldListRow<T>) => React.ReactNode;
  createItem?: () => T;
  addLabel?: string;
  getLabel?: (item: T) => string;
  getLocked?: (item: T) => boolean;
  reorderable?: boolean;
  min?: number;
  max?: number;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  disabled?: boolean;
  size?: ControlSize;
  labels?: Partial<FieldListLabels>;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** A track the row stylesheet sizes (`FieldList.module.css`), read by its name. */
const track = (name: `--fl-${string}`) => `var(${name})`;

/**
 * Track of each width. The lead track (`auto`) fits its `xs` box, the end track the remove button;
 * every row and the heading row share the same list (`--fl-columns`).
 */
const TRACKS: Record<FieldListColumnWidth, string> = {
  fill: "minmax(0, 1fr)",
  compact: track("--fl-compact"),
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

const FOCUSABLE = "input, textarea, select, button, [tabindex]:not([tabindex='-1'])";

/** The tier of the lead column: the handle and the lock are `xs` controls on every row tier. */
const LEAD_TIER: ControlSize = "xs";

/** The lead cell of a row (handle or lock) or of the heading row (empty): one `xs` box wide. */
function LeadBox({ children }: { children?: React.ReactNode }) {
  return (
    <span className={cx(fieldTierClass, styles.lead)} data-size={LEAD_TIER}>
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
  createItem,
  addLabel,
  getLabel,
  getLocked,
  reorderable = false,
  min = 0,
  max,
  label,
  hint,
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
  const [items, setItems] = useControllableState<readonly T[]>({
    value: valueProp,
    defaultValue: defaultValue ?? [],
    onChange: onValueChange as ((next: readonly T[]) => void) | undefined,
  });
  const ids = useFieldFrame(undefined, { label, hint, error });
  // The list is named by the visible label, else by the consumer's `aria-labelledby` / `aria-label`,
  // and described by the list's hint and error, which speak for every row.
  const listName = {
    "aria-labelledby": ids.labelledBy ?? ariaLabelledBy,
    "aria-label": ids.labelledBy || ariaLabelledBy ? undefined : ariaLabel,
    "aria-describedby": ids.describedBy,
  };
  const addRef = React.useRef<HTMLButtonElement>(null);
  const rows = React.useRef(new Map<string, HTMLElement>());
  // Rows the data adds rise in; rows it takes out close up in place (the kit's keyed list presence).
  const presence = useListPresence(items.map(getId));
  // Where focus goes once the list re-renders: the new row's first field, or the neighbour's remove.
  const focusNext = React.useRef<{ id: string | null; part: "first" | "remove" } | null>(null);

  const lead = reorderable || (getLocked !== undefined && items.some(getLocked));
  const template = [
    lead ? "auto" : null,
    ...columns.map((column) => TRACKS[column.width ?? "fill"]),
    track("--fl-end"),
  ]
    .filter(Boolean)
    .join(" ");
  const single = columns.length === 1;
  // The heading row comes with the first row and leaves with the last one.
  const hasHead = items.length > 0 && !single;
  const head = usePartPresence<HTMLDivElement>({ present: hasHead, axis: "block" });
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
        {lead ? (
          <LeadBox>
            {reorderable ? (
              <Dnd.Handle
                aria-label={formatLabel(labels.reorder, { row: name })}
                disabled={disabled}
              />
            ) : locked ? (
              <DndLock aria-label={labels.locked} />
            ) : null}
          </LeadBox>
        ) : null}
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
              {lead ? <LeadBox /> : null}
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
          {createItem ? (
            <div
              className={cx(styles.add, lead && cx(fieldTierClass, styles.addIndented))}
              data-size={lead ? LEAD_TIER : undefined}
            >
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
