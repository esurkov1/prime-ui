/** The search field filters dialogs by name and by the last message, marks the match in both, says how many were found and shows a quiet state when none match — `defaultSearch`, `onSearchChange`. */
import { Avatar, Card, ChatList, hueOf } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const NOW = new Date(2026, 9, 14, 15, 0);
const at = (day: number, hour: number, minute: number) => new Date(2026, 9, day, hour, minute);

const DIALOGS = [
  {
    id: "vector",
    name: "ООО «Вектор»",
    initials: "ВК",
    preview: "Счёт INV-2048 не выгружается в 1С",
    at: at(14, 14, 32),
  },
  {
    id: "granit",
    name: "ООО «Гранит»",
    initials: "ГР",
    preview: "Пришлите счёт на предоплату",
    at: at(14, 12, 5),
  },
  {
    id: "kozlov",
    name: "ИП Козлов",
    initials: "ИК",
    preview: "Подключите, пожалуйста, ЭДО",
    at: at(13, 11, 40),
  },
  {
    id: "schetovod",
    name: "Счетовод — интеграция",
    initials: "СИ",
    preview: "Токен обновлён",
    at: at(10, 9, 0),
  },
];

export default function ChatListSearchExample() {
  const [query, setQuery] = React.useState("счёт");
  const needle = query.trim().toLowerCase();
  const found = DIALOGS.filter(
    (item) =>
      item.name.toLowerCase().includes(needle) || item.preview.toLowerCase().includes(needle),
  );

  return (
    <Card.Root className={styles.short}>
      <ChatList.Root
        items={found}
        getKey={(item) => item.id}
        defaultSearch="счёт"
        onSearchChange={setQuery}
        now={NOW}
        renderItem={(item) => (
          <ChatList.Item time={item.at}>
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
  );
}
