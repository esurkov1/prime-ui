/** A release board: cards move within and between columns by drag, a touch hold or Alt + arrows; a card shows its meta line, labels, comments and assignee — `Kanban.Root`, `Kanban.Item`, `renderItem`, `renderColumnActions`. */
import { Avatar, Badge, Button, Icon, Kanban, type PaletteColor } from "prime-ui-kit";

import styles from "./examples.module.css";

type Task = {
  id: string;
  title: string;
  due: string;
  labels: { text: string; color: PaletteColor }[];
  comments: number;
  assignee: { initials: string; name: string; color: PaletteColor };
};

const COLUMNS = [
  { id: "backlog", title: "Бэклог" },
  { id: "progress", title: "В работе" },
  { id: "review", title: "На проверке" },
  { id: "done", title: "Готово" },
];

const ANNA = { initials: "АК", name: "Анна Котова", color: "purple" } as const;
const ILYA = { initials: "ИС", name: "Илья Смирнов", color: "teal" } as const;
const MARIA = { initials: "МВ", name: "Мария Волкова", color: "orange" } as const;

const TASKS: Task[] = [
  {
    id: "PRJ-214",
    title: "Экспорт счетов в CSV для бухгалтерии",
    due: "14 окт",
    labels: [{ text: "Биллинг", color: "blue" }],
    comments: 3,
    assignee: ANNA,
  },
  {
    id: "PRJ-221",
    title: "Фильтр заказов по складу",
    due: "17 окт",
    labels: [{ text: "Заказы", color: "green" }],
    comments: 0,
    assignee: ILYA,
  },
  {
    id: "PRJ-198",
    title: "Повторная отправка приглашений в команду",
    due: "10 окт",
    labels: [
      { text: "Команда", color: "purple" },
      { text: "Срочно", color: "red" },
    ],
    comments: 5,
    assignee: MARIA,
  },
  {
    id: "PRJ-205",
    title: "Тёмная тема для отчётов",
    due: "12 окт",
    labels: [{ text: "Дизайн", color: "pink" }],
    comments: 2,
    assignee: ANNA,
  },
  {
    id: "PRJ-187",
    title: "Лимиты API для партнёров",
    due: "9 окт",
    labels: [{ text: "API", color: "sky" }],
    comments: 8,
    assignee: ILYA,
  },
  {
    id: "PRJ-176",
    title: "Онбординг нового проекта",
    due: "3 окт",
    labels: [{ text: "Проекты", color: "yellow" }],
    comments: 1,
    assignee: MARIA,
  },
];

const PLACEMENT = {
  backlog: ["PRJ-214", "PRJ-221"],
  progress: ["PRJ-198", "PRJ-205"],
  review: ["PRJ-187"],
  done: ["PRJ-176"],
};

export default function KanbanOverviewExample() {
  return (
    <Kanban.Root
      aria-label="Задачи релиза 2.4"
      className={styles.board}
      columns={COLUMNS}
      items={TASKS}
      getId={(task) => task.id}
      getLabel={(task) => task.title}
      defaultValue={PLACEMENT}
      renderColumnActions={(column) => (
        <Button.Root variant="ghost" tone="neutral" aria-label={`Добавить в «${column.title}»`}>
          <Button.Icon>
            <Icon name="action.add" />
          </Button.Icon>
        </Button.Root>
      )}
      renderItem={(task) => (
        <Kanban.Item>
          <Kanban.ItemTitle>{task.title}</Kanban.ItemTitle>
          <Kanban.ItemDescription>
            {task.id} · до {task.due}
          </Kanban.ItemDescription>
          <Kanban.ItemBadges>
            {task.labels.map((label) => (
              <Badge.Root key={label.text} color={label.color}>
                {label.text}
              </Badge.Root>
            ))}
          </Kanban.ItemBadges>
          <Kanban.ItemFooter>
            <Kanban.ItemCount>
              <Icon name="object.message" />
              {task.comments}
            </Kanban.ItemCount>
            <Avatar.Root size="s" color={task.assignee.color} aria-label={task.assignee.name}>
              <Avatar.Fallback>{task.assignee.initials}</Avatar.Fallback>
            </Avatar.Root>
          </Kanban.ItemFooter>
        </Kanban.Item>
      )}
    />
  );
}
