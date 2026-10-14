/** A team chat from data: the first message of an author's run opens with the name in the author's hue, a crown for the owner and the member's tag; the avatar — a photo, or initials — closes the run, which holds messages up to a quarter of an hour apart; the dates carry the weekday — `group`, `items`, `renderMessage`, `groupWindow`, `formatDate`, `Message.Author`, `tag`, `Message.AuthorIcon`, `hueOf`. */
import { Avatar, Card, Chat, hueOf, Icon, Message } from "prime-ui-kit";

import styles from "./examples.module.css";

type Person = {
  id: string;
  name: string;
  initials: string;
  src?: string;
  tag?: string;
  owner?: boolean;
};

type ChatMessage = { id: string; author: string; text: string; sentAt: Date };

const NOW = new Date(2026, 9, 8, 15, 0);

const PEOPLE: Record<string, Person> = {
  anna: {
    id: "anna",
    name: "Анна Котова",
    initials: "АК",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
    tag: "Логистика",
  },
  oleg: {
    id: "oleg",
    name: "Олег Смирнов",
    initials: "ОС",
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop",
    tag: "Админ",
    owner: true,
  },
  irina: {
    id: "irina",
    name: "Ирина Белова-Константинопольская",
    initials: "ИБ",
    tag: "Бухгалтерия",
  },
  me: { id: "me", name: "Вы", initials: "ВЫ" },
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
    sentAt: new Date(2026, 9, 7, 18, 52),
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
  {
    id: "5",
    author: "irina",
    text: "Акты сверки отправлю после релиза.",
    sentAt: new Date(2026, 9, 8, 9, 20),
  },
  {
    id: "6",
    author: "me",
    text: "Обновлю дату в календаре релизов.",
    sentAt: new Date(2026, 9, 8, 9, 30),
  },
];

/** A team writes in bursts: a run holds one author's messages up to 15 minutes apart. */
const RUN_MINUTES = 15;

const DAY = new Intl.DateTimeFormat("ru", { weekday: "long", day: "numeric", month: "long" });

/** «Среда, 8 октября»: the weekday matters in a work week. */
const formatDay = (date: Date) => {
  const label = DAY.format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
};

const renderMessage = (message: ChatMessage) => {
  const person = PEOPLE[message.author] as Person;
  const outgoing = message.author === "me";
  return (
    <Message.Root
      direction={outgoing ? "outgoing" : "incoming"}
      time={message.sentAt}
      status={outgoing ? "read" : undefined}
    >
      <Message.Avatar>
        <Avatar.Root color={hueOf(person.id)}>
          {person.src ? <Avatar.Image src={person.src} alt="" /> : null}
          <Avatar.Fallback>{person.initials}</Avatar.Fallback>
        </Avatar.Root>
      </Message.Avatar>
      {outgoing ? null : (
        <Message.Author color={hueOf(person.id)} tag={person.tag}>
          {person.name}
          {person.owner ? (
            <Message.AuthorIcon>
              <Icon name="object.crown" />
            </Message.AuthorIcon>
          ) : null}
        </Message.Author>
      )}
      <Message.Text>{message.text}</Message.Text>
    </Message.Root>
  );
};

export default function ChatGroupChatExample() {
  return (
    <Card.Root className={styles.short}>
      <Chat.Root>
        <Chat.Messages
          group
          aria-label="Чат команды релиза"
          items={MESSAGES}
          getKey={(message) => message.id}
          getAuthor={(message) => message.author}
          getDate={(message) => message.sentAt}
          renderMessage={renderMessage}
          groupWindow={RUN_MINUTES}
          formatDate={formatDay}
          now={NOW}
        />
      </Chat.Root>
    </Card.Root>
  );
}
