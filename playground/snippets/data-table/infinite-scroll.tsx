import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { DataTable, type DataTableColumn } from "@/components/data-table/DataTable";
import { Tag } from "@/components/tag/Tag";

type ActivityRow = {
  id: number;
  event: string;
  owner: string;
  date: string;
  type: "Info" | "Warning" | "Success";
};

const owners = ["James", "Sophia", "Arthur", "Emma", "Matthew", "Laura"];
const events = [
  "New comment added",
  "Status updated",
  "File uploaded",
  "Task reassigned",
  "Due date changed",
  "User invited",
];

const allRows: ActivityRow[] = Array.from({ length: 72 }, (_, index) => {
  const id = index + 1;
  const owner = owners[index % owners.length];
  const event = events[index % events.length];
  const day = ((index % 28) + 1).toString().padStart(2, "0");
  return {
    id,
    event,
    owner,
    date: `2026-03-${day}`,
    type: index % 5 === 0 ? "Warning" : index % 2 === 0 ? "Success" : "Info",
  };
});

function badgeColor(type: ActivityRow["type"]) {
  if (type === "Success") return "green";
  if (type === "Warning") return "orange";
  return "blue";
}

const columns: DataTableColumn<ActivityRow>[] = [
  { id: "id", header: "#", accessor: "id", sortable: true, align: "end", minWidth: "4rem" },
  { id: "event", header: "Event", accessor: "event", sortable: true, minWidth: "14rem" },
  { id: "owner", header: "Owner", accessor: "owner", sortable: true, minWidth: "8rem" },
  { id: "date", header: "Date", accessor: "date", sortable: true, minWidth: "8rem" },
  {
    id: "type",
    header: "Type",
    accessor: "type",
    sortable: true,
    minWidth: "8rem",
    cell: (row) => (
      <Badge.Root color={badgeColor(row.type)} variant="lighter">
        {row.type}
      </Badge.Root>
    ),
  },
  {
    id: "topic",
    header: "Topic",
    sortable: false,
    minWidth: "8rem",
    cell: (row) => <Tag.Root>{row.id % 2 === 0 ? "Product" : "Ops"}</Tag.Root>,
  },
];

export default function DataTableInfiniteScrollSnippet() {
  const [loadedCount, setLoadedCount] = React.useState(18);
  const [loading, setLoading] = React.useState(false);

  const rows = allRows.slice(0, loadedCount);
  const hasMore = loadedCount < allRows.length;

  const handleLoadMore = React.useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    window.setTimeout(() => {
      setLoadedCount((prev) => Math.min(prev + 12, allRows.length));
      setLoading(false);
    }, 450);
  }, [hasMore, loading]);

  return (
    <DataTable.Root
      className="examplePreviewBleed"
      columns={columns}
      rows={rows}
      infiniteScroll
      initialVisibleRows={8}
      infiniteBatchSize={8}
      hasMore={hasMore}
      loadingMore={loading}
      onLoadMore={handleLoadMore}
      showPagination={false}
      scrollHeight={320}
    />
  );
}
