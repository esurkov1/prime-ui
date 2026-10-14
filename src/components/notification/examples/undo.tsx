/** Delete at once and offer to undo: the row leaves the list, the toast's action brings it back and closes it, and the deletion is sent when the toast leaves for any other reason — `onDismiss`, `action`. */
import { Button, NotificationProvider, Typography, useNotifications } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const TASKS = ["Подготовить договор", "Выставить счёт №318", "Созвониться с юристом"];

function TaskList() {
  const { notify } = useNotifications();
  const [tasks, setTasks] = React.useState(TASKS);
  const [sent, setSent] = React.useState<string[]>([]);

  const remove = (task: string) => {
    setTasks((list) => list.filter((item) => item !== task));
    notify({
      title: "Задача удалена",
      description: task,
      action: { label: "Отменить", onClick: () => setTasks((list) => [...list, task]) },
      // The toast left without an undo: the deletion goes to the server now.
      onDismiss: (reason) => {
        if (reason !== "action") setSent((list) => [...list, task]);
      },
    });
  };

  return (
    <div className={styles.cards}>
      {tasks.map((task) => (
        <div key={task} className={styles.taskRow}>
          <Typography as="span" variant="body-m">
            {task}
          </Typography>
          <Button.Root variant="ghost" tone="danger" onClick={() => remove(task)}>
            Удалить
          </Button.Root>
        </div>
      ))}
      <Typography as="p" variant="caption" tone="muted">
        Отправлено на сервер: {sent.length > 0 ? sent.join(", ") : "ничего"}
      </Typography>
    </div>
  );
}

export default function NotificationUndoExample() {
  // In an app NotificationProvider wraps the root once; here it keeps the example self-contained.
  return (
    <NotificationProvider>
      <TaskList />
    </NotificationProvider>
  );
}
