/** For an API that takes one value per field: the filter button without a search, a press picks only that value and nothing can be hidden — `searchable`, `multiple`. */
import { SmartFilter, type SmartFilterField } from "prime-ui-kit";

import styles from "./examples.module.css";

const FIELDS: SmartFilterField[] = [
  {
    key: "pipeline",
    label: "Воронка",
    multiple: false,
    options: [
      { value: "b2b", label: "Корпоративные продажи" },
      { value: "retail", label: "Розница" },
      { value: "partners", label: "Партнёры" },
    ],
  },
  {
    key: "period",
    label: "Срок",
    multiple: false,
    options: [
      { value: "overdue", label: "Просрочены" },
      { value: "today", label: "Сегодня" },
      { value: "week", label: "На этой неделе" },
    ],
  },
];

export default function SmartFilterSingleValueExample() {
  return (
    <div className={styles.stack}>
      <SmartFilter.Root
        fields={FIELDS}
        defaultValue={{ pipeline: { include: ["b2b"], exclude: [] } }}
      >
        <SmartFilter.Toolbar searchable={false} />
        <SmartFilter.Chips />
      </SmartFilter.Root>
    </div>
  );
}
