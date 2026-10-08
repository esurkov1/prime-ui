/** A support queue with a work-in-progress limit and a workflow rule: a full column and a blocked ticket are refused before the release, from the keyboard too — `limit`, `canDrop`. */
import { Badge, Kanban } from "prime-ui-kit";

import styles from "./examples.module.css";

type Ticket = { id: string; title: string; client: string; blocked?: boolean };

const COLUMNS = [
  { id: "new", title: "Новые" },
  { id: "progress", title: "В работе", limit: 3 },
  { id: "solved", title: "Решены" },
];

const TICKETS: Ticket[] = [
  { id: "SUP-1042", title: "Не приходит письмо со счётом", client: "ООО «Север»" },
  { id: "SUP-1045", title: "Ошибка оплаты картой", client: "ИП Лебедев", blocked: true },
  { id: "SUP-1038", title: "Сменить владельца аккаунта", client: "ООО «Вектор»" },
  { id: "SUP-1036", title: "Дубли в отчёте по заказам", client: "АО «Гранит»" },
  { id: "SUP-1031", title: "Нет доступа к API-ключам", client: "ООО «Логистик»" },
  { id: "SUP-1027", title: "Перенести проект в другую команду", client: "ООО «Север»" },
];

const BLOCKED = new Set(TICKETS.filter((ticket) => ticket.blocked).map((ticket) => ticket.id));

const PLACEMENT = {
  new: ["SUP-1042", "SUP-1045"],
  progress: ["SUP-1038", "SUP-1036", "SUP-1031"],
  solved: ["SUP-1027"],
};

export default function KanbanLimitsExample() {
  return (
    <Kanban.Root
      aria-label="Очередь поддержки"
      className={styles.board}
      columns={COLUMNS}
      items={TICKETS}
      getId={(ticket) => ticket.id}
      getLabel={(ticket) => ticket.title}
      defaultValue={PLACEMENT}
      // A ticket waiting on the client cannot be closed.
      canDrop={(id, columnId) => columnId !== "solved" || !BLOCKED.has(id)}
      renderItem={(ticket) => (
        <Kanban.Item>
          <Kanban.ItemTitle>{ticket.title}</Kanban.ItemTitle>
          <Kanban.ItemDescription>
            {ticket.id} · {ticket.client}
          </Kanban.ItemDescription>
          {ticket.blocked ? (
            <Kanban.ItemBadges>
              <Badge.Root color="orange">Ждёт клиента</Badge.Root>
            </Kanban.ItemBadges>
          ) : null}
        </Kanban.Item>
      )}
    />
  );
}
