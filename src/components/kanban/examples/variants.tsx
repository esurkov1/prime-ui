/** The same release board in both looks: columns as filled wells, and bare columns where the header and wider cards carry each column — `variant`. */
import { Kanban, type KanbanVariant, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

type Task = { id: string; title: string; due: string };

const VARIANTS: KanbanVariant[] = ["well", "plain"];

const COLUMNS = [
  { id: "todo", title: "К выполнению", description: "Берём после планирования" },
  { id: "progress", title: "В работе", description: "Не больше трёх задач на человека" },
  { id: "done", title: "Готово", description: "Проверено и выкачено" },
];

const TASKS: Task[] = [
  { id: "PRJ-214", title: "Экспорт счетов в CSV для бухгалтерии", due: "14 окт" },
  { id: "PRJ-221", title: "Фильтр заказов по складу", due: "17 окт" },
  { id: "PRJ-198", title: "Повторная отправка приглашений в команду", due: "10 окт" },
  { id: "PRJ-176", title: "Онбординг нового проекта", due: "3 окт" },
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
