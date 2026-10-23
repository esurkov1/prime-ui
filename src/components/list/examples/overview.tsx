/** A support queue: the subject with its number and badge, the state and the client under it, the last update over the new replies; a click opens a ticket and makes it the current row — `current`, `onClick`, `number`, `List.ItemBadges`, `StatusDot`. */
import { Avatar, Badge, Card, List, StatusDot } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const TICKETS = [
  {
    id: "4821",
    subject: "Не приходят письма",
    client: "Ирина Белова, ООО «Гранит»",
    initials: "ИБ",
    color: "blue",
    updated: "10:24",
    replies: 2,
    urgent: true,
    state: { tone: "accent", label: "Открыт" },
  },
  {
    id: "4817",
    subject: "Счёт не совпадает с актом",
    client: "Павел Орлов, ООО «Лето»",
    initials: "ПО",
    color: "green",
    updated: "вчера",
    replies: 0,
    urgent: false,
    state: { tone: "warning", label: "Ждёт клиента" },
  },
  {
    id: "4802",
    subject: "Доступ для бухгалтера",
    client: "Сергей Козлов, ИП Козлов",
    initials: "СК",
    color: "orange",
    updated: "12 окт.",
    replies: 0,
    urgent: false,
    state: { tone: "success", label: "Решён" },
  },
] as const;

export default function ListOverviewExample() {
  const [ticketId, setTicketId] = React.useState("4821");

  return (
    <Card.Root className={styles.pane}>
      <Card.Body>
        <List.Root aria-label="Обращения">
          {TICKETS.map((ticket) => (
            <List.Item
              key={ticket.id}
              value={ticket.id}
              current={ticket.id === ticketId}
              onClick={() => setTicketId(ticket.id)}
            >
              <List.ItemIcon>
                <Avatar.Root color={ticket.color}>
                  <Avatar.Fallback>{ticket.initials}</Avatar.Fallback>
                </Avatar.Root>
              </List.ItemIcon>
              <List.ItemText number={`#${ticket.id}`}>{ticket.subject}</List.ItemText>
              {ticket.urgent ? (
                <List.ItemBadges>
                  <Badge.Root tone="danger">Срочно</Badge.Root>
                </List.ItemBadges>
              ) : null}
              <List.ItemDescription>
                <StatusDot tone={ticket.state.tone}>{ticket.state.label}</StatusDot>
                {ticket.client}
              </List.ItemDescription>
              <List.ItemMeta>{ticket.updated}</List.ItemMeta>
              {ticket.replies > 0 ? (
                <List.ItemCount color="blue">{ticket.replies}</List.ItemCount>
              ) : null}
            </List.Item>
          ))}
        </List.Root>
      </Card.Body>
    </Card.Root>
  );
}
