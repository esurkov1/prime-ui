/** A client dialog where an operator and an AI agent answer: the first message of an outgoing run names its author, the client's side stays plain — `authors`, `items`, `renderMessage`, `Message.Author`, `tag`. */
import { Card, Chat, hueOf, Message } from "prime-ui-kit";

import styles from "./examples.module.css";

type Sender = "client" | "ai" | "operator";

type DialogMessage = { id: string; sender: Sender; text: string; sentAt: Date };

const NOW = new Date(2026, 9, 8, 15, 0);

const AUTHORS: Record<Exclude<Sender, "client">, { name: string; tag: string }> = {
  ai: { name: "AI-ассистент", tag: "Бот" },
  operator: { name: "Мария Лебедева", tag: "Оператор" },
};

const MESSAGES: DialogMessage[] = [
  {
    id: "1",
    sender: "client",
    text: "Здравствуйте! Можно перенести бронь на субботу?",
    sentAt: new Date(2026, 9, 8, 14, 21),
  },
  {
    id: "2",
    sender: "ai",
    text: "Здравствуйте! Проверяю свободные места на субботу.",
    sentAt: new Date(2026, 9, 8, 14, 21),
  },
  {
    id: "3",
    sender: "ai",
    text: "На субботу есть 10:00 и 14:30. Передаю диалог оператору для подтверждения.",
    sentAt: new Date(2026, 9, 8, 14, 22),
  },
  {
    id: "4",
    sender: "operator",
    text: "Добрый день! Перенесла бронь на субботу, 14:30. Ждём вас.",
    sentAt: new Date(2026, 9, 8, 14, 40),
  },
  {
    id: "5",
    sender: "client",
    text: "Спасибо, отлично!",
    sentAt: new Date(2026, 9, 8, 14, 41),
  },
];

const renderMessage = (message: DialogMessage) => {
  if (message.sender === "client") {
    return (
      <Message.Root direction="incoming" time={message.sentAt}>
        <Message.Text>{message.text}</Message.Text>
      </Message.Root>
    );
  }
  const author = AUTHORS[message.sender];
  return (
    <Message.Root direction="outgoing" time={message.sentAt} status="read">
      <Message.Author color={hueOf(message.sender)} tag={author.tag}>
        {author.name}
      </Message.Author>
      <Message.Text>{message.text}</Message.Text>
    </Message.Root>
  );
};

export default function ChatOutgoingAuthorsExample() {
  return (
    <Card.Root className={styles.short}>
      <Chat.Root>
        <Chat.Messages
          authors="outgoing"
          aria-label="Диалог с клиентом"
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
