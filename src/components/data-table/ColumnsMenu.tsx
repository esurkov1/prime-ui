import * as React from "react";

import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";
import type { PositionAlign, PositionSide } from "@/hooks/usePosition";
import { Icon } from "@/icons";
import { formatLabel } from "@/internal/formatLabel";
import { stepDown } from "@/internal/states";

import { DataTableColumnsContext } from "./context";

export type DataTableColumnsMenuProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children"
> & {
  side?: PositionSide;
  align?: PositionAlign;
  /** The trigger button. */
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * The column chooser of the table it sits in (put it into `toolbar`): a trigger button and a menu
 * with a check item per column and «Показать все». Writes the table's `hiddenColumns`; a column
 * with `hideable: false` stays checked and disabled, and the last visible column cannot be hidden.
 */
export function DataTableColumnsMenu({ side, align, ...rest }: DataTableColumnsMenuProps) {
  const context = React.useContext(DataTableColumnsContext);
  if (context === null) {
    throw new Error("DataTable.ColumnsMenu must be rendered inside the DataTable toolbar");
  }
  const { columns, hidden, setHidden, labels, size } = context;
  const isShown = (column: (typeof columns)[number]) =>
    column.hideable === false || !hidden.has(column.id);
  const shown = columns.filter(isShown).length;
  const hiddenIds = columns.filter((column) => !isShown(column)).map((column) => column.id);
  // Toolbar controls sit one tier below the table (an `m` table → `s`).
  const tier = stepDown(size);

  const setShown = (id: string, visible: boolean) => {
    const next = [...hidden].filter((item) => item !== id);
    setHidden(visible ? next : [...next, id]);
  };

  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root {...rest} variant="outline" tone="neutral" size={tier}>
          <Button.Icon>
            <Icon name="view.columns" />
          </Button.Icon>
          {formatLabel(labels.columns, { shown, total: columns.length })}
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content side={side} align={align} size={tier}>
        {columns.map((column) => {
          const visible = isShown(column);
          return (
            <Dropdown.CheckboxItem
              key={column.id}
              checked={visible}
              disabled={column.hideable === false || (visible && shown === 1)}
              onCheckedChange={(next) => setShown(column.id, next)}
            >
              {column.header}
            </Dropdown.CheckboxItem>
          );
        })}
        <Dropdown.Separator />
        <Dropdown.Item disabled={hiddenIds.length === 0} onSelect={() => setHidden([])}>
          {labels.showAllColumns}
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
DataTableColumnsMenu.displayName = "DataTable.ColumnsMenu";
