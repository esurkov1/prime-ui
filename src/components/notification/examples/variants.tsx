import {
  NotificationCard,
  NotificationProvider,
  type NotificationRecord,
  type NotificationType,
} from "prime-ui-kit";

const copy: Record<NotificationType, { title: string; description: string }> = {
  success: { title: "Saved", description: "Changes were written to your profile." },
  error: {
    title: "Could not send",
    description: "Check your connection and try again.",
  },
  warning: { title: "Subscription", description: "Your paid period ends in three days." },
  info: {
    title: "Night maintenance",
    description: "The service will be down from 02:00 to 03:00.",
  },
};

function VariantsDemo() {
  const types = (["success", "error", "warning", "info"] as const).map((type) => {
    const text = copy[type];
    const item: NotificationRecord = {
      id: `demo-variant-${type}`,
      type,
      title: text.title,
      description: text.description,
      position: "top-right",
      size: "m",
      duration: 60000,
      persistent: true,
      closable: false,
      createdAt: Date.now(),
    };
    return item;
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-m)",
        maxWidth: 440,
      }}
    >
      {types.map((item) => (
        <NotificationCard
          key={item.id}
          item={item}
          paused={false}
          onDismiss={() => {}}
          stackDepth={0}
          stackExpanded
        />
      ))}
    </div>
  );
}

export default function VariantsExample() {
  return (
    <NotificationProvider>
      <VariantsDemo />
    </NotificationProvider>
  );
}
