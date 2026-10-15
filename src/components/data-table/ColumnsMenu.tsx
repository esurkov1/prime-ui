import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { Icon } from "@/icons";
import { formatLabel } from "@/internal/formatLabel";
import { type ControlSize, stepDown } from "@/internal/states";

import type { DataTableLabels } from "./DataTable";
import type { DataTableColumn } from "./types";

type ColumnsMenuProps = {
  /** Every column, hidden ones included, in table order. */
  columns: DataTableColumn<never>[];
  hidden: ReadonlySet<string>;
  setHidden: (hidden: string[]) => void;
  labels: DataTableLabels;
  size: ControlSize;
};

/**
 * The column chooser of the table (`columnsMenu`), drawn in its header row: an icon-only ghost
 * Button one tier below the table, named and tipped by `labels.columns`, opening a Dropdown with a
 * check item per column and «Показать все». A column with `hideable: false` stays checked and
 * disabled, and the last visible column cannot be hidden.
 */
export function ColumnsMenu({ columns, hidden, setHidden, labels, size }: ColumnsMenuProps) {
  const isShown = (column: DataTableColumn<never>) =>
    column.hideable === false || !hidden.has(column.id);
  const shown = columns.filter(isShown).length;
  const hiddenIds = columns.filter((column) => !isShown(column)).map((column) => column.id);
  // A control in the head sits one tier below the table, like the controls in its cells.
  const tier = stepDown(size);
  const name = formatLabel(labels.columns, { shown, total: columns.length });

  const setShown = (id: string, visible: boolean) => {
    const next = [...hidden].filter((item) => item !== id);
    setHidden(visible ? next : [...next, id]);
  };

  return (
    <Dropdown.Root>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Dropdown.Trigger>
            <Button.Root variant="ghost" tone="neutral" size={tier} aria-label={name}>
              <Button.Icon>
                <Icon name="view.columns" />
              </Button.Icon>
            </Button.Root>
          </Dropdown.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Content>{name}</Tooltip.Content>
      </Tooltip.Root>
      <Dropdown.Content side="bottom" align="end" size={tier}>
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
