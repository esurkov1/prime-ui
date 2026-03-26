import { Checkbox, DataTable, type DataTableColumn } from "prime-ui-kit";
import * as React from "react";

type LineRow = {
  id: string;
  sku: string;
  name: string;
  qty: number;
};

const rows: LineRow[] = [
  { id: "1", sku: "SKU-100", name: "Кабель USB-C, 2 м", qty: 4 },
  { id: "2", sku: "SKU-220", name: "Док-станция", qty: 1 },
  { id: "3", sku: "SKU-305", name: 'Монитор 27"', qty: 2 },
  { id: "4", sku: "SKU-410", name: "Клавиатура", qty: 3 },
];

/**
 * Встроенного multi-select у таблицы нет: колонка с `Checkbox` и `Set` выбранных id в родителе.
 * Выбор только через чекбоксы; при необходимости `onRowClick` проверяйте `event.target` на `input[type="checkbox"]`.
 */
export default function DataTableRowSelectionExample() {
  const [selected, setSelected] = React.useState<Set<string>>(() => new Set());

  const ids = React.useMemo(() => rows.map((row) => row.id), []);
  const allSelected = ids.length > 0 && ids.every((id) => selected.has(id));
  const someSelected = ids.some((id) => selected.has(id)) && !allSelected;

  const toggleOne = React.useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = React.useCallback(() => {
    setSelected((prev) => {
      if (ids.every((id) => prev.has(id))) return new Set();
      return new Set(ids);
    });
  }, [ids]);

  const columns: DataTableColumn<LineRow>[] = React.useMemo(
    () => [
      {
        id: "select",
        header: (
          <Checkbox.Root checked={allSelected} indeterminate={someSelected} onChange={toggleAll}>
            <Checkbox.Label aria-label="Выбрать все строки" />
          </Checkbox.Root>
        ),
        minWidth: "3rem",
        align: "center",
        cell: (row) => (
          <Checkbox.Root checked={selected.has(row.id)} onChange={() => toggleOne(row.id)}>
            <Checkbox.Label aria-label={`Выбрать ${row.sku}`} />
          </Checkbox.Root>
        ),
      },
      { id: "sku", header: "Артикул", accessor: "sku", sortable: true, minWidth: "8rem" },
      { id: "name", header: "Наименование", accessor: "name", sortable: true, minWidth: "14rem" },
      {
        id: "qty",
        header: "Кол-во",
        accessor: "qty",
        sortable: true,
        align: "end",
        minWidth: "6rem",
      },
    ],
    [allSelected, selected, someSelected, toggleAll, toggleOne],
  );

  return (
    <div>
      <p style={{ marginBottom: "0.75rem" }}>
        Выбрано позиций: {selected.size}
        {selected.size > 0 ? ` (${[...selected].join(", ")})` : ""}
      </p>
      <DataTable.Root
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        showPagination={false}
      />
    </div>
  );
}
