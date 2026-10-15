/** Dialogs with their own address: every row is a link to the ticket's page, the time reads as how long ago, and the list is named for its queue — `href`, `formatTime`, `labels`. */
import { Avatar, Card, ChatList, hueOf } from "prime-ui-kit";

import styles from "./examples.module.css";

const NOW = new Date(2026, 9, 14, 15, 0);
const at = (day: number, hour: number, minute: number) => new Date(2026, 9, day, hour, minute);

const DIALOGS = [
  {
    id: "t-1042",
    name: "ООО «Вектор»",
    initials: "ВК",
    preview: "Не можем выгрузить счёт в 1С",
    at: at(14, 14, 52),
    unread: 2,
  },
  {
    id: "t-1039",
    name: "ООО «Гранит»",
    initials: "ГР",
    preview: "Акт сверки подписан",
    at: at(14, 12, 5),
    unread: 0,
  },
  {
    id: "t-1031",
    name: "ИП Козлов",
    initials: "ИК",
    preview: "Подключите, пожалуйста, ЭДО",
    at: at(12, 11, 40),
    unread: 0,
  },
];

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** A support queue reads waiting time: «8 мин», «3 ч», «2 дн». */
const formatAgo = (date: Date, now: Date) => {
  const passed = now.getTime() - date.getTime();
  if (passed < HOUR) return `${Math.max(1, Math.round(passed / MINUTE))} мин`;
  if (passed < DAY) return `${Math.round(passed / HOUR)} ч`;
  return `${Math.round(passed / DAY)} дн`;
};

export default function ChatListLinksExample() {
  return (
    <Card.Root className={styles.short}>
      <ChatList.Root
        labels={{ list: "Обращения" }}
        items={DIALOGS}
        getKey={(item) => item.id}
        value="t-1042"
        now={NOW}
        formatTime={formatAgo}
        renderItem={(item) => (
          <ChatList.Item href={`/support/tickets/${item.id}`} time={item.at} unread={item.unread}>
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
