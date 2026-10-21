import * as React from "react";

import { moveBefore } from "@/components/dnd/Dnd";
import { useHostTier } from "@/internal/ControlSizeContext";
import { useLabels } from "@/internal/labels";
import type { ControlSize } from "@/internal/states";
import { sameIds, VIEW_MENU_TEXT } from "@/internal/ViewMenu";

import { ColumnsMenu, lockedInChooser } from "./ColumnsMenu";
import { orderColumns } from "./columnOrder";
import { DATA_TABLE_LABELS, type DataTableLabels } from "./DataTable";
import type { DataTableColumn } from "./types";

/** The strings of the column chooser outside the table: its text, and the menu's from the table. */
export type DataTableColumnsMenuLabels = {
  /** The trigger's text. */
  view: string;
} & Pick<DataTableLabels, "showColumns" | "resetColumns" | "reorderColumn">;

export type DataTableColumnsMenuProps<Row> = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "type"
> & {
  columns: DataTableColumn<Row>[];
  hiddenColumns: string[];
  defaultHiddenColumns?: string[];
  onHiddenColumnsChange: (hiddenColumns: string[]) => void;
  columnOrder?: string[];
  onColumnOrderChange?: (columnOrder: string[]) => void;
  size?: ControlSize;
  labels?: Partial<DataTableColumnsMenuLabels>;
  ref?: React.Ref<HTMLButtonElement>;
};

export const DATA_TABLE_COLUMNS_MENU_LABELS: DataTableColumnsMenuLabels = {
  view: VIEW_MENU_TEXT.view,
  showColumns: DATA_TABLE_LABELS.showColumns,
  resetColumns: DATA_TABLE_LABELS.resetColumns,
  reorderColumn: DATA_TABLE_LABELS.reorderColumn,
};

const NONE: string[] = [];
const idOf = (id: string) => id;

/**
 * The column chooser of a DataTable that has no row-actions column to hold it: the kit's one view
 * trigger (`ViewMenu`: the columns icon, «Вид» and the count of shown columns), for the table's
 * tools, bound to the same state the table reads (`hiddenColumns`, and `columnOrder` when the
 * columns reorder). «По умолчанию» puts `defaultHiddenColumns` and the order of `columns` back.
 */
export function DataTableColumnsMenu<Row>({
  columns,
  hiddenColumns,
  defaultHiddenColumns = NONE,
  onHiddenColumnsChange,
  columnOrder,
  onColumnOrderChange,
  size: sizeProp,
  labels: labelsProp,
  ...triggerProps
}: DataTableColumnsMenuProps<Row>) {
  const labels = useLabels(DATA_TABLE_COLUMNS_MENU_LABELS, labelsProp);
  const { size } = useHostTier(sizeProp);
  const hidden = React.useMemo(() => new Set(hiddenColumns), [hiddenColumns]);
  const ordered = React.useMemo(
    () => orderColumns(columns, columnOrder ?? []),
    [columns, columnOrder],
  );
  const ids = ordered.map((column) => column.id);
  const defaultOrder = columns.map((column) => column.id);
  const orderChanged =
    onColumnOrderChange !== undefined && ids.join("\u0000") !== defaultOrder.join("\u0000");
  const hiddenChanged = !sameIds(hiddenColumns, defaultHiddenColumns);
  const reorder = onColumnOrderChange
    ? {
        locked: lockedInChooser(columns as DataTableColumn<never>[]),
        onReorder: (id: string, beforeId: string | null) =>
          onColumnOrderChange(moveBefore(ids, id, beforeId, idOf)),
      }
    : null;
  const reset =
    hiddenChanged || orderChanged
      ? () => {
          if (hiddenChanged) onHiddenColumnsChange([...defaultHiddenColumns]);
          if (orderChanged) onColumnOrderChange?.(defaultOrder);
        }
      : null;
  return (
    <ColumnsMenu
      columns={ordered as DataTableColumn<never>[]}
      hidden={hidden}
      setHidden={onHiddenColumnsChange}
      reorder={reorder}
      reset={reset}
      name={labels.view}
      labels={labels}
      size={size}
      trigger="button"
      triggerProps={triggerProps}
    />
  );
}
DataTableColumnsMenu.displayName = "DataTableColumnsMenu";
