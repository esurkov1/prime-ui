/** A team chat built from data: `groupMessages` adds the dates and runs, the author's name opens a run and the avatar closes it — `avatars`, `groupMessages`, `Message.Avatar`, `Message.Author`. */
import { Avatar, groupMessages, Message, type PaletteColor } from "prime-ui-kit";

type ChatMessage = {
  id: string;
  author: string;
  text: string;
  sentAt: Date;
};

const NOW = new Date(2026, 9, 8, 15, 0);

const PEOPLE: Record<string, { name: string; initials: string; color: PaletteColor }> = {
  anna: { name: "Анна Котова", initials: "АК", color: "green" },
  oleg: { name: "Олег Смирнов", initials: "ОС", color: "purple" },
  me: { name: "Вы", initials: "ВЫ", color: "blue" },
};

const MESSAGES: ChatMessage[] = [
  {
    id: "1",
    author: "anna",
    text: "Коллеги, релиз 2.4 переносим на четверг.",
    sentAt: new Date(2026, 9, 7, 18, 40),
  },
  {
    id: "2",
    author: "anna",
    text: "Причина — миграция базы счетов.",
    sentAt: new Date(2026, 9, 7, 18, 41),
  },
  {
    id: "3",
    author: "oleg",
    text: "Понял, предупрежу клиентов.",
    sentAt: new Date(2026, 9, 8, 9, 15),
  },
  {
    id: "4",
    author: "oleg",
    text: "Шаблон письма уже есть в базе знаний.",
    sentAt: new Date(2026, 9, 8, 9, 16),
  },
  { id: "5", author: "oleg", text: "Отправлю до обеда.", sentAt: new Date(2026, 9, 8, 9, 17) },
  { id: "6", author: "me", text: "+", sentAt: new Date(2026, 9, 8, 9, 29) },
  {
    id: "7",
    author: "me",
    text: "Обновлю дату в календаре релизов.",
    sentAt: new Date(2026, 9, 8, 9, 30),
  },
];

const ENTRIES = groupMessages(MESSAGES, {
  getAuthor: (message) => message.author,
  getDate: (message) => message.sentAt,
  getKey: (message) => message.id,
  now: NOW,
});

export default function MessageGroupChatExample() {
  return (
    <Message.Group avatars aria-label="Чат команды релиза">
      {ENTRIES.map((entry) => {
        if (entry.type === "date") {
          return <Message.Separator key={entry.key}>{entry.label}</Message.Separator>;
        }
        const { item, position, showAuthor, showAvatar } = entry;
        const person = PEOPLE[item.author];
        const outgoing = item.author === "me";
        return (
          <Message.Root
            key={entry.key}
            direction={outgoing ? "outgoing" : "incoming"}
            position={position}
            time={item.sentAt}
            status={outgoing ? "read" : undefined}
          >
            {!outgoing && showAvatar ? (
              <Message.Avatar>
                <Avatar.Root color={person.color}>
                  <Avatar.Fallback>{person.initials}</Avatar.Fallback>
                </Avatar.Root>
              </Message.Avatar>
            ) : null}
            {!outgoing && showAuthor ? (
              <Message.Author color={person.color}>{person.name}</Message.Author>
            ) : null}
            <Message.Text>{item.text}</Message.Text>
          </Message.Root>
        );
      })}
    </Message.Group>
  );
}
