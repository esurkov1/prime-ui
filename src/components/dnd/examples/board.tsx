/** Connected lists: columns share `kind="ticket"`, so a ticket can be dropped into another column at an exact position, not just onto the column. `onReorder` receives the id of a ticket from any column; `canDrop` limits "В работе" to three and the column turns `danger` before the release. Use for boards and any "move between lists" screen. */
import { Badge, Dnd, moveBefore, Typography } from "prime-ui-kit";
import { useState } from "react";

import styles from "./examples.module.css";

type Status = "todo" | "doing" | "done";

const COLUMNS: { status: Status; title: string }[] = [
  { status: "todo", title: "К выполнению" },
  { status: "doing", title: "В работе" },
  { status: "done", title: "Готово" },
];

const WIP_LIMIT = 3;

const INITIAL = [
  { id: "t1", title: "Починить загрузку аватара", status: "todo" as Status },
  { id: "t2", title: "Тёмная тема для таблиц", status: "todo" as Status },
  { id: "t3", title: "Экспорт отчёта в CSV", status: "doing" as Status },
  { id: "t4", title: "Обновить онбординг", status: "done" as Status },
  { id: "t5", title: "Фильтры в списке заказов", status: "doing" as Status },
];

export default function DndBoardExample() {
  const [tickets, setTickets] = useState(INITIAL);

  // The ticket changes column and lands in front of `beforeId` (`null` = at the end of the column).
  const place = (id: string, status: Status, beforeId: string | null) =>
    setTickets((current) =>
      moveBefore(
        current.map((t) => (t.id === id ? { ...t, status } : t)),
        id,
        beforeId,
        (t) => t.id,
      ),
    );

  return (
    <Dnd.Root>
      <div className={styles.board}>
        {COLUMNS.map((column) => {
          const inColumn = tickets.filter((t) => t.status === column.status);
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
                getId={(t) => t.id}
                getLabel={(t) => t.title}
                canDrop={(id) =>
                  column.status !== "doing" ||
                  inColumn.length < WIP_LIMIT ||
                  inColumn.some((t) => t.id === id)
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
