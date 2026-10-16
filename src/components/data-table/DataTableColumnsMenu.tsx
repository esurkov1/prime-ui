import * as React from "react";

import { moveBefore } from "@/components/dnd/Dnd";
import { useHostTier } from "@/internal/ControlSizeContext";
import { useLabels } from "@/internal/labels";
import type { ControlSize } from "@/internal/states";

import { ColumnsMenu, type DataTableColumnsMenuLabels, lockedInChooser } from "./ColumnsMenu";
import { orderColumns } from "./columnOrder";
import { DATA_TABLE_LABELS } from "./DataTable";
import type { DataTableColumn } from "./types";

export type { DataTableColumnsMenuLabels } from "./ColumnsMenu";

export type DataTableColumnsMenuProps<Row> = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "type"
> & {
  columns: DataTableColumn<Row>[];
  hiddenColumns: string[];
  onHiddenColumnsChange: (hiddenColumns: string[]) => void;
  columnOrder?: string[];
  onColumnOrderChange?: (columnOrder: string[]) => void;
  size?: ControlSize;
  labels?: Partial<DataTableColumnsMenuLabels>;
  ref?: React.Ref<HTMLButtonElement>;
};

const CHOOSER_LABELS: DataTableColumnsMenuLabels = {
  columns: DATA_TABLE_LABELS.columns,
  showColumns: DATA_TABLE_LABELS.showColumns,
  showAllColumns: DATA_TABLE_LABELS.showAllColumns,
  resetColumnOrder: DATA_TABLE_LABELS.resetColumnOrder,
  reorderColumn: DATA_TABLE_LABELS.reorderColumn,
};

const idOf = (id: string) => id;

/**
 * The column chooser of a DataTable that has no row-actions column to hold it: a labelled soft
 * Button with the count of shown columns, for the page's tools, bound to the same state the table
 * reads (`hiddenColumns`, and `columnOrder` when the columns reorder).
 */
export function DataTableColumnsMenu<Row>({
  columns,
  hiddenColumns,
  onHiddenColumnsChange,
  columnOrder,
  onColumnOrderChange,
  size: sizeProp,
  labels: labelsProp,
  ...triggerProps
}: DataTableColumnsMenuProps<Row>) {
  const labels = useLabels(CHOOSER_LABELS, labelsProp);
  const { size } = useHostTier(sizeProp);
  const hidden = React.useMemo(() => new Set(hiddenColumns), [hiddenColumns]);
  const ordered = React.useMemo(
    () => orderColumns(columns, columnOrder ?? []),
    [columns, columnOrder],
  );
  const ids = ordered.map((column) => column.id);
  const defaultOrder = columns.map((column) => column.id);
  const reorder = onColumnOrderChange
    ? {
        locked: lockedInChooser(columns as DataTableColumn<never>[]),
        onReorder: (id: string, beforeId: string | null) =>
          onColumnOrderChange(moveBefore(ids, id, beforeId, idOf)),
        reset:
          ids.join("\u0000") === defaultOrder.join("\u0000")
            ? null
            : () => onColumnOrderChange(defaultOrder),
      }
    : null;
  return (
    <ColumnsMenu
      columns={ordered as DataTableColumn<never>[]}
      hidden={hidden}
      setHidden={onHiddenColumnsChange}
      reorder={reorder}
      labels={labels}
      size={size}
      trigger="button"
      triggerProps={triggerProps}
    />
  );
}
DataTableColumnsMenu.displayName = "DataTableColumnsMenu";
