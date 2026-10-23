/** A task dragged to the top or bottom edge of a scrolling list scrolls it, faster the closer it comes — `ScrollContainer`, `Dnd.Sortable`. */
import { Card, Dnd, moveBefore, ScrollContainer } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const TASKS = [
  { id: "brief", title: "Согласовать бриф" },
  { id: "budget", title: "Утвердить бюджет" },
  { id: "design", title: "Макеты главной страницы" },
  { id: "copy", title: "Тексты для каталога" },
  { id: "build", title: "Вёрстка и интеграция" },
  { id: "payments", title: "Подключить оплату" },
  { id: "review", title: "Ревью и правки" },
  { id: "qa", title: "Проверка на телефонах" },
  { id: "launch", title: "Запуск" },
  { id: "report", title: "Отчёт клиенту" },
];

export default function ScrollContainerAutoScrollExample() {
  const [tasks, setTasks] = React.useState(TASKS);

  return (
    <Card.Root role="region" className={styles.card} aria-label="План проекта">
      <Card.Header>
        <Card.Title>План проекта</Card.Title>
      </Card.Header>
      <Card.Body>
        <ScrollContainer>
          <Dnd.Root>
            <Dnd.Sortable
              as="ul"
              aria-label="Задачи"
              className={styles.sortable}
              items={tasks}
              getId={(task) => task.id}
              getLabel={(task) => task.title}
              onReorder={(id, beforeId) =>
                setTasks((current) => moveBefore(current, id, beforeId, (task) => task.id))
              }
              renderItem={(task) => (
                <Dnd.SortableItem id={task.id}>
                  <Card.Root>
                    <Card.Header>
                      <Card.Title as="span">{task.title}</Card.Title>
                    </Card.Header>
                  </Card.Root>
                </Dnd.SortableItem>
              )}
            />
          </Dnd.Root>
        </ScrollContainer>
      </Card.Body>
    </Card.Root>
  );
}
