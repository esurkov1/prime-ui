import {
  Button,
  LinkButton,
  NotificationProvider,
  Typography,
  useNotifications,
} from "prime-ui-kit";

/**
 * action uses kit Button.Root inside the card; page triggers may use Button or LinkButton.
 */
function ActionToastDemo() {
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
        Secondary action in the toast is always neutral stroke Button.Root from the kit.
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
          variant="primary"
          mode="filled"
          size="m"
          onClick={() =>
            notify({
              type: "info",
              title: "Export ready",
              description: "Your CSV is prepared.",
              action: {
                label: "Download",
                onClick: () =>
                  notify({
                    type: "success",
                    title: "Started",
                    description: "In a real app, the file would download.",
                  }),
              },
            })
          }
        >
          Toast with action
        </Button.Root>
        <LinkButton.Root
          href="#"
          size="m"
          onClick={(event) => {
            event.preventDefault();
            notify({
              type: "info",
              title: "From LinkButton",
              description: "Any control can call notify under the provider.",
            });
          }}
        >
          Fire via LinkButton
        </LinkButton.Root>
      </div>
    </div>
  );
}

export default function ActionToastExample() {
  return (
    <NotificationProvider>
      <ActionToastDemo />
    </NotificationProvider>
  );
}
