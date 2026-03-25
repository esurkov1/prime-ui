import type { NotificationRecord, NotificationType } from "@/components/notification/Notification";
import { NotificationCard } from "@/components/notification/Notification";

const copy: Record<NotificationType, { title: string; description: string }> = {
  success: { title: "Сохранено", description: "Изменения записаны в профиль." },
  error: {
    title: "Не удалось отправить",
    description: "Проверьте соединение и повторите попытку.",
  },
  warning: { title: "Срок подписки", description: "Через 3 дня закончится оплаченный период." },
  info: { title: "Обновление ночью", description: "Сервис будет недоступен с 02:00 до 03:00." },
};

export default function NotificationVariantsSnippet() {
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
        gap: "var(--prime-sys-spacing-x3)",
        width: "100%",
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
