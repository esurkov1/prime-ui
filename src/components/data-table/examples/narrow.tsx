/** A 320px container: columns scroll inside the table, the first one sticks; toolbar and footer reflow by the table's own width and pagination collapses to «‹ 3 / 8 ›». Use to check mobile layouts. */

import { Badge, Button, DataTable, type DataTableColumn, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

type Ticket = { id: string; subject: string; priority: "high" | "normal"; age: number };

const rows: Ticket[] = Array.from({ length: 36 }, (_, i) => ({
  id: `T-${2400 + i}`,
  subject: ["Не приходит письмо", "Ошибка оплаты", "Сброс пароля", "Вопрос по тарифу"][i % 4],
  priority: i % 3 === 0 ? "high" : "normal",
  age: (i * 5) % 48,
}));

const columns: DataTableColumn<Ticket>[] = [
  { id: "id", header: "Тикет", accessor: "id" },
  { id: "subject", header: "Тема", accessor: "subject", truncate: true, maxWidth: "10rem" },
  {
    id: "priority",
    header: "Приоритет",
    cell: (row) =>
      row.priority === "high" ? (
        <Badge.Root color="red">Высокий</Badge.Root>
      ) : (
        <Badge.Root>Обычный</Badge.Root>
      ),
  },
  { id: "age", header: "Ждёт, ч", accessor: "age", numeric: true },
];

export default function DataTableNarrowExample() {
  return (
    <div className={styles.narrowFrame}>
      <div className={styles.narrow}>
        <DataTable.Root
          size="s"
          columns={columns}
          rows={rows}
          getRowKey={(row) => row.id}
          stickyFirstColumn
          pageSize={5}
          toolbar={
            <div className={styles.toolbar}>
              <Typography.Root
                as="span"
                variant="body-s"
                tone="secondary"
                className={styles.tabular}
              >
                Открытые: {rows.length}
              </Typography.Root>
              <Button.Root size="xs">Новый тикет</Button.Root>
            </div>
          }
        />
      </div>
    </div>
  );
}
