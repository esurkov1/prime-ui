/** Row styling: zebra rows without lines, a column wash under the pointer, a headless key/value list — `striped`, `rowDividers`, `highlightColumnOnHover`, `columnDividers`, `showHeader`. */
import { DataTable, type DataTableColumn, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

type Shift = { day: string; morning: number; evening: number; night: number };

const SHIFTS: Shift[] = [
  { day: "Понедельник", morning: 12, evening: 9, night: 4 },
  { day: "Вторник", morning: 11, evening: 10, night: 4 },
  { day: "Среда", morning: 13, evening: 8, night: 3 },
  { day: "Четверг", morning: 12, evening: 9, night: 5 },
];

const COLUMNS: DataTableColumn<Shift>[] = [
  { id: "day", header: "День", accessor: "day" },
  { id: "morning", header: "Утро", accessor: "morning", numeric: true },
  { id: "evening", header: "Вечер", accessor: "evening", numeric: true },
  { id: "night", header: "Ночь", accessor: "night", numeric: true },
];

export default function DataTableAppearanceExample() {
  return (
    <>
      <div className={styles.specimen}>
        <DataTable
          columns={COLUMNS}
          rows={SHIFTS}
          getRowKey={(row) => row.day}
          striped
          rowDividers={false}
        />
        <Typography.Root as="span" variant="caption" tone="muted">
          striped · rowDividers=&#123;false&#125;
        </Typography.Root>
      </div>
      <div className={styles.specimen}>
        <DataTable
          columns={COLUMNS}
          rows={SHIFTS}
          getRowKey={(row) => row.day}
          highlightColumnOnHover
        />
        <Typography.Root as="span" variant="caption" tone="muted">
          highlightColumnOnHover
        </Typography.Root>
      </div>
      <div className={styles.specimen}>
        <DataTable
          columns={COLUMNS}
          rows={SHIFTS}
          getRowKey={(row) => row.day}
          columnDividers={false}
          showHeader={false}
        />
        <Typography.Root as="span" variant="caption" tone="muted">
          columnDividers=&#123;false&#125; · showHeader=&#123;false&#125;
        </Typography.Root>
      </div>
    </>
  );
}
