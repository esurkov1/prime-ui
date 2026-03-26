import {
  Button,
  type NotificationPosition,
  NotificationProvider,
  Typography,
  useNotifications,
} from "prime-ui-kit";

const POSITIONS: NotificationPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

function PositionsDemo() {
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
        Each button sends a toast anchored to that corner or edge; override per notify or set a
        provider default.
      </Typography.Root>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, auto))",
          gap: "var(--prime-sys-spacing-s)",
        }}
      >
        {POSITIONS.map((position) => (
          <Button.Root
            key={position}
            type="button"
            size="s"
            variant="neutral"
            mode="stroke"
            onClick={() =>
              notify({
                type: "info",
                title: `Zone: ${position}`,
                description: "Position comes from notify options or NotificationProvider.",
                position,
                size: "m",
                duration: 4000,
              })
            }
          >
            {position}
          </Button.Root>
        ))}
      </div>
    </div>
  );
}

export default function PositionsExample() {
  return (
    <NotificationProvider position="top-right">
      <PositionsDemo />
    </NotificationProvider>
  );
}
