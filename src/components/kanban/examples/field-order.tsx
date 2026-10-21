/** Project tasks whose view menu shows, hides and reorders the card fields: a grip drags a field (a held press on touch), Alt + ↑ / ↓ moves the focused one, and every card draws its parts in that order — `KanbanFieldsMenu`, `fieldOrder`, `onFieldOrderChange`, `hiddenFields`. */
import { Badge, Icon, Kanban, type KanbanField, KanbanFieldsMenu } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Task = {
  id: string;
  title: string;
  client: string;
  due: string;
  budget: string;
  tags: string[];
};

const COLUMNS = [
  { id: "todo", title: "К работе", color: "blue" as const },
  { id: "doing", title: "В работе", color: "orange" as const },
  { id: "review", title: "На проверке", color: "purple" as const },
];

const FIELDS: KanbanField[] = [
  { id: "client", label: "Клиент" },
  { id: "due", label: "Срок" },
  { id: "budget", label: "Бюджет" },
  { id: "tags", label: "Метки" },
];

const FIELD_IDS = FIELDS.map((field) => field.id);

const TASKS: Task[] = [
  {
    id: "t-212",
    title: "Интеграция с 1С",
    client: "АО «Техностиль»",
    due: "до 24 окт",
    budget: "240 000 ₽",
    tags: ["Бэкенд", "Срочно"],
  },
  {
    id: "t-215",
    title: "Роли и доступы",
    client: "ООО «Гранит»",
    due: "до 30 окт",
    budget: "96 000 ₽",
    tags: ["Безопасность"],
  },
  {
    id: "t-219",
    title: "Отчёт по отгрузкам",
    client: "ООО «Логистик Плюс»",
    due: "до 2 ноя",
    budget: "58 000 ₽",
    tags: ["Аналитика"],
  },
];

const PLACEMENT = { todo: ["t-219"], doing: ["t-212"], review: ["t-215"] };

/** One card part by its field id. */
function fieldPart(field: string, task: Task) {
  if (field === "client") {
    return (
      <Kanban.ItemFact key={field}>
        <Icon name="object.user" />
        {task.client}
      </Kanban.ItemFact>
    );
  }
  if (field === "due") {
    return (
      <Kanban.ItemFact key={field}>
        <Icon name="status.pending" />
        {task.due}
      </Kanban.ItemFact>
    );
  }
  if (field === "budget") {
    return (
      <Kanban.ItemFact key={field}>
        <Icon name="object.wallet" />
        {task.budget}
      </Kanban.ItemFact>
    );
  }
  return (
    <Kanban.ItemBadges key={field}>
      {task.tags.map((tag) => (
        <Badge.Root key={tag}>{tag}</Badge.Root>
      ))}
    </Kanban.ItemBadges>
  );
}

export default function KanbanFieldOrderExample() {
  const [hiddenFields, setHiddenFields] = React.useState<readonly string[]>([]);
  const [fieldOrder, setFieldOrder] = React.useState<readonly string[]>([]);
  // `[]` is the order of `FIELDS`; after a move the menu reports every field.
  const order = fieldOrder.length > 0 ? fieldOrder : FIELD_IDS;
  const shown = order.filter((field) => !hiddenFields.includes(field));

  return (
    <div className={styles.stage}>
      <div className={styles.toolbar}>
        <span className={styles.spacer} />
        <KanbanFieldsMenu
          fields={FIELDS}
          hiddenFields={hiddenFields}
          onHiddenFieldsChange={setHiddenFields}
          fieldOrder={fieldOrder}
          onFieldOrderChange={setFieldOrder}
        />
      </div>
      <Kanban.Root
        aria-label="Задачи проекта"
        className={styles.board}
        columns={COLUMNS}
        items={TASKS}
        getId={(task) => task.id}
        getLabel={(task) => task.title}
        defaultValue={PLACEMENT}
        renderItem={(task) => (
          <Kanban.Item>
            <Kanban.ItemTitle>{task.title}</Kanban.ItemTitle>
            {shown.map((field) => fieldPart(field, task))}
          </Kanban.Item>
        )}
      />
    </div>
  );
}
