import type * as React from "react";

import { Button } from "@/components/button/Button";
import { Dnd } from "@/components/dnd/Dnd";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { Icon } from "@/icons";
import { formatLabel } from "@/internal/formatLabel";
import { nodeText } from "@/internal/nodeText";
import type { ControlSize } from "@/internal/states";
import {
  toggleHidden,
  ViewMenuButton,
  ViewMenuContent,
  type ViewMenuEntry,
  ViewMenuItems,
} from "@/internal/ViewMenu";
import { SortableViewMenuItems } from "@/internal/viewMenuSortable";

import type { DataTableLabels } from "./DataTable";
import type { DataTableColumn } from "./types";

type Column = DataTableColumn<never>;

/** The strings of the chooser's menu, shared by the table's `labels` and `DataTableColumnsMenu`. */
type ColumnsMenuLabels = Pick<DataTableLabels, "showColumns" | "resetColumns" | "reorderColumn">;

/** The chooser reorders columns too (`columnOrder`). */
export type ColumnsMenuReorder = {
  /** Columns that hold their place: a lock instead of the grip. */
  locked: ReadonlySet<string>;
  onReorder: (id: string, beforeId: string | null) => void;
};

type ColumnsMenuProps = {
  /** Every column, hidden ones included, in table order. */
  columns: Column[];
  hidden: ReadonlySet<string>;
  setHidden: (hidden: string[]) => void;
  reorder: ColumnsMenuReorder | null;
  /** Back to the default view (hidden columns and order); null while the view is the default. */
  reset: (() => void) | null;
  /** The trigger's name: the icon's tooltip (`{shown}`, `{total}`), or the labelled button's text. */
  name: string;
  labels: ColumnsMenuLabels;
  /** The tier of the trigger and the menu. */
  size: ControlSize;
  /**
   * `icon`: the icon-only ghost trigger in the head of the row-actions column (`columnsMenu`);
   * `button`: the kit's view trigger (`ViewMenuButton`) with the count of shown columns, for the
   * page's tools.
   */
  trigger: "icon" | "button";
  /** The labelled trigger's own attributes, class and ref (`DataTableColumnsMenu`). */
  triggerProps?: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    ref?: React.Ref<HTMLButtonElement>;
  };
};

/** What a column is called by its grip and in the move announcements. */
const columnLabel = (column: Column) => nodeText(column.header) || column.id;

/** Columns that hold their place in the chooser: `reorderable: false` and the row actions. */
export function lockedInChooser(columns: readonly Column[]): Set<string> {
  return new Set(
    columns
      .filter((column) => column.reorderable === false || column.hideHeader)
      .map((column) => column.id),
  );
}

/**
 * The column chooser: a trigger (`trigger`) opening the kit's view menu (`ViewMenuContent`): a
 * «В таблице» group of check items, one per column, and «По умолчанию» while the view differs from
 * the default. A column with `hideable: false` stays checked and disabled, and the last visible
 * column cannot be hidden. With `reorder` the items are a Dnd.Sortable list: a grip ends each item
 * (a lock on a column that holds its place) and Alt + ↑ / ↓ on the focused item moves it.
 */
export function ColumnsMenu({
  columns,
  hidden,
  setHidden,
  reorder,
  reset,
  name: nameTemplate,
  labels,
  size,
  trigger,
  triggerProps,
}: ColumnsMenuProps) {
  const isShown = (column: Column) => column.hideable === false || !hidden.has(column.id);
  const shown = columns.filter(isShown).length;
  const name = formatLabel(nameTemplate, { shown, total: columns.length });
  const toggle = (id: string, visible: boolean) =>
    setHidden(toggleHidden([...hidden], id, visible));
  const entries: ViewMenuEntry[] = columns.map((column) => {
    const visible = isShown(column);
    return {
      id: column.id,
      label: column.header,
      name: columnLabel(column),
      checked: visible,
      disabled: column.hideable === false || (visible && shown === 1),
      locked: reorder?.locked.has(column.id),
    };
  });

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
        <ViewMenuButton {...triggerProps} label={name} shown={shown} size={size} />
      </Dropdown.Trigger>
    );

  const menu = (
    <Dropdown.Root>
      {opener}
      <ViewMenuContent
        reset={reset ? { label: labels.resetColumns, onSelect: reset } : null}
        align={trigger === "icon" ? "end" : "auto"}
        size={size}
      >
        {reorder ? (
          <SortableViewMenuItems
            entries={entries}
            groupLabel={labels.showColumns}
            onToggle={toggle}
            reorder={{ onReorder: reorder.onReorder, handleLabel: labels.reorderColumn }}
          />
        ) : (
          <ViewMenuItems entries={entries} groupLabel={labels.showColumns} onToggle={toggle} />
        )}
      </ViewMenuContent>
    </Dropdown.Root>
  );
  // The chooser outside a table brings the drag session its list needs (inside one, the table's).
  return reorder ? <Dnd.Root>{menu}</Dnd.Root> : menu;
}
