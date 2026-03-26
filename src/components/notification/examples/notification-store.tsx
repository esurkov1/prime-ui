import { Button, NotificationProvider, Typography, useNotificationStore } from "prime-ui-kit";

/**
 * useNotificationStore exposes items (active only) for labels, badges, or bulk actions.
 */
function StoreDemo() {
  const { items, notify, dismissAll } = useNotificationStore();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-m)",
        alignItems: "flex-start",
      }}
    >
      <Typography.Root variant="body-default">
        Active toasts: {items.length} (excludes cards in the exit animation)
      </Typography.Root>
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
          variant="neutral"
          mode="stroke"
          size="m"
          onClick={() =>
            notify({
              type: "info",
              title: "Queued",
              description: "The counter above updates while this toast is visible.",
            })
          }
        >
          Push info
        </Button.Root>
        <Button.Root type="button" variant="neutral" mode="ghost" size="s" onClick={dismissAll}>
          dismissAll()
        </Button.Root>
      </div>
    </div>
  );
}

export default function NotificationStoreExample() {
  return (
    <NotificationProvider>
      <StoreDemo />
    </NotificationProvider>
  );
}
