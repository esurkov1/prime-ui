import { Bell } from "lucide-react";

import { Button } from "@/components/button/Button";
import type { NotificationRecord } from "@/components/notification/Notification";
import { NotificationCard } from "@/components/notification/Notification";
import notificationStyles from "@/components/notification/Notification.module.css";
import { useNotifications } from "@/components/notification/NotificationStore";

const richStatic: NotificationRecord = {
  id: "demo-composition-static",
  type: "info",
  title: "Новые ответы в обсуждении",
  description: "Иконка через icon, счётчик через badge, действие через action.",
  position: "top-right",
  size: "m",
  duration: 60000,
  persistent: true,
  closable: true,
  createdAt: Date.now(),
  icon: <Bell className={notificationStyles.icon} />,
  badge: 3,
  action: {
    label: "Открыть",
    onClick: () => {},
  },
};

export default function NotificationCompositionSnippet() {
  const { notify } = useNotifications();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-x4)",
        width: "100%",
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
            title: "Экспорт готов",
            description: "Файл можно скачать из раздела «Отчёты».",
            position: "top-right",
            size: "l",
            duration: 5000,
            icon: <Bell className={notificationStyles.icon} />,
            badge: "PDF",
            action: {
              label: "Скачать",
              onClick: () =>
                notify({
                  type: "info",
                  title: "Ссылка скопирована",
                  description: "В реальном приложении здесь был бы файл.",
                  position: "top-right",
                  size: "s",
                }),
            },
          })
        }
      >
        Показать тост с композицией
      </Button.Root>
    </div>
  );
}
