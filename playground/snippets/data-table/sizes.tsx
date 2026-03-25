import { Badge } from "@/components/badge/Badge";
import {
  DataTable,
  type DataTableColumn,
  type DataTableSize,
} from "@/components/data-table/DataTable";
import { Tag } from "@/components/tag/Tag";

import styles from "./sizes.module.css";

type TeamRow = {
  id: string;
  member: string;
  role: string;
  team: string;
  status: "Online" | "Offline" | "Busy" | "Away";
};

const rows: TeamRow[] = [
  { id: "u1", member: "James Brown", role: "Product Manager", team: "Core", status: "Online" },
  { id: "u2", member: "Sophia Williams", role: "Designer", team: "Growth", status: "Busy" },
  { id: "u3", member: "Arthur Taylor", role: "Frontend Engineer", team: "Core", status: "Offline" },
  { id: "u4", member: "Emma Wright", role: "QA Engineer", team: "Platform", status: "Away" },
  {
    id: "u5",
    member: "Matthew Johnson",
    role: "Data Engineer",
    team: "Analytics",
    status: "Online",
  },
];

function mapStatusToBadge(status: TeamRow["status"]): "online" | "offline" | "busy" | "away" {
  if (status === "Online") return "online";
  if (status === "Offline") return "offline";
  if (status === "Busy") return "busy";
  return "away";
}

const columns: DataTableColumn<TeamRow>[] = [
  { id: "member", header: "Member", accessor: "member", sortable: true, minWidth: "12rem" },
  { id: "role", header: "Role", accessor: "role", sortable: true, minWidth: "12rem" },
  {
    id: "team",
    header: "Team",
    accessor: "team",
    sortable: true,
    minWidth: "9rem",
    cell: (row) => <Tag.Root>{row.team}</Tag.Root>,
  },
  {
    id: "status",
    header: "Status",
    accessor: "status",
    sortable: true,
    minWidth: "8rem",
    cell: (row) => (
      <Badge.Root variant="status" status={mapStatusToBadge(row.status)} label={row.status}>
        {row.status}
      </Badge.Root>
    ),
  },
];

function SizeRow({ size }: { size: DataTableSize }) {
  return (
    <>
      <p className={styles.label}>size = {size}</p>
      <DataTable.Root
        className={`examplePreviewBleed ${styles.table}`}
        columns={columns}
        rows={rows}
        size={size}
        pageSize={2}
        paginationSize={size}
      />
    </>
  );
}

export default function DataTableSizesSnippet() {
  return (
    <>
      <SizeRow size="s" />
      <SizeRow size="m" />
      <SizeRow size="l" />
      <SizeRow size="xl" />
    </>
  );
}
