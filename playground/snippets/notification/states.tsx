import { Button } from "@/components/button/Button";
import type { NotificationRecord } from "@/components/notification/Notification";
import { NotificationCard } from "@/components/notification/Notification";
import { useNotifications } from "@/components/notification/NotificationStore";

const persistentItem: NotificationRecord = {
  id: "demo-state-persistent",
  type: "warning",
  title: "Требуется действие",
  description: "Без автозакрытия: полоса прогресса скрыта, закрытие только вручную.",
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
  title: "Фоновая синхронизация",
  description: "Крестик скрыт (closable: false); таймер всё равно досчитает и уберёт тост.",
  position: "top-right",
  size: "m",
  duration: 8000,
  persistent: false,
  closable: false,
  createdAt: Date.now(),
};

export default function NotificationStatesSnippet() {
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--prime-sys-spacing-x3)",
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
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--prime-sys-spacing-x2)" }}>
        <Button.Root
          type="button"
          size="s"
          variant="neutral"
          mode="stroke"
          onClick={() =>
            notify({
              type: "success",
              title: "Короткий тост",
              description: "duration: 2500 мс — видна полоса обратного отсчёта.",
              duration: 2500,
              position: "top-right",
              size: "m",
            })
          }
        >
          Тост с таймером 2,5 с
        </Button.Root>
        <Button.Root
          type="button"
          size="s"
          variant="neutral"
          mode="stroke"
          onClick={() =>
            notify({
              type: "info",
              title: "Пауза при наведении",
              description: "Наведите курсор на стек в углу — таймер остановится.",
              duration: 6000,
              position: "bottom-right",
              size: "m",
            })
          }
        >
          Тост для проверки паузы
        </Button.Root>
      </div>
    </div>
  );
}
