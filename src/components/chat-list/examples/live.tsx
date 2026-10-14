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
  // The dialogs and the open one in one state: a message that arrives later reads which dialog is
  // open then, not when it was sent.
  const [inbox, setInbox] = React.useState<{ dialogs: Dialog[]; open: string | null }>({
    dialogs: DIALOGS,
    open: "vector",
  });
  const { dialogs, open: dialogId } = inbox;
  const [step, setStep] = React.useState(0);
  const [busy, setBusy] = React.useState(false);

  const patch = (id: string, next: (item: Dialog, open: string | null) => Partial<Dialog>) =>
    setInbox((current) => ({
      ...current,
      dialogs: current.dialogs.map((item) =>
        item.id === id ? { ...item, ...next(item, current.open) } : item,
      ),
    }));

  const receive = () => {
    const message = INCOMING[step % INCOMING.length];
    if (!message) return;
    setStep(step + 1);
    setBusy(true);
    patch(message.id, () => ({ typing: true }));
    window.setTimeout(() => {
      patch(message.id, (item, open) => ({
        typing: false,
        preview: message.text,
        at: new Date(),
        unread: item.id === open ? 0 : item.unread + 1,
      }));
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
          onValueChange={(id) =>
            setInbox((current) => ({
              open: id,
              dialogs: current.dialogs.map((item) =>
                item.id === id ? { ...item, unread: 0 } : item,
              ),
            }))
          }
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
