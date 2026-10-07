/** Toasts of one position and tone stack; hover expands the stack and pauses the timers — `max`, `items`, `dismissAll`. */
import { Button, NotificationProvider, Typography, useNotifications } from "prime-ui-kit";

import styles from "./examples.module.css";

function StackControls() {
  const { notify, dismissAll, items } = useNotifications();
  return (
    <div className={styles.row}>
      <Button.Root
        variant="outline"
        tone="neutral"
        onClick={() =>
          notify({
            tone: "success",
            title: "Заказ оформлен",
            description: `№ ${48_213 + items.length}, доставка завтра.`,
          })
        }
      >
        Оформить заказ
      </Button.Root>
      <Button.Root
        variant="ghost"
        tone="neutral"
        disabled={items.length === 0}
        onClick={dismissAll}
      >
        Закрыть все
      </Button.Root>
      <Typography as="span" variant="body-s" tone="secondary">
        Активных: {items.length}
      </Typography>
    </div>
  );
}

export default function NotificationStackingExample() {
  // In an app NotificationProvider wraps the root once; here it keeps the example self-contained.
  return (
    <NotificationProvider max={4}>
      <StackControls />
    </NotificationProvider>
  );
}
