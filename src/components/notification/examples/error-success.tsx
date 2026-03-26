import { Button, NotificationProvider, Typography, useNotifications } from "prime-ui-kit";

/**
 * error / warning → assertive alert; success / info → polite status.
 */
function ErrorSuccessDemo() {
  const { notify } = useNotifications();

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
        Types change icons, stack grouping, and live-region politeness — not just color.
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
          variant="error"
          mode="lighter"
          size="m"
          onClick={() =>
            notify({
              type: "error",
              title: "Payment failed",
              description: "The card was declined. Try another method.",
            })
          }
        >
          Error toast
        </Button.Root>
        <Button.Root
          type="button"
          variant="primary"
          mode="filled"
          size="m"
          onClick={() =>
            notify({
              type: "success",
              title: "Saved",
              description: "Your changes are stored.",
            })
          }
        >
          Success toast
        </Button.Root>
      </div>
    </div>
  );
}

export default function ErrorSuccessExample() {
  return (
    <NotificationProvider>
      <ErrorSuccessDemo />
    </NotificationProvider>
  );
}
