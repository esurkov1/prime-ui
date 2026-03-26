import { ExternalLink, Mail } from "lucide-react";
import * as React from "react";

import { DataTable, type DataTableColumn } from "@/components/data-table/DataTable";
import { LinkButton } from "@/components/link-button/LinkButton";

import styles from "./data-table-demos.module.css";

type ContactRow = {
  id: string;
  name: string;
  email: string;
  channel: string;
};

const rows: ContactRow[] = [
  { id: "c1", name: "Ирина Соколова", email: "i.sokolova@example.com", channel: "Email" },
  { id: "c2", name: "Павел Орлов", email: "p.orlov@example.com", channel: "Личный кабинет" },
  { id: "c3", name: "Марина Волкова", email: "m.volkova@example.com", channel: "Телеграм-бот" },
];

const columns: DataTableColumn<ContactRow>[] = [
  {
    id: "name",
    header: (
      <span className={styles.inlineIconRow}>
        <Mail size={14} strokeWidth={2} aria-hidden />
        Контакт
      </span>
    ),
    accessor: "name",
    sortable: true,
    minWidth: "11rem",
  },
  {
    id: "email",
    header: "Адрес",
    accessor: "email",
    sortable: true,
    minWidth: "14rem",
    align: "center",
    cell: (row) => (
      <LinkButton.Root size="s" href={`mailto:${row.email}`}>
        {row.email}
      </LinkButton.Root>
    ),
  },
  {
    id: "channel",
    header: "Канал",
    accessor: "channel",
    sortable: true,
    minWidth: "10rem",
  },
  {
    id: "open",
    header: "",
    sortable: false,
    align: "end",
    minWidth: "7rem",
    onCellClick: (row) => {
      window.open(`mailto:${row.email}`, "_blank", "noopener,noreferrer");
    },
    cell: () => (
      <span className={styles.inlineIconRowTight}>
        <ExternalLink size={14} strokeWidth={2} aria-hidden />
        Написать
      </span>
    ),
  },
];

export default function DataTableCompositionSnippet() {
  const [last, setLast] = React.useState<string | null>(null);

  return (
    <div className="examplePreviewBleed">
      <p className={styles.lead}>
        {last ? `Последний клик по строке: ${last}` : "Клик по строке обновляет подпись ниже."}
      </p>
      <DataTable.Root
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        onRowClick={(row) => setLast(row.name)}
        showPagination={false}
        pageSize={10}
        highlightRowOnHover
      />
    </div>
  );
}
