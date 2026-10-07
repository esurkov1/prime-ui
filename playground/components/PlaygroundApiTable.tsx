import type * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { DataTable, type DataTableColumn } from "@/components/data-table/DataTable";
import { Typography } from "@/components/typography/Typography";

export type PlaygroundApiPropRow = {
  prop: string;
  type: string;
  defaultValue: string;
  required: string;
  description: string;
};

/** Marks `` `code` `` fragments inside descriptions. */
function renderInlineCode(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) =>
    part.startsWith("`") && part.endsWith("`") && part.length > 2 ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: static split of a constant string
      <code key={i}>{part.slice(1, -1)}</code>
    ) : (
      part
    ),
  );
}

const isRequired = (row: PlaygroundApiPropRow) =>
  row.required.trim().toLowerCase().startsWith("да");

const COLUMNS: DataTableColumn<PlaygroundApiPropRow>[] = [
  {
    id: "prop",
    header: "Проп",
    minWidth: "10rem",
    cell: (row) => (
      <Typography.Root as="span" variant="body-m">
        <code>{row.prop}</code>{" "}
        {isRequired(row) ? <Badge.Root color="orange">обязательный</Badge.Root> : null}
      </Typography.Root>
    ),
  },
  {
    id: "type",
    header: "Тип",
    minWidth: "10rem",
    cell: (row) => (
      <Typography.Root as="span" variant="body-m">
        <code>{row.type}</code>
      </Typography.Root>
    ),
  },
  {
    id: "default",
    header: "По умолчанию",
    minWidth: "8rem",
    cell: (row) =>
      row.defaultValue === "—" || row.defaultValue === "" ? (
        <Typography.Root as="span" variant="body-m" tone="muted">
          —
        </Typography.Root>
      ) : (
        <Typography.Root as="span" variant="body-m">
          <code>{row.defaultValue}</code>
        </Typography.Root>
      ),
  },
  {
    id: "description",
    header: "Описание",
    grow: true,
    minWidth: "16rem",
    cell: (row) => (
      <Typography.Root as="span" variant="body-m" tone="secondary">
        {renderInlineCode(row.description)}
      </Typography.Root>
    ),
  },
];

/** Props table of a playground page: the kit's own DataTable, Badge and Typography. */
export function PlaygroundApiTable({ rows }: { rows: PlaygroundApiPropRow[] }) {
  return (
    <DataTable.Root
      columns={COLUMNS}
      rows={rows}
      getRowKey={(row) => row.prop}
      showPagination={false}
      pageSize={rows.length || 1}
      highlightRowOnHover={false}
      labels={{ empty: "Нет пропов" }}
    />
  );
}
