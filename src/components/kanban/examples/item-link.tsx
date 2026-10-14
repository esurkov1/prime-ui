/** Tickets that open: each card is a link to its page, so ⌘-click or a middle click opens a new tab, a plain click, Enter or Space opens it in place, and a drag only moves it — `getItemHref`, `onItemOpen`. */
import { Badge, Kanban, type KanbanValue, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Ticket = {
  id: string;
  title: string;
  client: string;
  priority: { text: string; color: "red" | "orange" | "gray" };
};

const COLUMNS = [
  { id: "new", title: "Новые" },
  { id: "progress", title: "В работе" },
  { id: "waiting", title: "Ждут клиента" },
];

const TICKETS: Ticket[] = [
  {
    id: "SUP-482",
    title: "Не выгружаются счета в 1С",
    client: "ООО «Север»",
    priority: { text: "Высокий", color: "red" },
  },
  {
    id: "SUP-479",
    title: "Сбросить пароль менеджеру склада",
    client: "АО «Гранит»",
    priority: { text: "Обычный", color: "gray" },
  },
  {
    id: "SUP-475",
    title: "Дубли заказов после импорта",
    client: "ООО «Вектор»",
    priority: { text: "Средний", color: "orange" },
  },
  {
    id: "SUP-470",
    title: "Акт сверки за третий квартал",
    client: "ИП Лебедев",
    priority: { text: "Обычный", color: "gray" },
  },
];

const PLACEMENT: KanbanValue = {
  new: ["SUP-482", "SUP-479"],
  progress: ["SUP-475"],
  waiting: ["SUP-470"],
};

export default function KanbanItemLinkExample() {
  const [opened, setOpened] = React.useState<Ticket | null>(null);

  return (
    <div className={styles.stage}>
      <div className={styles.toolbar}>
        <Typography as="span" variant="body-s" tone="muted" aria-live="polite">
          {opened
            ? `Открыт ${opened.id} · ${opened.client}`
            : "Откройте обращение кликом или Enter"}
        </Typography>
      </div>
      <Kanban.Root
        aria-label="Обращения в поддержку"
        className={styles.board}
        columns={COLUMNS}
        items={TICKETS}
        getId={(ticket) => ticket.id}
        getLabel={(ticket) => `${ticket.id}: ${ticket.title}`}
        defaultValue={PLACEMENT}
        getItemHref={(ticket) => `/support/${ticket.id}`}
        onItemOpen={(ticket, event) => {
          // A client-side router goes here (navigate(href)); the page itself never reloads.
          event.preventDefault();
          setOpened(ticket);
        }}
        renderItem={(ticket) => (
          <Kanban.Item>
            <Kanban.ItemHeader>
              <span>{ticket.id}</span>
              <Badge.Root color={ticket.priority.color}>{ticket.priority.text}</Badge.Root>
            </Kanban.ItemHeader>
            <Kanban.ItemTitle>{ticket.title}</Kanban.ItemTitle>
            <Kanban.ItemDescription>{ticket.client}</Kanban.ItemDescription>
          </Kanban.Item>
        )}
      />
    </div>
  );
}
