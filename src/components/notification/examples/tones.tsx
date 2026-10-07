/** The four tones as static `NotificationCard`s: the tone icon carries the meaning, the card is a raised surface without a border. Use static cards for docs and mockups; in an app toasts come from `notify()`. */
import { NotificationCard, type NotificationRecord } from "prime-ui-kit";

import styles from "./examples.module.css";

const copy: Record<NotificationRecord["tone"], [string, string]> = {
  success: ["Изменения сохранены", "Профиль компании обновлён."],
  info: ["Обновление ночью", "Сервис будет недоступен с 02:00 до 03:00."],
  warning: ["Заканчивается подписка", "Через 3 дня закончится оплаченный период."],
  danger: ["Не удалось отправить", "Проверьте соединение и повторите попытку."],
};

function card(tone: NotificationRecord["tone"]): NotificationRecord {
  const [title, description] = copy[tone];
  return {
    id: `tones-${tone}`,
    tone,
    title,
    description,
    position: "top-right",
    size: "m",
    duration: 0,
    persistent: true,
    closable: true,
    createdAt: 0,
  };
}

export default function NotificationTonesExample() {
  return (
    <div className={styles.cards}>
      {(["success", "info", "warning", "danger"] as const).map((tone) => (
        <NotificationCard key={tone} item={card(tone)} paused onDismiss={() => {}} />
      ))}
    </div>
  );
}
