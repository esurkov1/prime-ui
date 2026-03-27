import {
  Button,
  NotificationCard,
  NotificationProvider,
  type NotificationRecord,
  useNotifications,
} from "prime-ui-kit";

const persistentItem: NotificationRecord = {
  id: "demo-state-persistent",
  type: "warning",
  title: "Action required",
  description: "No auto-dismiss: progress bar hidden; close manually.",
  position: "top-right",
  size: "m",
  duration: 5000,
  persistent: true,
  closable: true,
  createdAt: Date.now(),
};

const notClosableItem: NotificationRecord = {
  id: "demo-state-noclose",
  type: "info",
  title: "Background sync",
  description: "Close button hidden (closable: false); the timer still removes the toast.",
  position: "top-right",
  size: "m",
  duration: 8000,
  persistent: false,
  closable: false,
  createdAt: Date.now(),
};

function StatesDemo() {
  const { notify } = useNotifications();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-l)",
        maxWidth: 440,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--prime-sys-spacing-m)",
        }}
      >
        <NotificationCard
          item={persistentItem}
          paused={false}
          onDismiss={() => {}}
          stackDepth={0}
          stackExpanded
        />
        <NotificationCard
          item={notClosableItem}
          paused={false}
          onDismiss={() => {}}
          stackDepth={0}
          stackExpanded
        />
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
              type: "success",
              title: "Short toast",
              description: "duration: 2500 ms — progress track visible.",
              duration: 2500,
              position: "top-right",
              size: "m",
            })
          }
        >
          Timer 2.5s
        </Button.Root>
        <Button.Root
          type="button"
          size="s"
          variant="neutral"
          mode="stroke"
          onClick={() =>
            notify({
              type: "info",
              title: "Pause on hover",
              description: "Hover the stack in the corner — the timer pauses.",
              duration: 6000,
              position: "bottom-right",
              size: "m",
            })
          }
        >
          Pause demo
        </Button.Root>
        <Button.Root
          type="button"
          size="s"
          variant="neutral"
          mode="stroke"
          onClick={() =>
            notify({
              type: "success",
              title: "Saved",
              description: "persistent — accent border and glow pulse (see Variants static cards).",
              persistent: true,
              closable: true,
              position: "top-right",
              size: "m",
            })
          }
        >
          notify + persistent
        </Button.Root>
      </div>
    </div>
  );
}

export default function StatesExample() {
  return (
    <NotificationProvider>
      <StatesDemo />
    </NotificationProvider>
  );
}
