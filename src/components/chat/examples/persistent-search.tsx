/** Search with no button in the header: the field is there from the start, and the count and the steps between matches appear only once a query is typed — `persistent`, `Chat.Search`. */
import { Card, Chat, Message } from "prime-ui-kit";

import styles from "./examples.module.css";

type ClientMessage = {
  id: string;
  direction: "incoming" | "outgoing";
  text: string;
  sentAt: Date;
};

const NOW = new Date(2026, 9, 8, 15, 0);

const MESSAGES: ClientMessage[] = [
  {
    id: "1",
    direction: "incoming",
    text: "Добрый день! Пришлите счёт на поставку по заказу №4120.",
    sentAt: new Date(2026, 9, 8, 9, 12),
  },
  {
    id: "2",
    direction: "outgoing",
    text: "Счёт INV-4120 во вложении, оплата до пятницы.",
    sentAt: new Date(2026, 9, 8, 9, 40),
  },
  {
    id: "3",
    direction: "incoming",
    text: "Счёт получили, бухгалтерия оплатит сегодня.",
    sentAt: new Date(2026, 9, 8, 11, 5),
  },
  {
    id: "4",
    direction: "outgoing",
    text: "Спасибо! Как придёт оплата, отгрузим со склада.",
    sentAt: new Date(2026, 9, 8, 11, 7),
  },
  {
    id: "5",
    direction: "incoming",
    text: "Платёжку по счёту отправила, проверьте, пожалуйста.",
    sentAt: new Date(2026, 9, 8, 14, 30),
  },
];

export default function ChatPersistentSearchExample() {
  return (
    <Card.Root className={styles.short}>
      <Chat.Root>
        <Chat.Header>
          <Chat.Title>Ольга Ветрова</Chat.Title>
          <Chat.Description>ООО «Северный ветер»</Chat.Description>
        </Chat.Header>
        <Chat.Search persistent />
        <Chat.Messages
          items={MESSAGES}
          getKey={(message) => message.id}
          getAuthor={(message) => message.direction}
          getDate={(message) => message.sentAt}
          renderMessage={(message) => (
            <Message.Root
              direction={message.direction}
              time={message.sentAt}
              status={message.direction === "outgoing" ? "read" : undefined}
            >
              <Message.Text>{message.text}</Message.Text>
            </Message.Root>
          )}
          now={NOW}
        />
      </Chat.Root>
    </Card.Root>
  );
}
