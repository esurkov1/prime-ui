/** The conversation in the zone of the manager's profile, not the browser's: the date separators, the runs and every time follow it — `timeZone`, `items`, `renderMessage`. */
import { Card, Chat, Message, SegmentedControl } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const ZONES = [
  { value: "Europe/Moscow", label: "Москва" },
  { value: "Asia/Vladivostok", label: "Владивосток" },
];

const NOW = new Date(Date.UTC(2026, 9, 15, 4, 0));
const utc = (day: number, hour: number, minute: number) =>
  new Date(Date.UTC(2026, 9, day, hour, minute));

const MESSAGES = [
  {
    id: "tz-1",
    author: "client",
    sentAt: utc(14, 12, 40),
    text: "Добрый вечер! Машина с заказом № 4821 уже вышла?",
  },
  {
    id: "tz-2",
    author: "manager",
    sentAt: utc(14, 13, 5),
    text: "Вышла в 18:00, будет у вас завтра до обеда.",
  },
  {
    id: "tz-3",
    author: "client",
    sentAt: utc(14, 14, 30),
    text: "Спасибо, предупрежу склад.",
  },
  {
    id: "tz-4",
    author: "manager",
    sentAt: utc(15, 0, 10),
    text: "Водитель на месте, выгрузка через 10 минут.",
  },
];

type ChatMessage = (typeof MESSAGES)[number];

export default function ChatTimeZoneExample() {
  const [zone, setZone] = React.useState("Asia/Vladivostok");

  return (
    <div className={styles.live}>
      <div className={styles.liveBar}>
        <SegmentedControl.Root value={zone} onValueChange={setZone} aria-label="Пояс профиля">
          {ZONES.map((item) => (
            <SegmentedControl.Item key={item.value} value={item.value}>
              {item.label}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
      </div>
      <Card.Root className={styles.short}>
        <Chat.Root>
          <Chat.Messages
            aria-label="Переписка по заказу № 4821"
            timeZone={zone}
            now={NOW}
            items={MESSAGES}
            getKey={(message: ChatMessage) => message.id}
            getAuthor={(message: ChatMessage) => message.author}
            getDate={(message: ChatMessage) => message.sentAt}
            renderMessage={(message: ChatMessage) => (
              <Message.Root
                direction={message.author === "manager" ? "outgoing" : "incoming"}
                time={message.sentAt}
                status={message.author === "manager" ? "read" : undefined}
              >
                <Message.Text>{message.text}</Message.Text>
              </Message.Root>
            )}
          />
        </Chat.Root>
      </Card.Root>
    </div>
  );
}
