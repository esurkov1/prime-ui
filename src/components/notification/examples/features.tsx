/** Card options: a custom `icon`, a `badge` counter, an `action` button, and a short title-only toast without a close button (`closable: false`). Use them for message digests and quick confirmations. */
import { MessageSquare } from "lucide-react";
import { NotificationCard, type NotificationRecord } from "prime-ui-kit";

import styles from "./examples.module.css";

const base = {
  position: "top-right",
  size: "m",
  duration: 0,
  persistent: true,
  closable: true,
  createdAt: 0,
} as const;

const withEverything: NotificationRecord = {
  ...base,
  id: "features-rich",
  tone: "info",
  title: "Новые ответы в обсуждении",
  description: "Мария и ещё двое ответили на ваш комментарий.",
  icon: <MessageSquare aria-hidden />,
  badge: 3,
  action: { label: "Открыть", onClick: () => {} },
};

const titleOnly: NotificationRecord = {
  ...base,
  id: "features-title",
  tone: "success",
  title: "Ссылка скопирована",
  closable: false,
};

export default function NotificationFeaturesExample() {
  return (
    <div className={styles.cards}>
      <NotificationCard item={withEverything} paused onDismiss={() => {}} />
      <NotificationCard item={titleOnly} paused onDismiss={() => {}} />
    </div>
  );
}
