/** Router links as the dialogs, the times in the zone of the operator's profile; render it inside a router — `asChild`, `timeZone`. */
import { Avatar, Card, ChatList, hueOf } from "prime-ui-kit";
import { Link } from "react-router-dom";

import styles from "./examples.module.css";

const NOW = new Date(Date.UTC(2026, 9, 15, 4, 0));
const utc = (day: number, hour: number, minute: number) =>
  new Date(Date.UTC(2026, 9, day, hour, minute));

const DIALOGS = [
  {
    id: "c-311",
    name: "ООО «Вектор»",
    initials: "ВК",
    preview: "Машина на месте, начинаем выгрузку",
    at: utc(15, 0, 10),
    unread: 1,
  },
  {
    id: "c-308",
    name: "ООО «Гранит»",
    initials: "ГР",
    preview: "Счёт № 2041 оплачен",
    at: utc(14, 14, 30),
    unread: 0,
  },
  {
    id: "c-297",
    name: "ИП Козлов",
    initials: "ИК",
    preview: "Пришлите, пожалуйста, акт сверки",
    at: utc(12, 6, 15),
    unread: 0,
  },
];

export default function ChatListRouterExample() {
  return (
    <Card.Root className={styles.short}>
      <ChatList.Root
        items={DIALOGS}
        getKey={(item) => item.id}
        defaultValue="c-311"
        now={NOW}
        timeZone="Asia/Vladivostok"
        renderItem={(item) => (
          <ChatList.Item asChild time={item.at} unread={item.unread}>
            <Link to={`/chats/${item.id}`}>
              <ChatList.ItemIcon>
                <Avatar.Root color={hueOf(item.id)}>
                  <Avatar.Fallback>{item.initials}</Avatar.Fallback>
                </Avatar.Root>
              </ChatList.ItemIcon>
              <ChatList.ItemText>{item.name}</ChatList.ItemText>
              <ChatList.ItemDescription>{item.preview}</ChatList.ItemDescription>
            </Link>
          </ChatList.Item>
        )}
      />
    </Card.Root>
  );
}
