/** A channel picker in the search bar: one control of the field's height stands before it and filters the conversation, the search finds within what it shows — `Chat.Search`, `Select.Root`. */
import { Card, Chat, Message, Select } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Channel = "telegram" | "email";

type ClientMessage = {
  id: string;
  channel: Channel;
  direction: "incoming" | "outgoing";
  text: string;
  sentAt: Date;
};

const NOW = new Date(2026, 9, 8, 15, 0);

const MESSAGES: ClientMessage[] = [
  {
    id: "1",
    channel: "email",
    direction: "incoming",
    text: "Добрый день! Пришлите счёт на поставку по заказу №4120.",
    sentAt: new Date(2026, 9, 8, 9, 12),
  },
  {
    id: "2",
    channel: "email",
    direction: "outgoing",
    text: "Счёт INV-4120 во вложении, оплата до пятницы.",
    sentAt: new Date(2026, 9, 8, 9, 40),
  },
  {
    id: "3",
    channel: "telegram",
    direction: "incoming",
    text: "Счёт получили, бухгалтерия оплатит сегодня.",
    sentAt: new Date(2026, 9, 8, 11, 5),
  },
  {
    id: "4",
    channel: "telegram",
    direction: "outgoing",
    text: "Спасибо! Как придёт оплата, отгрузим со склада.",
    sentAt: new Date(2026, 9, 8, 11, 7),
  },
  {
    id: "5",
    channel: "telegram",
    direction: "incoming",
    text: "Платёжку по счёту отправила, проверьте, пожалуйста.",
    sentAt: new Date(2026, 9, 8, 14, 30),
  },
];

export default function ChatChannelSearchExample() {
  const [channel, setChannel] = React.useState("all");
  const items =
    channel === "all" ? MESSAGES : MESSAGES.filter((message) => message.channel === channel);

  return (
    <Card.Root className={styles.short}>
      <Chat.Root>
        <Chat.Header>
          <Chat.Title>Ольга Ветрова</Chat.Title>
          <Chat.Description>ООО «Северный ветер»</Chat.Description>
        </Chat.Header>
        <Chat.Search persistent>
          <Select.Root value={channel} onValueChange={setChannel}>
            <Select.Trigger aria-label="Канал">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="all">Все каналы</Select.Item>
              <Select.Item value="telegram">Telegram</Select.Item>
              <Select.Item value="email">Почта</Select.Item>
            </Select.Content>
          </Select.Root>
        </Chat.Search>
        <Chat.Messages
          items={items}
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
