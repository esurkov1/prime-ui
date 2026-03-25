import type { NotificationRecord } from "@/components/notification/Notification";
import { NotificationCard } from "@/components/notification/Notification";

function demoItem(
  overrides: Partial<NotificationRecord> & Pick<NotificationRecord, "id" | "size">,
): NotificationRecord {
  return {
    type: "info",
    title: `Размер ${overrides.size}`,
    description: "Одинаковый тип и текст, меняется только size карточки.",
    position: "top-right",
    duration: 60000,
    persistent: true,
    closable: false,
    createdAt: Date.now(),
    ...overrides,
  };
}

export default function NotificationSizesSnippet() {
  const sizes = (["s", "m", "l"] as const).map((size) =>
    demoItem({ id: `demo-size-${size}`, size, title: `Размер ${size}` }),
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-x3)",
        width: "100%",
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
