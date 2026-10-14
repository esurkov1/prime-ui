/** The first load of a conversation: bubble-shaped placeholders on both sides stand in the list's place, then cross-fade into the messages — `loading`. */
import { Button, Card, Chat, Message } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const LOAD_MS = 1500;

const MESSAGES = [
  {
    id: "m-a",
    direction: "incoming",
    time: "09:58",
    text: "Здравствуйте! Подскажите, когда выставите счёт по договору № 118?",
  },
  {
    id: "m-b",
    direction: "outgoing",
    time: "10:02",
    text: "Добрый день! Счёт № 2041 уже в личном кабинете, продублировал на почту.",
  },
  {
    id: "m-c",
    direction: "incoming",
    time: "10:03",
    text: "Получили, передаю в бухгалтерию.",
  },
  {
    id: "m-1",
    direction: "incoming",
    time: "10:12",
    text: "Добрый день! Счёт № 2041 оплатили, проверьте, пожалуйста.",
  },
  {
    id: "m-2",
    direction: "outgoing",
    time: "10:15",
    text: "Вижу оплату, спасибо. Отгрузка — завтра до обеда.",
  },
  {
    id: "m-3",
    direction: "incoming",
    time: "10:16",
    text: "Отлично. Закрывающие документы пришлёте в ЭДО?",
  },
  {
    id: "m-4",
    direction: "outgoing",
    time: "10:18",
    text: "Да, акт и УПД уйдут вместе с отгрузкой.",
  },
  {
    id: "m-5",
    direction: "incoming",
    time: "10:19",
    text: "Спасибо, ждём.",
  },
] as const;

export default function ChatStatesExample() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => setLoading(false), LOAD_MS);
    return () => window.clearTimeout(timer);
  }, [loading]);

  return (
    <div className={styles.live}>
      <div className={styles.liveBar}>
        <Button.Root
          variant="soft"
          tone="neutral"
          disabled={loading}
          onClick={() => setLoading(true)}
        >
          Открыть заново
        </Button.Root>
      </div>
      <Card.Root className={styles.short}>
        <Chat.Root>
          <Chat.Messages aria-label="Переписка с ООО «Вектор»" loading={loading}>
            {MESSAGES.map((message) => (
              <Message.Root
                key={message.id}
                value={message.id}
                direction={message.direction}
                time={message.time}
                status={message.direction === "outgoing" ? "read" : undefined}
              >
                <Message.Text>{message.text}</Message.Text>
              </Message.Root>
            ))}
          </Chat.Messages>
        </Chat.Root>
      </Card.Root>
    </div>
  );
}
