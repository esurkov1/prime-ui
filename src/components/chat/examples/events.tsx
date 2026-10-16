/** What happened to the client, right in the dialog: who took it, a stage it moved to, a manager who joined; events in a row stand as one group, a new one rises in at the end — `isService`, `Chat.Service`, `Chat.ServiceIcon`, `Chat.ServiceChange`, `time`. */
import { Badge, Button, Card, Chat, Icon, Message } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const NOW = new Date(2026, 9, 15, 11, 0);
const at = (hour: number, minute: number) => new Date(2026, 9, 15, hour, minute);

type DialogItem =
  | { id: string; kind: "message"; author: "client" | "agent"; sentAt: Date; text: string }
  | { id: string; kind: "taken"; sentAt: Date }
  | { id: string; kind: "stage"; sentAt: Date; from: string; to: string }
  | { id: string; kind: "joined"; sentAt: Date; manager: string };

const DIALOG: DialogItem[] = [
  {
    id: "ev-1",
    kind: "message",
    author: "client",
    sentAt: at(10, 12),
    text: "Здравствуйте! Ищу склад под аренду, 100–150 м², с 1 ноября.",
  },
  { id: "ev-2", kind: "taken", sentAt: at(10, 12) },
  { id: "ev-3", kind: "stage", sentAt: at(10, 12), from: "Лид", to: "Арендатор" },
  {
    id: "ev-4",
    kind: "message",
    author: "agent",
    sentAt: at(10, 13),
    text: "Добрый день! Есть склад 120 м² на Складской, 4, свободен с 25 октября. Прислать планировку?",
  },
  {
    id: "ev-5",
    kind: "message",
    author: "client",
    sentAt: at(10, 15),
    text: "Да, и хотелось бы обсудить скидку за год вперёд.",
  },
];

const JOINED: DialogItem = {
  id: "ev-6",
  kind: "joined",
  sentAt: at(10, 16),
  manager: "Анна Котова",
};

function renderItem(item: DialogItem) {
  if (item.kind === "taken") {
    return (
      <Chat.Service time={item.sentAt}>
        <Chat.ServiceIcon>
          <Icon name="object.bot" />
        </Chat.ServiceIcon>
        ИИ-агент взял клиента
      </Chat.Service>
    );
  }
  if (item.kind === "stage") {
    return (
      <Chat.Service time={item.sentAt}>
        <Chat.ServiceIcon>
          <Icon name="object.funnel" />
        </Chat.ServiceIcon>
        ИИ-агент перевёл клиента
        <Chat.ServiceChange
          from={<Badge.Root color="gray">{item.from}</Badge.Root>}
          to={<Badge.Root color="green">{item.to}</Badge.Root>}
        />
      </Chat.Service>
    );
  }
  if (item.kind === "joined") {
    return (
      <Chat.Service time={item.sentAt}>
        <Chat.ServiceIcon>
          <Icon name="object.user" />
        </Chat.ServiceIcon>
        Менеджер {item.manager} подключилась к диалогу
      </Chat.Service>
    );
  }
  return (
    <Message.Root
      direction={item.author === "agent" ? "outgoing" : "incoming"}
      time={item.sentAt}
      status={item.author === "agent" ? "read" : undefined}
    >
      <Message.Text>{item.text}</Message.Text>
    </Message.Root>
  );
}

export default function ChatEventsExample() {
  const [items, setItems] = React.useState(DIALOG);
  const joined = items.includes(JOINED);

  return (
    <div className={styles.live}>
      <div className={styles.liveBar}>
        <Button.Root
          variant="soft"
          disabled={joined}
          onClick={() => setItems((current) => [...current, JOINED])}
        >
          <Button.Icon>
            <Icon name="action.addContact" />
          </Button.Icon>
          Подключить менеджера
        </Button.Root>
      </div>
      <Card.Root className={styles.short}>
        <Chat.Root>
          <Chat.Messages
            aria-label="Диалог с клиентом «Склад на Складской»"
            now={NOW}
            items={items}
            getKey={(item: DialogItem) => item.id}
            getAuthor={(item: DialogItem) => (item.kind === "message" ? item.author : "system")}
            getDate={(item: DialogItem) => item.sentAt}
            isService={(item: DialogItem) => item.kind !== "message"}
            renderMessage={renderItem}
          />
        </Chat.Root>
      </Card.Root>
    </div>
  );
}
