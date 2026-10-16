import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Dnd } from "@/components/dnd/Dnd";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { Icon } from "@/icons";
import { formatLabel } from "@/internal/formatLabel";
import { nodeText } from "@/internal/nodeText";
import type { ControlSize } from "@/internal/states";

import type { DataTableLabels } from "./DataTable";
import styles from "./DataTable.module.css";
import type { DataTableColumn } from "./types";

type Column = DataTableColumn<never>;

/** The strings of the column chooser, in the table's `labels` and in `DataTableColumnsMenu`. */
export type DataTableColumnsMenuLabels = Pick<
  DataTableLabels,
  "columns" | "showColumns" | "showAllColumns" | "resetColumnOrder" | "reorderColumn"
>;

/** The chooser reorders columns too (`columnOrder`). */
export type ColumnsMenuReorder = {
  /** Columns that hold their place: a lock instead of the grip. */
  locked: ReadonlySet<string>;
  onReorder: (id: string, beforeId: string | null) => void;
  /** Back to the order of `columns`; null while that is the order. */
  reset: (() => void) | null;
};

type ColumnsMenuProps = {
  /** Every column, hidden ones included, in table order. */
  columns: Column[];
  hidden: ReadonlySet<string>;
  setHidden: (hidden: string[]) => void;
  reorder: ColumnsMenuReorder | null;
  labels: DataTableColumnsMenuLabels;
  /** The tier of the trigger and the menu. */
  size: ControlSize;
  /**
   * `icon`: the icon-only ghost trigger in the head of the row-actions column (`columnsMenu`);
   * `button`: the labelled soft trigger with the count of shown columns, for the page's tools.
   */
  trigger: "icon" | "button";
  /** The labelled trigger's own attributes, class and ref (`DataTableColumnsMenu`). */
  triggerProps?: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    ref?: React.Ref<HTMLButtonElement>;
  };
};

const columnId = (column: Column) => column.id;
/** What a column is called by its grip and in the move announcements. */
const columnLabel = (column: Column) => nodeText(column.header) || column.id;
const MOVE_KEYS = "Alt+ArrowUp Alt+ArrowDown";

/** Columns that hold their place in the chooser: `reorderable: false` and the row actions. */
export function lockedInChooser(columns: readonly Column[]): Set<string> {
  return new Set(
    columns
      .filter((column) => column.reorderable === false || column.hideHeader)
      .map((column) => column.id),
  );
}

/**
 * The column chooser: a trigger (`trigger`) opening a Dropdown with a «Показывать» group of check
 * items, one per column, and «Показать все». A column with `hideable: false` stays checked and
 * disabled, and the last visible column cannot be hidden. With `reorder` the items are a
 * Dnd.Sortable list: a grip ends each item (a lock on a column that holds its place), Alt + ↑ / ↓ on
 * the focused item moves it, and «Исходный порядок» puts the order of `columns` back.
 */
