import { Button, NotificationProvider, Typography, useNotificationStore } from "prime-ui-kit";
import * as React from "react";

function ControlledDemo() {
  const { items, notify, dismiss } = useNotificationStore();
  const [added, setAdded] = React.useState(0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-m)",
        maxWidth: 480,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--prime-sys-spacing-s)",
          alignItems: "center",
        }}
      >
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
              title: `Task queue (${n})`,
              description: "The list below reads items from useNotificationStore.",
              position: "top-right",
              size: "s",
              duration: 12000,
              badge: n,
            });
          }}
        >
          Add to queue
        </Button.Root>
      </div>
      <Typography.Root variant="body-small" tone="muted">
        Active records: {items.length}
      </Typography.Root>
      {items.length > 0 ? (
        <ul
          style={{
            margin: 0,
            paddingLeft: "var(--prime-sys-spacing-m)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--prime-sys-spacing-xs)",
          }}
        >
          {items.map((item) => (
            <li key={item.id}>
              <code>{item.id}</code>
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

export default function ControlledExample() {
  return (
    <NotificationProvider>
      <ControlledDemo />
    </NotificationProvider>
  );
}
