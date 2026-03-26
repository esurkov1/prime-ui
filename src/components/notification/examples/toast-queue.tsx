import { Button, NotificationProvider, Typography, useNotifications } from "prime-ui-kit";

/**
 * Same position + type share one stack; provider max caps depth and drops oldest items.
 */
function ToastQueueDemo() {
  const { notify, dismissAll } = useNotifications();

  const enqueueBurst = () => {
    const types = ["info", "success"] as const;
    for (let index = 0; index < 6; index += 1) {
      window.setTimeout(() => {
        notify({
          type: types[index % 2],
          title: `Toast ${index + 1} of 6`,
          description:
            "Hover the stack to expand it and pause timers until you move the pointer away.",
          position: "bottom-right",
          duration: 6000 + index * 400,
          badge: index + 1,
        });
      }, index * 120);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-m)",
        alignItems: "flex-start",
      }}
    >
      <Typography.Root variant="body-small" tone="muted">
        Provider uses max=5: the sixth notification in the same stack replaces the oldest.
      </Typography.Root>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--prime-sys-spacing-s)",
          alignItems: "center",
        }}
      >
        <Button.Root type="button" variant="neutral" mode="stroke" size="m" onClick={enqueueBurst}>
          Enqueue six toasts
        </Button.Root>
        <Button.Root type="button" variant="neutral" mode="ghost" size="s" onClick={dismissAll}>
          dismissAll()
        </Button.Root>
      </div>
    </div>
  );
}

export default function ToastQueueExample() {
  return (
    <NotificationProvider max={5} position="top-right">
      <ToastQueueDemo />
    </NotificationProvider>
  );
}
