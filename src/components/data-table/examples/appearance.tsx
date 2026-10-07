/** Row styling: `striped` without dividers, `dividerStyle="dashed"` with `highlightColumnOnHover`, `columnDividers={false}` without a header for a short key/value list. Use striped rows for long numeric grids, column highlight for comparison tables. */

import { DataTable, type DataTableColumn, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

type Shift = { day: string; morning: number; evening: number; night: number };

const rows: Shift[] = [
  { day: "Понедельник", morning: 12, evening: 9, night: 4 },
  { day: "Вторник", morning: 11, evening: 10, night: 4 },
  { day: "Среда", morning: 13, evening: 8, night: 3 },
  { day: "Четверг", morning: 12, evening: 9, night: 5 },
];

const columns: DataTableColumn<Shift>[] = [
  { id: "day", header: "День", accessor: "day" },
  { id: "morning", header: "Утро", accessor: "morning", numeric: true },
  { id: "evening", header: "Вечер", accessor: "evening", numeric: true },
  { id: "night", header: "Ночь", accessor: "night", numeric: true },
];

export default function DataTableAppearanceExample() {
  return (
    <div className={styles.statesGrid}>
      <div className={styles.group}>
        <Typography.Root variant="code" tone="muted">
          striped + dividerStyle="none"
        </Typography.Root>
        <DataTable.Root
          columns={columns}
          rows={rows}
          getRowKey={(r) => r.day}
          striped
          dividerStyle="none"
        />
      </div>
      <div className={styles.group}>
        <Typography.Root variant="code" tone="muted">
          dividerStyle="dashed" + highlightColumnOnHover
        </Typography.Root>
        <DataTable.Root
          columns={columns}
          rows={rows}
          getRowKey={(r) => r.day}
          dividerStyle="dashed"
          highlightColumnOnHover
        />
      </div>
      <div className={styles.group}>
        <Typography.Root variant="code" tone="muted">
          dividerStyle="dotted" + columnDividers=&#123;false&#125; + showHeader=&#123;false&#125;
        </Typography.Root>
        <DataTable.Root
          columns={columns}
          rows={rows}
          getRowKey={(r) => r.day}
          dividerStyle="dotted"
          columnDividers={false}
          showHeader={false}
        />
      </div>
    </div>
  );
}
