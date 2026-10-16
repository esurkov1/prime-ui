/** A 320 px support queue: columns scroll inside the table with the first one pinned, the column chooser stays in reach above it, the footer reflows and the pager turns compact — `stickyFirstColumn`, `DataTableColumnsMenu`, `size`. */
import { Badge, DataTable, type DataTableColumn, DataTableColumnsMenu } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Ticket = { id: string; subject: string; urgent: boolean; waiting: number };

const SUBJECTS = ["Не приходит письмо", "Ошибка оплаты", "Сброс пароля", "Вопрос по тарифу"];

const TICKETS: Ticket[] = Array.from({ length: 36 }, (_, i) => ({
  id: `T-${2400 + i}`,
  subject: SUBJECTS[i % SUBJECTS.length],
  urgent: i % 3 === 0,
  waiting: (i * 5) % 48,
}));

const COLUMNS: DataTableColumn<Ticket>[] = [
  { id: "id", header: "Тикет", accessor: "id", hideable: false },
  { id: "subject", header: "Тема", accessor: "subject", truncate: true, maxWidth: "10rem" },
  {
    id: "priority",
    header: "Приоритет",
    cell: (row) =>
      row.urgent ? (
        <Badge.Root tone="danger">Высокий</Badge.Root>
      ) : (
        <Badge.Root tone="neutral">Обычный</Badge.Root>
      ),
  },
  { id: "waiting", header: "Ждёт, ч", accessor: "waiting", numeric: true },
];

export default function DataTableNarrowExample() {
  const [hidden, setHidden] = React.useState<string[]>([]);

  return (
    <div className={styles.narrow}>
      <div className={styles.withTools}>
        <div className={styles.tools}>
          <DataTableColumnsMenu
            size="s"
            columns={COLUMNS}
            hiddenColumns={hidden}
            onHiddenColumnsChange={setHidden}
          />
        </div>
        <DataTable
          size="s"
          columns={COLUMNS}
          hiddenColumns={hidden}
          rows={TICKETS}
          getRowKey={(row) => row.id}
          stickyFirstColumn
          pageSize={5}
        />
      </div>
    </div>
  );
}
