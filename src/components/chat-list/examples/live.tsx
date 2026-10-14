/** A live inbox: a client types, then writes — the preview turns into the typing line and back, the count rolls up and the dialog glides to the top; opening it clears the count — `typing`, `unread`, `items`. */
import { Avatar, Button, Card, ChatList, hueOf } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Dialog = {
  id: string;
  name: string;
  initials: string;
  preview: string;
  at: Date;
  unread: number;
  typing: boolean;
};

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000);

const DIALOGS: Dialog[] = [
  {
    id: "vector",
    name: "ООО «Вектор»",
    initials: "ВК",
    preview: "Спасибо, всё работает",
    at: minutesAgo(5),
    unread: 0,
    typing: false,
  },
  {
    id: "granit",
    name: "ООО «Гранит»",
    initials: "ГР",
    preview: "Акт сверки подписан",
    at: minutesAgo(40),
    unread: 0,
    typing: false,
  },
  {
    id: "kozlov",
    name: "ИП Козлов",
    initials: "ИК",
    preview: "Подключите ЭДО",
    at: minutesAgo(90),
    unread: 1,
    typing: false,
  },
  {
    id: "leto",
    name: "ООО «Лето»",
    initials: "ЛТ",
    preview: "Доставка в среду",
    at: minutesAgo(200),
    unread: 0,
    typing: false,
  },
];

/** Who writes next and what: the bottom dialogs come up one after another. */
const INCOMING = [
  { id: "leto", text: "Машина будет к девяти, пропуск заказан" },
  { id: "kozlov", text: "Получили приглашение в ЭДО, спасибо" },
  { id: "granit", text: "Пришлите, пожалуйста, счёт на ноябрь" },
];

const TYPING_MS = 1600;

export default function ChatListLiveExample() {
  const [dialogs, setDialogs] = React.useState(DIALOGS);
  const [dialogId, setDialogId] = React.useState<string | null>("vector");
  const [step, setStep] = React.useState(0);
  const [busy, setBusy] = React.useState(false);

  const patch = (id: string, next: Partial<Dialog>) =>
    setDialogs((current) => current.map((item) => (item.id === id ? { ...item, ...next } : item)));

  const receive = () => {
    const message = INCOMING[step % INCOMING.length];
    if (!message) return;
    setStep(step + 1);
    setBusy(true);
    patch(message.id, { typing: true });
    window.setTimeout(() => {
      setDialogs((current) =>
        current.map((item) =>
          item.id === message.id
            ? {
                ...item,
                typing: false,
                preview: message.text,
                at: new Date(),
                unread: item.id === dialogId ? 0 : item.unread + 1,
              }
            : item,
        ),
      );
      setBusy(false);
    }, TYPING_MS);
  };

  const shown = [...dialogs].sort((a, b) => +b.at - +a.at);

  return (
    <div className={styles.stage}>
      <div className={styles.bar}>
        <Button.Root variant="soft" tone="neutral" loading={busy} onClick={receive}>
          Клиент пишет
        </Button.Root>
      </div>
      <Card.Root className={styles.short}>
        <ChatList.Root
          items={shown}
          getKey={(item) => item.id}
          value={dialogId}
          onValueChange={(id) => {
            setDialogId(id);
            patch(id, { unread: 0 });
          }}
          renderItem={(item) => (
            <ChatList.Item time={item.at} unread={item.unread} typing={item.typing}>
              <ChatList.ItemIcon>
                <Avatar.Root color={hueOf(item.id)}>
                  <Avatar.Fallback>{item.initials}</Avatar.Fallback>
                </Avatar.Root>
              </ChatList.ItemIcon>
              <ChatList.ItemText>{item.name}</ChatList.ItemText>
              <ChatList.ItemDescription>{item.preview}</ChatList.ItemDescription>
            </ChatList.Item>
          )}
        />
      </Card.Root>
    </div>
  );
}