export function ColumnsMenu({
  columns,
  hidden,
  setHidden,
  reorder,
  labels,
  size,
  trigger,
  triggerProps,
}: ColumnsMenuProps) {
  const isShown = (column: Column) => column.hideable === false || !hidden.has(column.id);
  const shown = columns.filter(isShown).length;
  const hiddenIds = columns.filter((column) => !isShown(column)).map((column) => column.id);
  const name = formatLabel(labels.columns, { shown, total: columns.length });
  const contentRef = React.useRef<HTMLDivElement>(null);
  /** The item a keyboard move carried: it keeps the focus once it is drawn in its new place. */
  const refocus = React.useRef<string | null>(null);

  React.useLayoutEffect(() => {
    const id = refocus.current;
    if (id === null) return;
    refocus.current = null;
    const item = contentRef.current?.querySelector<HTMLElement>(
      `[data-dnd-item="${CSS.escape(id)}"] [role="menuitemcheckbox"]`,
    );
    if (item && document.activeElement !== item) item.focus({ focusVisible: true } as FocusOptions);
  });

  const setShown = (id: string, visible: boolean) => {
    const next = [...hidden].filter((item) => item !== id);
    setHidden(visible ? next : [...next, id]);
  };

  const checkItem = (column: Column, moves = false) => {
    const visible = isShown(column);
    return (
      <Dropdown.CheckboxItem
        key={column.id}
        checked={visible}
        disabled={column.hideable === false || (visible && shown === 1)}
        onCheckedChange={(next) => setShown(column.id, next)}
        className={reorder ? styles.chooserCheck : undefined}
        aria-keyshortcuts={moves ? MOVE_KEYS : undefined}
      >
        {column.header}
      </Dropdown.CheckboxItem>
    );
  };

  const onReorder = (id: string, beforeId: string | null) => {
    if (!reorder) return;
    // A move from the keyboard: the focused item keeps the focus where it lands.
    const focused = document.activeElement;
    const item = focused?.closest<HTMLElement>("[data-dnd-item]");
    if (item?.dataset.dndItem === id && focused?.getAttribute("role") === "menuitemcheckbox") {
      refocus.current = id;
    }
    reorder.onReorder(id, beforeId);
  };

  const opener =
    trigger === "icon" ? (
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Dropdown.Trigger>
            <Button.Root variant="ghost" tone="neutral" size={size} aria-label={name}>
              <Button.Icon>
                <Icon name="view.columns" />
              </Button.Icon>
            </Button.Root>
          </Dropdown.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Content>{name}</Tooltip.Content>
      </Tooltip.Root>
    ) : (
      <Dropdown.Trigger>
        {/* Named by its text and count as read aloud: «Колонки 10», not «Колонки10». */}
        <Button.Root
          aria-label={`${name} ${shown}`}
          {...triggerProps}
          variant="soft"
          tone="neutral"
          size={size}
        >
          <Button.Icon>
            <Icon name="view.columns" />
          </Button.Icon>
          {name}
          <Badge.Root>{shown}</Badge.Root>
        </Button.Root>
      </Dropdown.Trigger>
    );

  const menu = (
    <Dropdown.Root>
      {opener}
      <Dropdown.Content
        ref={contentRef}
        side="bottom"
        align={trigger === "icon" ? "end" : "auto"}
        size={size}
      >
        <Dropdown.Group label={labels.showColumns}>
          {reorder ? (
            <Dnd.Sortable
              items={columns}
              getId={columnId}
              getLabel={columnLabel}
              onReorder={onReorder}
              handle
              className={styles.chooserList}
              renderItem={(column) => {
                const locked = reorder.locked.has(column.id);
                return (
                  <Dnd.SortableItem id={column.id} locked={locked} className={styles.chooserItem}>
                    {checkItem(column, !locked)}
                    {/* The menu moves focus between its items: the grip is for the pointer (a
                        press leaves the focus where it was: the lifted item leaves the layout),
                        the item itself takes Alt + ↑ / ↓. */}
                    <Dnd.Handle
                      tabIndex={-1}
                      onMouseDown={(event) => event.preventDefault()}
                      aria-label={formatLabel(labels.reorderColumn, { label: columnLabel(column) })}
                    />
                  </Dnd.SortableItem>
                );
              }}
            />
          ) : (
            columns.map((column) => checkItem(column))
          )}
        </Dropdown.Group>
        <Dropdown.Separator />
        <Dropdown.Item disabled={hiddenIds.length === 0} onSelect={() => setHidden([])}>
          {labels.showAllColumns}
        </Dropdown.Item>
        {reorder ? (
          <Dropdown.Item disabled={reorder.reset === null} onSelect={reorder.reset ?? undefined}>
            {labels.resetColumnOrder}
          </Dropdown.Item>
        ) : null}
      </Dropdown.Content>
    </Dropdown.Root>
  );
  // The chooser outside a table brings the drag session its list needs (inside one, the table's).
  return reorder ? <Dnd.Root>{menu}</Dnd.Root> : menu;
}
