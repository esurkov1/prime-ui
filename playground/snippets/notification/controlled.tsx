import * as React from "react";

import { Button } from "@/components/button/Button";
import { useNotificationStore } from "@/components/notification/NotificationStore";
import { Typography } from "@/components/typography/Typography";

export default function NotificationControlledSnippet() {
  const { items, notify, dismiss } = useNotificationStore();
  const [added, setAdded] = React.useState(0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-x3)",
        width: "100%",
        maxWidth: 480,
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--prime-sys-spacing-x2)" }}>
        <Button.Root
          type="button"
          size="s"
          variant="primary"
          mode="filled"
          onClick={() => {
            const n = added + 1;
            setAdded(n);
            notify({
              type: "info",
              title: `Очередь задач (${n})`,
              description: "Список ниже читает items из useNotificationStore.",
              position: "top-right",
              size: "s",
              duration: 12000,
              badge: n,
            });
          }}
        >
          Добавить в очередь
        </Button.Root>
      </div>
      <Typography.Root size="s" tone="muted">
        Активных записей в сторе: {items.length}
      </Typography.Root>
      {items.length > 0 ? (
        <ul
          style={{
            margin: 0,
            paddingLeft: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "var(--prime-sys-spacing-x2)",
          }}
        >
          {items.map((item) => (
            <li key={item.id}>
              <code style={{ fontSize: "0.85em" }}>{item.id}</code>
              {" — "}
              <Button.Root
                type="button"
                size="s"
                variant="neutral"
                mode="ghost"
                onClick={() => dismiss(item.id)}
              >
                dismiss(id)
              </Button.Root>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
