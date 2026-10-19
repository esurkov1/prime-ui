/** A backlog of two thousand tasks in its own scroller stays fast: only the rows in view are drawn, a row held near an edge scrolls the list, and Alt + arrows reach any row — `virtual`, `ScrollContainer`. */
import { Dnd, moveBefore, ScrollContainer, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const AREAS = ["Биллинг", "Склад", "Заказы", "Отчёты", "Команда"];

const TASKS = Array.from({ length: 2000 }, (_, index) => ({
  id: `PRJ-${index + 1}`,
  title: `${AREAS[index % AREAS.length]}: задача ${index + 1}`,
}));

export default function DndLongListExample() {
  const [tasks, setTasks] = React.useState(TASKS);

  return (
    <Dnd.Root>
      <ScrollContainer className={styles.scroller}>
        <Dnd.Sortable
          as="ul"
          virtual
          aria-label="Бэклог"
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
                  {task.id}
                </Typography>
              </span>
            </Dnd.SortableItem>
          )}
        />
      </ScrollContainer>
    </Dnd.Root>
  );
}
