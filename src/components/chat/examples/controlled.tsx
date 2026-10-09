/** Selection mode owned by the screen: the Select item of a message's menu starts it, a check stands beside every message, a press toggles one while the others step back, the bar counts and acts, Escape leaves — `selected`, `onSelectedChange`, `Chat.SelectionBar`. */
import { Button, Card, Chat, Dropdown, Icon, Message } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const MESSAGES = [
  {
    id: "shipment-1",
    direction: "incoming",
    time: "10:02",
    text: "Отгрузка 1187 задерживается на день.",
  },
  { id: "shipment-2", direction: "incoming", time: "10:03", text: "Новая дата — 10 октября." },
  { id: "shipment-3", direction: "outgoing", time: "10:05", text: "Понял, сообщу клиенту." },
] as const;

export default function ChatControlledExample() {
  const [messages, setMessages] = React.useState<readonly (typeof MESSAGES)[number][]>(MESSAGES);
  const [selected, setSelected] = React.useState<readonly string[] | null>(["shipment-2"]);

  const remove = () => {
    setMessages((current) => current.filter((message) => !selected?.includes(message.id)));
    setSelected(null);
  };

  return (
    <Card.Root className={styles.short}>
      <Chat.Root selected={selected} onSelectedChange={setSelected}>
        <Chat.Messages aria-label="Переписка по отгрузке 1187">
          {messages.map((message) => (
            <Message.Root
              key={message.id}
              value={message.id}
              direction={message.direction}
              time={message.time}
              status={message.direction === "outgoing" ? "read" : undefined}
            >
              <Message.Text>{message.text}</Message.Text>
              <Message.Menu>
                <Dropdown.Item>
                  <Dropdown.ItemIcon>
                    <Icon name="action.reply" />
                  </Dropdown.ItemIcon>
                  Ответить
                </Dropdown.Item>
              </Message.Menu>
            </Message.Root>
          ))}
          <Chat.SelectionBar>
            <Button.Root variant="soft" tone="neutral" size="s" disabled={selected?.length === 0}>
              Переслать
            </Button.Root>
            <Button.Root
              variant="soft"
              tone="danger"
              size="s"
              disabled={selected?.length === 0}
              onClick={remove}
            >
              Удалить
            </Button.Root>
          </Chat.SelectionBar>
        </Chat.Messages>
      </Chat.Root>
    </Card.Root>
  );
}
