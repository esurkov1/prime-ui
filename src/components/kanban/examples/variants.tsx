/** The same release board in both looks: columns without wells — a header plate and cards standing on the page — and columns as filled wells holding their cards — `variant`. */
import { Badge, Kanban, type KanbanVariant, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

type Task = { id: string; title: string; due: string; label: string };

const VARIANTS: KanbanVariant[] = ["plain", "well"];

const COLUMNS = [
  { id: "todo", title: "К выполнению", description: "Берём после планирования" },
  { id: "progress", title: "В работе", description: "Не больше трёх задач на человека" },
  { id: "done", title: "Готово", description: "Проверено и выкачено" },
];

const TASKS: Task[] = [
  { id: "PRJ-214", title: "Экспорт счетов в CSV для бухгалтерии", due: "14 окт", label: "Финансы" },
  { id: "PRJ-221", title: "Фильтр заказов по складу", due: "17 окт", label: "Заказы" },
  {
    id: "PRJ-198",
    title: "Повторная отправка приглашений в команду",
    due: "10 окт",
    label: "Команда",
  },
  { id: "PRJ-176", title: "Онбординг нового проекта", due: "3 окт", label: "Проекты" },
];

const PLACEMENT = {
  todo: ["PRJ-214", "PRJ-221"],
  progress: ["PRJ-198"],
  done: ["PRJ-176"],
};

export default function KanbanVariantsExample() {
  return VARIANTS.map((variant) => (
    <div key={variant}>
      <div>
        <Kanban.Root
          aria-label={`Задачи релиза: ${variant}`}
          className={styles.board}
          variant={variant}
          columns={COLUMNS}
          items={TASKS}
          getId={(task) => task.id}
          getLabel={(task) => task.title}
          defaultValue={PLACEMENT}
          renderItem={(task) => (
            <Kanban.Item>
              <Kanban.ItemTitle>{task.title}</Kanban.ItemTitle>
              <Kanban.ItemDescription>
                {task.id} · до {task.due}
              </Kanban.ItemDescription>
              <Kanban.ItemBadges>
                <Badge.Root>{task.label}</Badge.Root>
              </Kanban.ItemBadges>
            </Kanban.Item>
          )}
        />
        <Typography as="span" variant="caption" tone="muted">
          {variant}
        </Typography>
      </div>
    </div>
  ));
}
