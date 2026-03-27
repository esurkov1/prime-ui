import { Bell } from "lucide-react";

import {
  Button,
  NotificationCard,
  NotificationProvider,
  type NotificationRecord,
  useNotifications,
} from "prime-ui-kit";

const richStatic: NotificationRecord = {
  id: "demo-composition-static",
  type: "info",
  title: "New replies in the thread",
  description: "Leading icon, badge, and action slot.",
  position: "top-right",
  size: "m",
  duration: 60000,
  persistent: true,
  closable: true,
  createdAt: Date.now(),
  icon: <Bell size={16} strokeWidth={2} />,
  badge: 3,
  action: {
    label: "Open",
    onClick: () => {},
  },
};

function CompositionDemo() {
  const { notify } = useNotifications();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-m)",
        maxWidth: 440,
      }}
    >
      <NotificationCard
        item={richStatic}
        paused={false}
        onDismiss={() => {}}
        stackDepth={0}
        stackExpanded
      />
      <Button.Root
        type="button"
        size="s"
        variant="neutral"
        mode="stroke"
        onClick={() =>
          notify({
            type: "success",
            title: "Export ready",
            description: "Download the file from Reports.",
            position: "top-right",
            size: "l",
            duration: 5000,
            icon: <Bell size={16} strokeWidth={2} />,
            badge: "PDF",
            action: {
              label: "Download",
              onClick: () =>
                notify({
                  type: "info",
                  title: "Link copied",
                  description: "In a real app this would start the download.",
                  position: "top-right",
                  size: "s",
                }),
            },
          })
        }
      >
        Live toast with composition
      </Button.Root>
    </div>
  );
}

export default function CompositionExample() {
  return (
    <NotificationProvider>
      <CompositionDemo />
    </NotificationProvider>
  );
}
