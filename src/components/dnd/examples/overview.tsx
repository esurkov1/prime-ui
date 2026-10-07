/** Project tasks reordered by dragging the whole row; one root above, the move applied with a helper — `Dnd.Root`, `Dnd.Sortable`, `onReorder`, `moveBefore`. */
import { Dnd, moveBefore, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const TASKS = [
  { id: "brief", title: "Согласовать бриф", due: "Сегодня" },
  { id: "design", title: "Макеты главной страницы", due: "Завтра" },
  { id: "build", title: "Вёрстка и интеграция", due: "Через 3 дня" },
  { id: "review", title: "Ревью и правки", due: "Через неделю" },
  { id: "launch", title: "Запуск", due: "Через 2 недели" },
];

export default function DndOverviewExample() {
  const [tasks, setTasks] = React.useState(TASKS);

  return (
    <Dnd.Root>
      <Dnd.Sortable
        as="ul"
        aria-label="Задачи проекта"
        className={styles.list}
        items={tasks}
        getId={(task) => task.id}
        getLabel={(task) => task.title}
        onReorder={(id, beforeId) =>
          setTasks((current) => moveBefore(current, id, beforeId, (task) => task.id))
        }
        renderItem={(task) => (
          <Dnd.SortableItem id={task.id} className={styles.row}>
            <span className={styles.rowText}>
              <Typography as="span" variant="body-m" truncate>
                {task.title}
              </Typography>
              <Typography as="span" variant="caption" tone="muted">
                {task.due}
              </Typography>
            </span>
          </Dnd.SortableItem>
        )}
      />
    </Dnd.Root>
  );
}
