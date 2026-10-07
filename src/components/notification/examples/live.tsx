/** Live toasts from `useNotifications().notify()` with a position picker; same position + tone stack, hover expands the stack and pauses timers, `persistent` disables auto-close. Use it to see stacking, positions and `dismissAll`. */
import {
  Button,
  type NotificationPosition,
  NotificationProvider,
  Select,
  Typography,
  useNotifications,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const positions: { value: NotificationPosition; label: string }[] = [
  { value: "top-left", label: "Сверху слева" },
  { value: "top-center", label: "Сверху по центру" },
  { value: "top-right", label: "Сверху справа" },
  { value: "bottom-left", label: "Снизу слева" },
  { value: "bottom-center", label: "Снизу по центру" },
  { value: "bottom-right", label: "Снизу справа" },
];

function LiveToasts() {
  const { notify, dismissAll, items } = useNotifications();
  const [position, setPosition] = React.useState<NotificationPosition>("top-right");

  return (
    <div className={styles.controls}>
      <div className={styles.select}>
        <Select.Root value={position} onValueChange={(v) => setPosition(v as NotificationPosition)}>
          <Select.Trigger aria-label="Позиция тостов">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            {positions.map((p) => (
              <Select.Item key={p.value} value={p.value}>
                {p.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>
      <div className={styles.row}>
        <Button.Root
          variant="outline"
          tone="neutral"
          onClick={() =>
            notify({
              tone: "success",
              title: "Заказ оформлен",
              description: "№ 48 213, доставка завтра.",
              position,
            })
          }
        >
          Успех
        </Button.Root>
        <Button.Root
          variant="outline"
          tone="neutral"
          onClick={() =>
            notify({
              tone: "info",
              title: "Новое сообщение",
              description: "Поддержка ответила в чате.",
              position,
            })
          }
        >
          Инфо
        </Button.Root>
        <Button.Root
          variant="outline"
          tone="neutral"
          onClick={() =>
            notify({
              tone: "warning",
              title: "Мало на складе",
              description: "Осталось 3 шт. «Монитор 27″».",
              position,
            })
          }
        >
          Внимание
        </Button.Root>
        <Button.Root
          variant="outline"
          tone="neutral"
          onClick={() =>
            notify({
              tone: "danger",
              title: "Платёж отклонён",
              description: "Банк не подтвердил операцию.",
              position,
              persistent: true,
              action: { label: "Повторить", onClick: () => {} },
            })
          }
        >
          Ошибка (без таймера)
        </Button.Root>
      </div>
      <div className={styles.row}>
        <Typography.Root as="span" variant="body-s" tone="secondary" className={styles.count}>
          Активных: {items.length}
        </Typography.Root>
        <Button.Root
          variant="ghost"
          tone="neutral"
          size="s"
          disabled={items.length === 0}
          onClick={dismissAll}
        >
          Закрыть все
        </Button.Root>
      </div>
    </div>
  );
}

export default function NotificationLiveExample() {
  // In an app NotificationProvider wraps the root once; it is here to keep the example self-contained.
  return (
    <NotificationProvider>
      <LiveToasts />
    </NotificationProvider>
  );
}
