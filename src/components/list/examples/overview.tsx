/** A support ticket queue with the client, the last update and the open count; a click opens a ticket and makes it the current row — `current`, `onClick`. */
import { Card, List } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const TICKETS = [
  {
    id: "T-4821",
    subject: "Счёт без НДС",
    client: "ООО «Гранит»",
    updated: "15:02",
    open: 2,
  },
  {
    id: "T-4817",
    subject: "Перенос доставки на среду",
    client: "ООО «Лето»",
    updated: "13:40",
    open: 0,
  },
  {
    id: "T-4809",
    subject: "Подключение ЭДО",
    client: "ИП Козлов",
    updated: "вчера",
    open: 1,
  },
  {
    id: "T-4796",
    subject: "Акт сверки за сентябрь",
    client: "АО «Северсталь-Сервис»",
    updated: "6 окт",
    open: 0,
  },
];

export default function ListOverviewExample() {
  const [ticketId, setTicketId] = React.useState("T-4821");

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
              <List.ItemText>{ticket.subject}</List.ItemText>
              <List.ItemDescription>
                {ticket.id} · {ticket.client}
              </List.ItemDescription>
              <List.ItemMeta>{ticket.updated}</List.ItemMeta>
              {ticket.open > 0 ? <List.ItemCount color="blue">{ticket.open}</List.ItemCount> : null}
            </List.Item>
          ))}
        </List.Root>
      </Card.Body>
    </Card.Root>
  );
}
