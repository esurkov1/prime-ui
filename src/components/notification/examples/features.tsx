import { Button, NotificationProvider, useNotifications } from "prime-ui-kit";

function FeaturesDemo() {
  const { notify, dismissAll } = useNotifications();

  const runStackDemo = () => {
    const types = ["info", "success"] as const;
    for (let index = 0; index < 6; index += 1) {
      window.setTimeout(() => {
        notify({
          type: types[index % 2],
          title: `Stack ${index + 1} of 6`,
          description:
            "Same type and position share one column; hover expands the stack and pauses timers.",
          position: "bottom-right",
          duration: 6000 + index * 500,
          badge: index + 1,
        });
      }, index * 140);
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
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--prime-sys-spacing-s)",
          alignItems: "center",
        }}
      >
        <Button.Root type="button" variant="neutral" mode="stroke" onClick={runStackDemo}>
          Enqueue six toasts
        </Button.Root>
        <Button.Root type="button" size="s" variant="neutral" mode="ghost" onClick={dismissAll}>
          dismissAll()
        </Button.Root>
      </div>
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
          variant="neutral"
          mode="stroke"
          onClick={() =>
            notify({
              type: "info",
              title: "Quick dismiss",
              description: "duration: 2000",
              duration: 2000,
              position: "top-center",
              size: "m",
            })
          }
        >
          duration 2s
        </Button.Root>
        <Button.Root
          type="button"
          size="s"
          variant="neutral"
          mode="stroke"
          onClick={() =>
            notify({
              type: "success",
              title: "Longer on screen",
              description: "duration: 14000",
              duration: 14000,
              position: "top-center",
              size: "m",
            })
          }
        >
          duration 14s
        </Button.Root>
      </div>
    </div>
  );
}

export default function FeaturesExample() {
  return (
    <NotificationProvider max={5} position="top-right">
      <FeaturesDemo />
    </NotificationProvider>
  );
}
