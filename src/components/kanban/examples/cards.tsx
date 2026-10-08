/** Three kinds of cards on one board: a plain note, a ticket with a header row of key and priority, a design task with a cover — `Kanban.ItemHeader`, `Thumbnail`, `Kanban.ItemFooter`. */
import { Avatar, Badge, Icon, Kanban, type PaletteColor, Thumbnail } from "prime-ui-kit";

import styles from "./examples.module.css";

type Person = { initials: string; name: string; color: PaletteColor };

type Card =
  | { kind: "note"; id: string; title: string; meta: string }
  | {
      kind: "ticket";
      id: string;
      title: string;
      priority: { text: string; color: PaletteColor };
      comments: number;
      assignee: Person;
    }
  | {
      kind: "design";
      id: string;
      title: string;
      cover: string;
      label: { text: string; color: PaletteColor };
      attachments: number;
      assignee: Person;
    };

const COLUMNS = [
  { id: "todo", title: "К выполнению" },
  { id: "progress", title: "В работе" },
  { id: "review", title: "На проверке" },
];

const OLGA: Person = { initials: "ОБ", name: "Ольга Белова", color: "green" };
const DENIS: Person = { initials: "ДК", name: "Денис Ким", color: "blue" };

const CARDS: Card[] = [
  {
    kind: "design",
    id: "DS-58",
    title: "Новый экран оплаты счёта",
    cover: "https://picsum.photos/seed/invoice-pay/480/270",
    label: { text: "Дизайн", color: "pink" },
    attachments: 6,
    assignee: OLGA,
  },
  {
    kind: "ticket",
    id: "BUG-412",
    title: "Счёт не уходит клиенту при пустом email",
    priority: { text: "Высокий", color: "red" },
    comments: 7,
    assignee: DENIS,
  },
  { kind: "note", id: "N-12", title: "Собрать отзывы о новом тарифе", meta: "до 18 окт" },
  {
    kind: "ticket",
    id: "PRJ-233",
    title: "Импорт заказов из 1С",
    priority: { text: "Средний", color: "yellow" },
    comments: 2,
    assignee: OLGA,
  },
  {
    kind: "design",
    id: "DS-61",
    title: "Иконки статусов доставки",
    cover: "https://picsum.photos/seed/delivery-icons/480/270",
    label: { text: "Иконки", color: "purple" },
    attachments: 12,
    assignee: DENIS,
  },
  {
    kind: "note",
    id: "N-15",
    title: "Согласовать договор с ООО «Вектор»",
    meta: "юристы · 21 окт",
  },
];

const PLACEMENT = {
  todo: ["N-12", "PRJ-233"],
  progress: ["DS-58", "BUG-412"],
  review: ["DS-61", "N-15"],
};

export default function KanbanCardsExample() {
  return (
    <Kanban.Root
      aria-label="Задачи продуктовой команды"
      className={styles.board}
      columns={COLUMNS}
      items={CARDS}
      getId={(card) => card.id}
      getLabel={(card) => card.title}
      defaultValue={PLACEMENT}
      renderItem={(card) => {
        if (card.kind === "note") {
          return (
            <Kanban.Item>
              <Kanban.ItemTitle>{card.title}</Kanban.ItemTitle>
              <Kanban.ItemDescription>{card.meta}</Kanban.ItemDescription>
            </Kanban.Item>
          );
        }
        if (card.kind === "ticket") {
          return (
            <Kanban.Item>
              <Kanban.ItemHeader>
                <span>{card.id}</span>
                <Badge.Root color={card.priority.color}>{card.priority.text}</Badge.Root>
              </Kanban.ItemHeader>
              <Kanban.ItemTitle>{card.title}</Kanban.ItemTitle>
              <Kanban.ItemFooter>
                <Kanban.ItemCount>
                  <Icon name="object.message" />
                  {card.comments}
                </Kanban.ItemCount>
                <Avatar.Root size="s" color={card.assignee.color} aria-label={card.assignee.name}>
                  <Avatar.Fallback>{card.assignee.initials}</Avatar.Fallback>
                </Avatar.Root>
              </Kanban.ItemFooter>
            </Kanban.Item>
          );
        }
        return (
          <Kanban.Item>
            <Thumbnail.Root fullWidth ratio="16:9">
              <Thumbnail.Image src={card.cover} alt="" />
              <Thumbnail.Fallback>
                <Icon name="object.image" />
              </Thumbnail.Fallback>
            </Thumbnail.Root>
            <Kanban.ItemTitle>{card.title}</Kanban.ItemTitle>
            <Kanban.ItemBadges>
              <Badge.Root color={card.label.color}>{card.label.text}</Badge.Root>
            </Kanban.ItemBadges>
            <Kanban.ItemFooter>
              <Kanban.ItemCount>
                <Icon name="object.document" />
                {card.attachments}
              </Kanban.ItemCount>
              <Avatar.Root size="s" color={card.assignee.color} aria-label={card.assignee.name}>
                <Avatar.Fallback>{card.assignee.initials}</Avatar.Fallback>
              </Avatar.Root>
            </Kanban.ItemFooter>
          </Kanban.Item>
        );
      }}
    />
  );
}
