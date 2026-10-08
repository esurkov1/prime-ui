import type * as React from "react";

import { Badge } from "@/components/badge/Badge";
import type { DataTableColumn } from "@/components/data-table/DataTable";
import { Typography } from "@/components/typography/Typography";

import type { ApiProp } from "../../scripts/docs/componentApi";
import { DocTable } from "./Doc";

/** Marks `` `code` `` fragments inside descriptions. */
export function renderInlineCode(text: string): React.ReactNode {
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

const COLUMNS: DataTableColumn<ApiProp>[] = [
  {
    id: "prop",
    header: "Проп",
    minWidth: "10rem",
    cell: (prop) => (
      <Typography as="span" variant="body-m">
        <code>{prop.name}</code>{" "}
        {prop.required ? <Badge.Root color="orange">обязательный</Badge.Root> : null}
      </Typography>
    ),
  },
  {
    id: "type",
    header: "Тип",
    minWidth: "10rem",
    cell: (prop) => (
      <Typography as="span" variant="body-m">
        <code>{prop.type}</code>
      </Typography>
    ),
  },
  {
    id: "default",
    header: "По умолчанию",
    minWidth: "8rem",
    cell: (prop) =>
      prop.default === undefined ? (
        <Typography as="span" variant="body-m" tone="muted">
          —
        </Typography>
      ) : (
        <Typography as="span" variant="body-m">
          <code>{prop.default}</code>
        </Typography>
      ),
  },
  {
    id: "description",
    header: "Описание",
    grow: true,
    minWidth: "16rem",
    cell: (prop) => (
      <Typography as="span" variant="body-m" tone="secondary">
        {renderInlineCode(prop.ru)}
      </Typography>
    ),
  },
];

/** Props table of a component part, straight from its `api.ts` entries. */
export function PlaygroundApiTable({ props }: { props: ApiProp[] }) {
  return (
    <DocTable columns={COLUMNS} rows={props} getRowKey={(prop) => prop.name} empty="Нет пропов" />
  );
}
