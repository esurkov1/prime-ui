/** Every tier changes padding, icon and text of the card — `size`. */
import { NotificationCard } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function NotificationSizesExample() {
  return (
    <div className={styles.cards}>
      {SIZES.map((size) => (
        <NotificationCard
          key={size}
          size={size}
          title={`Отчёт готов · ${size}`}
          description="Выгрузка за сентябрь доступна в разделе «Отчёты»."
          onDismiss={() => undefined}
        />
      ))}
    </div>
  );
}
