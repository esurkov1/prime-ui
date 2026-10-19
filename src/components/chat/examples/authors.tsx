/** A client's group in a messenger, one conversation with several writers on both sides: two people of the client and, on yours, an operator and an AI agent; the first message of every run names its author, with no avatars — `authors`, `items`, `renderMessage`, `Message.Author`, `tag`. */
import { Card, Chat, hueOf, Message } from "prime-ui-kit";

import styles from "./examples.module.css";

type Sender = "buyer" | "accountant" | "ai" | "operator";

type DialogMessage = { id: string; sender: Sender; text: string; sentAt: Date };

const NOW = new Date(2026, 9, 8, 15, 0);

const AUTHORS: Record<Sender, { name: string; tag: string; side: "incoming" | "outgoing" }> = {
  buyer: { name: "Ольга Ветрова", tag: "Закупки", side: "incoming" },
  accountant: { name: "Павел Ким", tag: "Бухгалтерия", side: "incoming" },
  ai: { name: "AI-ассистент", tag: "Бот", side: "outgoing" },
  operator: { name: "Мария Лебедева", tag: "Оператор", side: "outgoing" },
};

const MESSAGES: DialogMessage[] = [
  {
    id: "1",
    sender: "buyer",
    text: "Здравствуйте! Можно перенести поставку по заказу №4120 на субботу?",
    sentAt: new Date(2026, 9, 8, 14, 21),
  },
  {
    id: "2",
    sender: "ai",
    text: "Здравствуйте! Проверяю окна склада на субботу.",
    sentAt: new Date(2026, 9, 8, 14, 21),
  },
  {
    id: "3",
    sender: "ai",
    text: "На субботу свободны 10:00 и 14:30. Передаю диалог оператору для подтверждения.",
    sentAt: new Date(2026, 9, 8, 14, 22),
  },
  {
    id: "4",
    sender: "accountant",
    text: "И пришлите, пожалуйста, обновлённый счёт с новой датой.",
    sentAt: new Date(2026, 9, 8, 14, 30),
  },
  {
    id: "5",
    sender: "operator",
    text: "Добрый день! Перенесла поставку на субботу, 14:30. Счёт INV-4120 обновлён и отправлен на почту.",
    sentAt: new Date(2026, 9, 8, 14, 40),
  },
  {
    id: "6",
    sender: "buyer",
    text: "Спасибо, отлично!",
    sentAt: new Date(2026, 9, 8, 14, 41),
  },
];

const renderMessage = (message: DialogMessage) => {
  const author = AUTHORS[message.sender];
  return (
    <Message.Root
      direction={author.side}
      time={message.sentAt}
      status={author.side === "outgoing" ? "read" : undefined}
    >
      <Message.Author color={hueOf(message.sender)} tag={author.tag}>
        {author.name}
      </Message.Author>
      <Message.Text>{message.text}</Message.Text>
    </Message.Root>
  );
};

export default function ChatAuthorsExample() {
  return (
    <Card.Root className={styles.short}>
      <Chat.Root>
        <Chat.Messages
          authors="all"
          aria-label="Чат с клиентом"
          items={MESSAGES}
          getKey={(message) => message.id}
          getAuthor={(message) => message.sender}
          getDate={(message) => message.sentAt}
          renderMessage={renderMessage}
          now={NOW}
        />
      </Chat.Root>
    </Card.Root>
  );
}
