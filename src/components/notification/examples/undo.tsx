/** Delete at once and offer to undo: the row leaves the list, the toast brings it back, and the deletion is sent only when the toast leaves without an undo — `onDismiss`, `action`. */
import { Button, NotificationProvider, Typography, useNotifications } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const TASKS = ["Подготовить договор", "Выставить счёт №318", "Созвониться с юристом"];

function TaskList() {
  const { notify, dismiss } = useNotifications();
  const [tasks, setTasks] = React.useState(TASKS);
  const [sent, setSent] = React.useState<string[]>([]);

  const remove = (task: string) => {
    setTasks((list) => list.filter((item) => item !== task));
    let undone = false;
    const id = notify({
      title: "Задача удалена",
      description: task,
      action: {
        label: "Отменить",
        onClick: () => {
          undone = true;
          setTasks((list) => [...list, task]);
          dismiss(id);
        },
      },
      // The toast is gone: without an undo the deletion goes to the server now.
      onDismiss: () => {
        if (!undone) setSent((list) => [...list, task]);
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
