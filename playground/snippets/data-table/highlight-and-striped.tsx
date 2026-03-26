import * as React from "react";
import { DataTable, type DataTableColumn } from "@/components/data-table/DataTable";

import styles from "./data-table-demos.module.css";

type Row = { id: string; product: string; qty: number; price: number };

const rows: Row[] = [
  { id: "1", product: "Notebook", qty: 2, price: 1200 },
  { id: "2", product: "Mouse", qty: 5, price: 45 },
  { id: "3", product: "Keyboard", qty: 1, price: 180 },
  { id: "4", product: "Display", qty: 1, price: 420 },
];

const columns: DataTableColumn<Row>[] = [
  { id: "product", header: "Товар", accessor: "product", sortable: true, minWidth: "10rem" },
  { id: "qty", header: "Кол-во", accessor: "qty", sortable: true, align: "end", minWidth: "6rem" },
  {
    id: "price",
    header: "Цена",
    accessor: "price",
    sortable: true,
    align: "end",
    minWidth: "7rem",
  },
];

export default function DataTableHighlightAndStripedSnippet() {
  const [highlightRowOnHover, setHighlightRowOnHover] = React.useState(true);
  const [highlightColumnOnHover, setHighlightColumnOnHover] = React.useState(false);
  const [striped, setStriped] = React.useState(false);

  return (
    <div className="examplePreviewBleed">
      <fieldset className={styles.optionsFieldset}>
        <legend className={styles.optionsLegend}>Опции таблицы</legend>
        <label className={styles.optionLabel}>
          <input
            type="checkbox"
            checked={highlightRowOnHover}
            onChange={(e) => setHighlightRowOnHover(e.target.checked)}
          />
          Подсветка строки при наведении
        </label>
        <label className={styles.optionLabel}>
          <input
            type="checkbox"
            checked={highlightColumnOnHover}
            onChange={(e) => setHighlightColumnOnHover(e.target.checked)}
          />
          Подсветка колонки при наведении
        </label>
        <label className={styles.optionLabel}>
          <input type="checkbox" checked={striped} onChange={(e) => setStriped(e.target.checked)} />
          Чередование строк (зебра)
        </label>
      </fieldset>

      <DataTable.Root
        columns={columns}
        rows={rows}
        pageSize={10}
        showPagination={false}
        highlightRowOnHover={highlightRowOnHover}
        highlightColumnOnHover={highlightColumnOnHover}
        striped={striped}
      />
    </div>
  );
}
