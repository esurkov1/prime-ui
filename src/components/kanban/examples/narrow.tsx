/** On a phone-width screen a column takes 85% of the board and snaps into place, so the next one peeks; the strip scrolls inside the board, never the page. */
import { Avatar, Kanban } from "prime-ui-kit";

import styles from "./examples.module.css";

type Task = { id: string; title: string; due: string; initials: string; name: string };

const COLUMNS = [
  { id: "todo", title: "К выполнению" },
  { id: "progress", title: "В работе" },
  { id: "done", title: "Готово" },
];

const TASKS: Task[] = [
  {
    id: "PRJ-301",
    title: "Подготовить отчёт по продажам",
    due: "до 14 окт",
    initials: "АК",
    name: "Анна Котова",
  },
  {
    id: "PRJ-305",
    title: "Созвон с ООО «Вектор»",
    due: "до 9 окт",
    initials: "ИС",
    name: "Илья Смирнов",
  },
  {
    id: "PRJ-297",
    title: "Обновить прайс-лист",
    due: "до 11 окт",
    initials: "МВ",
    name: "Мария Волкова",
  },
  {
    id: "PRJ-290",
    title: "Закрыть акты за сентябрь",
    due: "2 окт",
    initials: "АК",
    name: "Анна Котова",
  },
];

const PLACEMENT = {
  todo: ["PRJ-301", "PRJ-305"],
  progress: ["PRJ-297"],
  done: ["PRJ-290"],
};

export default function KanbanNarrowExample() {
  return (
    <Kanban.Root
      aria-label="Мои задачи"
      className={styles.phone}
      columns={COLUMNS}
      items={TASKS}
      getId={(task) => task.id}
      getLabel={(task) => task.title}
      defaultValue={PLACEMENT}
      renderItem={(task) => (
        <Kanban.Item>
          <Kanban.ItemTitle>{task.title}</Kanban.ItemTitle>
          <Kanban.ItemFooter>
            <Kanban.ItemDescription>
              {task.id} · {task.due}
            </Kanban.ItemDescription>
            <Avatar.Root size="s" aria-label={task.name}>
              <Avatar.Fallback>{task.initials}</Avatar.Fallback>
            </Avatar.Root>
          </Kanban.ItemFooter>
        </Kanban.Item>
      )}
    />
  );
}
