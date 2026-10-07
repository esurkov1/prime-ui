/** Toasts in each corner or centered at the top or bottom edge — `position`. */
import {
  Button,
  type NotificationPosition,
  NotificationProvider,
  Select,
  useNotifications,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const POSITIONS: { value: NotificationPosition; label: string }[] = [
  { value: "top-left", label: "Сверху слева" },
  { value: "top-center", label: "Сверху по центру" },
  { value: "top-right", label: "Сверху справа" },
  { value: "bottom-left", label: "Снизу слева" },
  { value: "bottom-center", label: "Снизу по центру" },
  { value: "bottom-right", label: "Снизу справа" },
];

function PositionPicker() {
  const { notify } = useNotifications();
  const [position, setPosition] = React.useState<NotificationPosition>("top-right");

  return (
    <div className={styles.row}>
      <div className={styles.select}>
        <Select.Root value={position} onValueChange={(v) => setPosition(v as NotificationPosition)}>
          <Select.Trigger aria-label="Позиция уведомлений">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            {POSITIONS.map((item) => (
              <Select.Item key={item.value} value={item.value}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>
      <Button.Root
        variant="outline"
        tone="neutral"
        onClick={() =>
          notify({
            title: "Новое сообщение",
            description: "Поддержка ответила в чате.",
            position,
          })
        }
      >
        Показать
      </Button.Root>
    </div>
  );
}

export default function NotificationPlacementExample() {
  // In an app NotificationProvider wraps the root once; here it keeps the example self-contained.
  return (
    <NotificationProvider>
      <PositionPicker />
    </NotificationProvider>
  );
}
