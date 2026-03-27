import { NotificationCard, NotificationProvider, type NotificationRecord } from "prime-ui-kit";

function demoItem(
  overrides: Partial<NotificationRecord> & Pick<NotificationRecord, "id" | "size">,
): NotificationRecord {
  return {
    type: "info",
    title: `Size ${overrides.size}`,
    description: "Same type and copy; only the card scale changes.",
    position: "top-right",
    duration: 60000,
    persistent: true,
    closable: false,
    createdAt: Date.now(),
    ...overrides,
  };
}

function SizesDemo() {
  const sizes = (["s", "m", "l"] as const).map((size) =>
    demoItem({ id: `demo-size-${size}`, size, title: `Size ${size}` }),
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-m)",
        maxWidth: 420,
      }}
    >
      {sizes.map((item) => (
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

export default function SizesExample() {
  return (
    <NotificationProvider>
      <SizesDemo />
    </NotificationProvider>
  );
}
