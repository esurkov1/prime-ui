/** The open dialog lives in the screen: a row opens it beside the list, and a next-unread button opens the next one from outside — `value`, `onValueChange`. */
import { Avatar, Button, Card, ChatList, hueOf, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const NOW = new Date(2026, 9, 14, 15, 0);
const at = (day: number, hour: number, minute: number) => new Date(2026, 9, day, hour, minute);

const DIALOGS = [
  {
    id: "vector",
    name: "ООО «Вектор»",
    initials: "ВК",
    preview: "Не можем выгрузить счёт в 1С",
    at: at(14, 14, 32),
    unread: 2,
  },
  {
    id: "granit",
    name: "ООО «Гранит»",
    initials: "ГР",
    preview: "Акт сверки подписан",
    at: at(14, 12, 5),
    unread: 0,
  },
  {
    id: "kozlov",
    name: "ИП Козлов",
    initials: "ИК",
    preview: "Подключите, пожалуйста, ЭДО",
    at: at(13, 11, 40),
    unread: 1,
  },
  {
    id: "leto",
    name: "ООО «Лето»",
    initials: "ЛТ",
    preview: "Можно перенести доставку?",
    at: at(12, 9, 15),
    unread: 3,
  },
];

export default function ChatListControlledExample() {
  const [dialogs, setDialogs] = React.useState(DIALOGS);
  const [dialogId, setDialogId] = React.useState<string | null>(null);

  const open = (id: string) => {
    setDialogId(id);
    setDialogs((current) =>
      current.map((item) => (item.id === id ? { ...item, unread: 0 } : item)),
    );
  };
  const nextUnread = dialogs.find((item) => item.unread > 0);
  const dialog = dialogs.find((item) => item.id === dialogId);

  return (
    <div className={styles.stage}>
      <div className={styles.bar}>
        <Button.Root
          variant="soft"
          tone="neutral"
          disabled={!nextUnread}
          onClick={() => {
            if (nextUnread) open(nextUnread.id);
          }}
        >
          Следующий непрочитанный
        </Button.Root>
      </div>
      <div className={styles.split}>
        <Card.Root>
          <ChatList.Root
            items={dialogs}
            getKey={(item) => item.id}
            value={dialogId}
            onValueChange={open}
            now={NOW}
            renderItem={(item) => (
              <ChatList.Item time={item.at} unread={item.unread}>
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
        <Card.Root>
          <Card.Body>
            <Typography variant="body-m" tone={dialog ? "default" : "muted"}>
              {dialog ? `Открыт диалог: ${dialog.name}` : "Выберите диалог слева"}
            </Typography>
          </Card.Body>
        </Card.Root>
      </div>
    </div>
  );
}
