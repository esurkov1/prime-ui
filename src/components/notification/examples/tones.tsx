/** The four tones: the icon carries the meaning; danger and warning are announced at once — `tone`. */
import { NotificationCard } from "prime-ui-kit";

import styles from "./examples.module.css";

const TONES = [
  { tone: "success", title: "Изменения сохранены", description: "Профиль компании обновлён." },
  { tone: "info", title: "Обновление ночью", description: "Сервис недоступен с 02:00 до 03:00." },
  {
    tone: "warning",
    title: "Заканчивается подписка",
    description: "Оплата закончится через 3 дня.",
  },
  { tone: "danger", title: "Не удалось отправить", description: "Проверьте соединение." },
] as const;

export default function NotificationTonesExample() {
  return (
    <div className={styles.cards}>
      {TONES.map((item) => (
        <NotificationCard key={item.tone} {...item} onDismiss={() => undefined} />
      ))}
    </div>
  );
}
