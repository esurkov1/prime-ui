/** At phone width long names and previews truncate while the time and counts stay whole; a pane squeezed under 240px keeps only the names and the counts — `ChatList.Root`, `search`. */
import { Avatar, Card, ChatList, hueOf } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const NOW = new Date(2026, 9, 14, 15, 0);
const at = (day: number, hour: number, minute: number) => new Date(2026, 9, day, hour, minute);

const DIALOGS = [
  {
    id: "sever",
    name: "АО «Северсталь-Сервис», отдел закупок",
    initials: "СС",
    preview: "Пришлите, пожалуйста, обновлённую спецификацию с учётом новых цен",
    at: at(14, 14, 32),
    unread: 128,
  },
  {
    id: "vector",
    name: "ООО «Вектор»",
    initials: "ВК",
    preview: "Не можем выгрузить счёт INV-2048 в 1С, ошибка после экспорта",
    at: at(14, 9, 5),
    unread: 0,
  },
  {
    id: "kozlov",
    name: "ИП Козлов Андрей Викторович",
    initials: "ИК",
    preview: "Подключите, пожалуйста, ЭДО",
    at: at(11, 11, 40),
    unread: 1,
  },
  {
    id: "leto",
    name: "ООО «Лето»",
    initials: "ЛТ",
    preview: "Можно перенести доставку на среду?",
    at: at(2, 9, 15),
    unread: 0,
  },
];

type Dialog = (typeof DIALOGS)[number];

const renderDialog = (item: Dialog) => (
  <ChatList.Item time={item.at} unread={item.unread}>
    <ChatList.ItemIcon>
      <Avatar.Root color={hueOf(item.id)}>
        <Avatar.Fallback>{item.initials}</Avatar.Fallback>
      </Avatar.Root>
    </ChatList.ItemIcon>
    <ChatList.ItemText>{item.name}</ChatList.ItemText>
    <ChatList.ItemDescription>{item.preview}</ChatList.ItemDescription>
  </ChatList.Item>
);

export default function ChatListNarrowExample() {
  const [query, setQuery] = React.useState("");
  const needle = query.trim().toLowerCase();
  const found = DIALOGS.filter((item) => item.name.toLowerCase().includes(needle));

  return (
    <>
      <Card.Root className={styles.phone}>
        <ChatList.Root
          items={found}
          getKey={(item) => item.id}
          defaultValue="vector"
          search={query}
          onSearchChange={setQuery}
          now={NOW}
          renderItem={renderDialog}
        />
      </Card.Root>
      <Card.Root className={styles.rail}>
        <ChatList.Root
          items={DIALOGS}
          getKey={(item) => item.id}
          defaultValue="vector"
          now={NOW}
          renderItem={renderDialog}
        />
      </Card.Root>
    </>
  );
}
