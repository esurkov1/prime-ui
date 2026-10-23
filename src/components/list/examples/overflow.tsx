/** A long inbox in a pane of a fixed height: the list scrolls in a ScrollContainer and long names and previews truncate — `List.ItemText`, `List.ItemDescription`. */
import { Card, List, ScrollContainer } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const TICKETS = [
  { id: "1207", subject: "Возврат оплаты по счёту № 4821 за сентябрь", client: "ООО «Гранит»" },
  { id: "1206", subject: "Смена тарифа", client: "ООО «Лето»" },
  { id: "1205", subject: "Подключение ЭДО через Диадок", client: "ИП Козлов" },
  {
    id: "1204",
    subject: "Акт сверки",
    client: "АО «Северо-Западная транспортная компания»",
  },
  { id: "1203", subject: "Доступ к API для интеграции со складом", client: "ООО «Логистик Про»" },
  { id: "1202", subject: "Перенос поставки", client: "ООО «Альфа-Трейд»" },
  { id: "1201", subject: "Новый пользователь в команде", client: "ООО «Вектор»" },
  { id: "1200", subject: "Ошибка в реквизитах", client: "ИП Смирнова" },
];

export default function ListOverflowExample() {
  const [ticketId, setTicketId] = React.useState("1207");

  return (
    <Card.Root className={styles.pane}>
      <ScrollContainer className={styles.scroll}>
        <List.Root aria-label="Обращения">
          {TICKETS.map((ticket) => (
            <List.Item
              key={ticket.id}
              current={ticket.id === ticketId}
              onClick={() => setTicketId(ticket.id)}
            >
              <List.ItemText>{ticket.subject}</List.ItemText>
              <List.ItemDescription>{ticket.client}</List.ItemDescription>
              <List.ItemMeta>№ {ticket.id}</List.ItemMeta>
            </List.Item>
          ))}
        </List.Root>
      </ScrollContainer>
    </Card.Root>
  );
}
