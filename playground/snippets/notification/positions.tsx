import { Button } from "@/components/button/Button";
import type { NotificationPosition } from "@/components/notification/Notification";
import { useNotifications } from "@/components/notification/NotificationStore";

const positions: NotificationPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

export default function NotificationPositionsSnippet() {
  const { notify } = useNotifications();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "var(--prime-sys-spacing-x2)",
        width: "100%",
        maxWidth: 520,
      }}
    >
      {positions.map((position) => (
        <Button.Root
          key={position}
          type="button"
          size="s"
          variant="neutral"
          mode="stroke"
          onClick={() =>
            notify({
              type: "info",
              title: `Зона: ${position}`,
              description:
                "Позиция задаётся в options.notify или по умолчанию из NotificationProvider.",
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
  );
}
