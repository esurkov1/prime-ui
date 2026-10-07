/** A ticket board: columns share one kind, so a ticket lands in another column at an exact position, and a full column refuses it before the release — `kind`, `canDrop`, `onReorder`. */
import { Badge, Dnd, moveBefore, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Status = "todo" | "doing" | "done";
type Ticket = { id: string; title: string; status: Status };

const COLUMNS: { status: Status; title: string }[] = [
  { status: "todo", title: "К выполнению" },
  { status: "doing", title: "В работе" },
  { status: "done", title: "Готово" },
];

const WIP_LIMIT = 3;

const TICKETS: Ticket[] = [
  { id: "t1", title: "Починить загрузку аватара", status: "todo" },
  { id: "t2", title: "Тёмная тема для таблиц", status: "todo" },
  { id: "t3", title: "Экспорт отчёта в CSV", status: "doing" },
  { id: "t4", title: "Обновить онбординг", status: "done" },
  { id: "t5", title: "Фильтры в списке заказов", status: "doing" },
];

export default function DndBoardExample() {
  const [tickets, setTickets] = React.useState(TICKETS);

  // The ticket changes column and lands in front of `beforeId` (`null` = at the end).
  const place = (id: string, status: Status, beforeId: string | null) =>
    setTickets((current) =>
      moveBefore(
        current.map((ticket) => (ticket.id === id ? { ...ticket, status } : ticket)),
        id,
        beforeId,
        (ticket) => ticket.id,
      ),
    );

  return (
    <Dnd.Root>
      <div className={styles.board}>
        {COLUMNS.map((column) => {
          const inColumn = tickets.filter((ticket) => ticket.status === column.status);
          return (
            <section key={column.status} className={styles.column} aria-label={column.title}>
              <div className={styles.columnHeader}>
                <Typography.Root as="h4" variant="title-s">
                  {column.title}
                </Typography.Root>
                <Badge.Root>{inColumn.length}</Badge.Root>
              </div>
              <Dnd.Sortable
                kind="ticket"
                aria-label={`Тикеты: ${column.title}`}
                className={styles.cards}
                items={inColumn}
                getId={(ticket) => ticket.id}
                getLabel={(ticket) => ticket.title}
                canDrop={(id) =>
                  column.status !== "doing" ||
                  inColumn.length < WIP_LIMIT ||
                  inColumn.some((ticket) => ticket.id === id)
                }
                onReorder={(id, beforeId) => place(id, column.status, beforeId)}
                renderItem={(ticket) => (
                  <Dnd.SortableItem id={ticket.id} className={styles.ticket}>
                    <Typography.Root as="span" variant="body-m">
                      {ticket.title}
                    </Typography.Root>
                    <Typography.Root as="span" variant="caption" tone="muted">
                      {ticket.id.toUpperCase()}
                    </Typography.Root>
                  </Dnd.SortableItem>
                )}
              />
            </section>
          );
        })}
      </div>
    </Dnd.Root>
  );
}
