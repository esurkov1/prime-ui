/** A live support chat: the client types, then answers; new messages enter at the end, read receipts come from what is on screen, and scrolled up the round button counts what arrived — `onNewMessage`, `onRead`, `Message.Typing`, `ScrollContainer`. */
import { Button, Card, Message, ScrollContainer, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Row = { id: string; from: "client" | "me"; text: string; time: string };

const START: Row[] = [
  { id: "l1", from: "client", text: "Добрый день! Где мой заказ № 4821?", time: "14:02" },
  { id: "l2", from: "me", text: "Здравствуйте! Он передан в доставку.", time: "14:03" },
  { id: "l3", from: "client", text: "А когда его привезут?", time: "14:05" },
  { id: "l4", from: "me", text: "Курьер позвонит за час до приезда.", time: "14:06" },
];

const CLIENT_LINES = [
  "Можно перенести доставку на вечер?",
  "И ещё: счёт придёт на почту?",
  "Спасибо за помощь!",
];

const TYPING_MS = 1500;

export default function MessageLiveExample() {
  const [rows, setRows] = React.useState(START);
  const [typing, setTyping] = React.useState(false);
  const [unread, setUnread] = React.useState(0);
  const [read, setRead] = React.useState<readonly string[]>([]);
  const next = React.useRef(0);

  const receive = () => {
    if (typing) return;
    setTyping(true);
    window.setTimeout(() => {
      const text = CLIENT_LINES[next.current % CLIENT_LINES.length] ?? "";
      next.current += 1;
      setTyping(false);
      setRows((current) => [
        ...current,
        { id: `client-${Date.now()}`, from: "client", text, time: "14:10" },
      ]);
    }, TYPING_MS);
  };

  return (
    <div className={styles.live}>
      <div className={styles.liveBar}>
        <Button.Root variant="soft" tone="neutral" disabled={typing} onClick={receive}>
          Клиент пишет
        </Button.Root>
        <Typography as="span" variant="body-s" tone="secondary" aria-live="polite">
          Непрочитанных: {unread} · прочитано: {read.length}
        </Typography>
      </div>
      <Card.Root className={styles.liveCard}>
        <ScrollContainer anchor="end" className={styles.thread}>
          <Message.Group
            aria-label="Чат с клиентом"
            onNewMessage={(_, { direction }) => {
              if (direction === "incoming") setUnread((count) => count + 1);
            }}
            onRead={(values) => {
              setRead((current) => [...current, ...values]);
              setUnread((count) => Math.max(0, count - values.length));
            }}
          >
            {rows.map((row) => (
              <Message.Root
                key={row.id}
                value={row.id}
                direction={row.from === "me" ? "outgoing" : "incoming"}
                time={row.time}
                status={row.from === "me" ? "read" : undefined}
              >
                <Message.Text>{row.text}</Message.Text>
              </Message.Root>
            ))}
            <Message.Typing active={typing} />
          </Message.Group>
        </ScrollContainer>
      </Card.Root>
    </div>
  );
}
