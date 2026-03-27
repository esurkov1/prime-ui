import { Badge, DataTable, type DataTableColumn, type DataTableDividerStyle } from "prime-ui-kit";

import styles from "./examples-demos.module.css";

type Row = {
  id: string;
  member: string;
  role: string;
  status: "Online" | "Busy" | "Offline";
};

const rows: Row[] = [
  { id: "r1", member: "James Brown", role: "Product Manager", status: "Online" },
  { id: "r2", member: "Sophia Williams", role: "Designer", status: "Busy" },
  { id: "r3", member: "Arthur Taylor", role: "Frontend Engineer", status: "Offline" },
];

function mapStatus(status: Row["status"]): "online" | "busy" | "offline" {
  if (status === "Online") return "online";
  if (status === "Busy") return "busy";
  return "offline";
}

const columns: DataTableColumn<Row>[] = [
  { id: "member", header: "Member", accessor: "member", sortable: true, minWidth: "11rem" },
  { id: "role", header: "Role", accessor: "role", sortable: true, minWidth: "12rem" },
  {
    id: "status",
    header: "Status",
    accessor: "status",
    sortable: true,
    minWidth: "8rem",
    cell: (row) => (
      <Badge.Root variant="status" status={mapStatus(row.status)} label={row.status}>
        {row.status}
      </Badge.Root>
    ),
  },
];

function DividerRow({ divider }: { divider: DataTableDividerStyle }) {
  return (
    <>
      <p className={styles.demoLabel}>dividerStyle = {divider}</p>
      <DataTable.Root
        className={styles.demoTable}
        columns={columns}
        rows={rows}
        dividerStyle={divider}
        pageSize={3}
        showPagination={false}
      />
    </>
  );
}

/** Соответствует `playground/snippets/data-table/divider-styles.tsx`. */
export default function DataTableDividerStylesExample() {
  return (
    <>
      <DividerRow divider="standard" />
      <DividerRow divider="dashed" />
      <DividerRow divider="dotted" />
      <DividerRow divider="none" />
    </>
  );
}
