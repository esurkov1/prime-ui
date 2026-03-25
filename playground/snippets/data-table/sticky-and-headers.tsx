import { DataTable, type DataTableColumn } from "@/components/data-table/DataTable";

import styles from "./sticky-and-headers.module.css";

type ForecastRow = {
  id: string;
  metric: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  plan: number;
  fact: number;
};

const rows: ForecastRow[] = [
  { id: "r1", metric: "Revenue", q1: 1200, q2: 1280, q3: 1330, q4: 1410, plan: 5220, fact: 5105 },
  { id: "r2", metric: "COGS", q1: 530, q2: 560, q3: 575, q4: 610, plan: 2275, fact: 2290 },
  { id: "r3", metric: "Gross Profit", q1: 670, q2: 720, q3: 755, q4: 800, plan: 2945, fact: 2815 },
  { id: "r4", metric: "Marketing", q1: 190, q2: 205, q3: 215, q4: 230, plan: 840, fact: 875 },
  { id: "r5", metric: "R&D", q1: 160, q2: 170, q3: 180, q4: 190, plan: 700, fact: 710 },
  { id: "r6", metric: "G&A", q1: 120, q2: 124, q3: 128, q4: 133, plan: 505, fact: 498 },
  {
    id: "r7",
    metric: "Operating Profit",
    q1: 200,
    q2: 221,
    q3: 232,
    q4: 247,
    plan: 900,
    fact: 732,
  },
  { id: "r8", metric: "Tax", q1: 34, q2: 37, q3: 41, q4: 44, plan: 156, fact: 149 },
  { id: "r9", metric: "Net Profit", q1: 166, q2: 184, q3: 191, q4: 203, plan: 744, fact: 583 },
  {
    id: "r10",
    metric: "Customers",
    q1: 1240,
    q2: 1310,
    q3: 1425,
    q4: 1560,
    plan: 5535,
    fact: 5440,
  },
];

const columns: DataTableColumn<ForecastRow>[] = [
  { id: "metric", header: "Metric", accessor: "metric", sortable: true, minWidth: "13rem" },
  { id: "q1", header: "Q1", accessor: "q1", sortable: true, align: "end", minWidth: "7rem" },
  { id: "q2", header: "Q2", accessor: "q2", sortable: true, align: "end", minWidth: "7rem" },
  { id: "q3", header: "Q3", accessor: "q3", sortable: true, align: "end", minWidth: "7rem" },
  { id: "q4", header: "Q4", accessor: "q4", sortable: true, align: "end", minWidth: "7rem" },
  { id: "plan", header: "Plan", accessor: "plan", sortable: true, align: "end", minWidth: "8rem" },
  { id: "fact", header: "Fact", accessor: "fact", sortable: true, align: "end", minWidth: "8rem" },
];

function money(value: number): string {
  return value.toLocaleString("en-US");
}

const formattedColumns: DataTableColumn<ForecastRow>[] = columns.map((column) => {
  if (column.id === "metric") return column;
  return {
    ...column,
    cell: (row) => money(row[column.id as keyof ForecastRow] as number),
  };
});

function DemoBlock({
  title,
  showHeader,
  stickyHeader,
  stickyFirstColumn,
}: {
  title: string;
  showHeader?: boolean;
  stickyHeader?: boolean;
  stickyFirstColumn?: boolean;
}) {
  return (
    <>
      <p className={styles.label}>{title}</p>
      <DataTable.Root
        className={`examplePreviewBleed ${styles.table}`}
        columns={formattedColumns}
        rows={rows}
        showHeader={showHeader}
        stickyHeader={stickyHeader}
        stickyFirstColumn={stickyFirstColumn}
        showPagination={false}
        scrollHeight={220}
        infiniteScroll
        initialVisibleRows={10}
      />
    </>
  );
}

export default function DataTableStickyAndHeadersSnippet() {
  return (
    <>
      <DemoBlock title="showHeader = false (верхняя шапка скрыта)" showHeader={false} />
      <DemoBlock title="stickyHeader = true (липкая верхняя шапка)" stickyHeader />
      <DemoBlock title="stickyFirstColumn = true (липкая первая колонка слева)" stickyFirstColumn />
      <DemoBlock
        title="stickyHeader + stickyFirstColumn (как в Excel)"
        stickyHeader
        stickyFirstColumn
      />
    </>
  );
}
