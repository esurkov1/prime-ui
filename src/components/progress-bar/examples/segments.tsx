/** `segments` instead of `value`: one continuous bar (`segmentGap="none"`) for parts of one process, separate pills (`"hairline"`) for distinct categories, `max` for a partly filled whole, and an empty list. */
import { ProgressBar, type ProgressSegment } from "prime-ui-kit";

import styles from "./examples.module.css";

const review: ProgressSegment[] = [
  { value: 40, label: "Принято", tone: "success" },
  { value: 35, label: "На проверке", tone: "warning" },
  { value: 25, label: "Отклонено", tone: "danger" },
];

export default function ProgressSegmentsExample() {
  return (
    <div className={styles.stack}>
      <ProgressBar.Root segments={review} label="Заявки: сплошная полоса" />
      <ProgressBar.Root segments={review} segmentGap="hairline" label="Заявки: отдельные части" />
      <ProgressBar.Root
        segments={[
          { value: 12, label: "Готово", tone: "success" },
          { value: 6, label: "В работе" },
        ]}
        max={30}
        label="Спринт: 18 из 30 задач"
        showValue
      />
      <ProgressBar.Root segments={[]} label="Нет данных" />
    </div>
  );
}
