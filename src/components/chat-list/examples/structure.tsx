/** Every piece of a row: a photo or initials with presence, a glyph beside the name, the record status as badges, the author of the last message, media words with a length, a member typing in a group, ticks from sending to failed — `ChatList.ItemIcon`, `ChatList.ItemBadges`, `ChatList.ItemDescription`, `author`, `kind`, `duration`, `typing`, `status`. */
import { Avatar, Badge, Card, ChatList, hueOf, Icon, type MessageStatus } from "prime-ui-kit";

import styles from "./examples.module.css";

type Dialog = {
  id: string;
  name: string;
  initials: string;
  photo?: string;
  online?: boolean;
  verified?: boolean;
  group?: boolean;
  at: Date;
  author?: string;
  kind?: "photo" | "voice" | "videoNote" | "file" | "location";
  duration?: number;
  text?: string;
  status?: MessageStatus;
  typing?: string;
  unread?: number;
  record?: { label: string; stage?: boolean }[];
};

const NOW = new Date(2026, 9, 14, 15, 0);
const at = (day: number, hour: number, minute: number) => new Date(2026, 9, day, hour, minute);

const DIALOGS: Dialog[] = [
  {
    id: "irina",
    name: "Ирина Белова",
    initials: "ИБ",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop",
    online: true,
    at: at(14, 14, 40),
    kind: "photo",
    text: "Вот так выглядит ошибка",
    unread: 1,
    record: [{ label: "Бронь", stage: true }, { label: "Ждёт человека" }],
  },
  {
    id: "prime-bot",
    name: "Prime Бот",
    initials: "ПБ",
    verified: true,
    at: at(14, 13, 10),
    kind: "file",
    text: "Счёт INV-2051.pdf",
  },
  {
    id: "orlov",
    name: "Дмитрий Орлов",
    initials: "ДО",
    at: at(14, 11, 2),
    author: "Вы",
    kind: "voice",
    duration: 42,
    status: "sending",
  },
  {
    id: "warehouse",
    name: "Склад «Центральный»",
    initials: "СЦ",
    group: true,
    at: at(13, 18, 30),
    author: "Олег",
    kind: "location",
    text: "Рампа 2",
    typing: "Анна",
    record: [{ label: "AI ответит в 16:00" }],
  },
  {
    id: "lena",
    name: "Елена Смирнова",
    initials: "ЕС",
    at: at(12, 9, 0),
    author: "Вы",
    kind: "videoNote",
    duration: 6,
    status: "read",
  },
  {
    id: "leto",
    name: "ООО «Лето»",
    initials: "ЛТ",
    at: at(1, 16, 45),
    author: "Вы",
    text: "Отправил акт повторно",
    status: "failed",
  },
];

export default function ChatListStructureExample() {
  return (
    <Card.Root className={styles.pane}>
      <ChatList.Root
        items={DIALOGS}
        getKey={(item) => item.id}
        defaultValue="irina"
        now={NOW}
        renderItem={(item) => (
          <ChatList.Item
            time={item.at}
            status={item.status}
            unread={item.unread}
            typing={item.typing}
          >
            <ChatList.ItemIcon>
              <Avatar.Root color={hueOf(item.id)}>
                {item.photo ? <Avatar.Image src={item.photo} alt="" /> : null}
                <Avatar.Fallback>{item.initials}</Avatar.Fallback>
                {item.online ? <Avatar.Status status="online" /> : null}
              </Avatar.Root>
            </ChatList.ItemIcon>
            <ChatList.ItemText>{item.name}</ChatList.ItemText>
            {item.verified ? (
              <ChatList.ItemIcon aria-label="Официальный аккаунт">
                <Icon name="status.success" tone="accent" />
              </ChatList.ItemIcon>
            ) : null}
            {item.group ? (
              <ChatList.ItemIcon aria-label="Группа">
                <Icon name="object.users" />
              </ChatList.ItemIcon>
            ) : null}
            {item.record ? (
              <ChatList.ItemBadges>
                {item.record.map((badge) =>
                  badge.stage ? (
                    <Badge.Root key={badge.label} color="yellow">
                      {badge.label}
                    </Badge.Root>
                  ) : (
                    <Badge.Root key={badge.label} tone="warning">
                      {badge.label}
                    </Badge.Root>
                  ),
                )}
              </ChatList.ItemBadges>
            ) : null}
            <ChatList.ItemDescription
              author={item.author}
              kind={item.kind}
              duration={item.duration}
            >
              {item.text}
            </ChatList.ItemDescription>
          </ChatList.Item>
        )}
      />
    </Card.Root>
  );
}
