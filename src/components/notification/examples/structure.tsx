/** Optional parts on static cards: a custom icon, a counter, an action and a close button, or a title alone — `icon`, `badge`, `action`, `onDismiss`. */
import { MessageSquare } from "lucide-react";
import { NotificationCard } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function NotificationStructureExample() {
  return (
    <div className={styles.cards}>
      <NotificationCard
        title="Новые ответы в обсуждении"
        description="Мария и ещё двое ответили на ваш комментарий."
        icon={<MessageSquare aria-hidden />}
        badge={3}
        action={{ label: "Открыть", onClick: () => undefined }}
        onDismiss={() => undefined}
      />
      <NotificationCard tone="success" title="Ссылка скопирована" />
    </div>
  );
}
