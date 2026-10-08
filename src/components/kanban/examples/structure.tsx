/** Cards take only the parts they need: a title alone, a meta line, labels, a footer with counts and an assignee — `Kanban.ItemTitle`, `Kanban.ItemDescription`, `Kanban.ItemBadges`, `Kanban.ItemFooter`, `Kanban.ItemCount`. */
import { Avatar, Badge, Icon, Kanban } from "prime-ui-kit";

import styles from "./examples.module.css";

type Card = {
  id: string;
  title: string;
  meta?: string;
  label?: string;
  comments?: number;
  attachments?: number;
  assignee?: { initials: string; name: string };
};

const COLUMNS = [
  { id: "inbox", title: "Входящие" },
  { id: "planned", title: "Запланировано" },
];

const CARDS: Card[] = [
  { id: "c1", title: "Уточнить реквизиты поставщика" },
  { id: "c2", title: "Сверка остатков на складе", meta: "INV-3102 · до 15 окт" },
  { id: "c3", title: "Новый тариф для партнёров", label: "Продажи" },
  {
    id: "c4",
    title: "Акт сверки с ООО «Вектор»",
    meta: "INV-3088 · до 11 окт",
    label: "Финансы",
    comments: 4,
    attachments: 2,
    assignee: { initials: "ОБ", name: "Ольга Белова" },
  },
];

const PLACEMENT = { inbox: ["c1", "c2"], planned: ["c3", "c4"] };

export default function KanbanStructureExample() {
  return (
    <Kanban.Root
      aria-label="Задачи отдела закупок"
      className={styles.board}
      columns={COLUMNS}
      items={CARDS}
      getId={(card) => card.id}
      getLabel={(card) => card.title}
      defaultValue={PLACEMENT}
      renderItem={(card) => (
        <Kanban.Item>
          <Kanban.ItemTitle>{card.title}</Kanban.ItemTitle>
          {card.meta ? <Kanban.ItemDescription>{card.meta}</Kanban.ItemDescription> : null}
          {card.label ? (
            <Kanban.ItemBadges>
              <Badge.Root color="blue">{card.label}</Badge.Root>
            </Kanban.ItemBadges>
          ) : null}
          {card.assignee ? (
            <Kanban.ItemFooter>
              <Kanban.ItemCount>
                <Icon name="object.message" />
                {card.comments}
              </Kanban.ItemCount>
              <Kanban.ItemCount>
                <Icon name="object.document" />
                {card.attachments}
              </Kanban.ItemCount>
              <Avatar.Root size="s" color="green" aria-label={card.assignee.name}>
                <Avatar.Fallback>{card.assignee.initials}</Avatar.Fallback>
              </Avatar.Root>
            </Kanban.ItemFooter>
          ) : null}
        </Kanban.Item>
      )}
    />
  );
}
