/** A sales inbox of a thousand dialogs: only the rows around the view render, arrows walk through all of them, and the next page loads as the end comes near — `hasMore`, `onLoadMore`. */
import { Avatar, Card, ChatList, hueOf } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const NOW = new Date(2026, 9, 14, 15, 0);

const COMPANIES = [
  "Вектор",
  "Гранит",
  "Лето",
  "Север",
  "Альфа-Трейд",
  "ТехноСнаб",
  "Меридиан",
  "Ока",
];
const FORMS = ["ООО", "АО", "ИП"];
const TOPICS = [
  "Запрос коммерческого предложения",
  "Когда будет поставка?",
  "Пришлите счёт на предоплату",
  "Договор подписан, отправили оригинал",
  "Нужна скидка на объём",
  "Уточните сроки монтажа",
];

const PAGE = 250;
const TOTAL = 1000;

/** The dialogs of one page of the server's answer, newest first. */
const page = (from: number) =>
  Array.from({ length: PAGE }, (_, offset) => {
    const index = from + offset;
    const company = COMPANIES[index % COMPANIES.length] ?? "";
    const form = FORMS[index % FORMS.length] ?? "";
    return {
      id: `lead-${index}`,
      name: `${form} «${company}» №${index + 1}`,
      initials: company.slice(0, 2).toUpperCase(),
      preview: TOPICS[index % TOPICS.length] ?? "",
      at: new Date(NOW.getTime() - index * 47 * 60_000),
      unread: index % 7 === 0 ? (index % 5) + 1 : 0,
    };
  });

/** A stand-in for the server: the next page after a short wait. */
const fetchPage = (from: number) =>
  new Promise<ReturnType<typeof page>>((resolve) =>
    window.setTimeout(() => resolve(page(from)), 700),
  );

export default function ChatListLongListExample() {
  const [dialogs, setDialogs] = React.useState(() => page(0));
  const [dialogId, setDialogId] = React.useState<string | null>(null);

  const loadMore = async () => {
    const next = await fetchPage(dialogs.length);
    setDialogs((current) => (current.length === dialogs.length ? [...current, ...next] : current));
  };

  return (
    <Card.Root className={styles.pane}>
      <ChatList.Root
        items={dialogs}
        getKey={(item) => item.id}
        value={dialogId}
        onValueChange={setDialogId}
        hasMore={dialogs.length < TOTAL}
        onLoadMore={loadMore}
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
  );
}
