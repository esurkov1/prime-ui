/** A 320 px column: the search shrinks next to the filter button and the tags wrap under them — `size`. */
import { SmartFilter, type SmartFilterField } from "prime-ui-kit";

import styles from "./examples.module.css";

const FIELDS: SmartFilterField[] = [
  {
    key: "status",
    label: "Статус",
    options: [
      { value: "new", label: "Новые" },
      { value: "paid", label: "Оплаченные" },
      { value: "refund", label: "Возвраты" },
    ],
  },
  {
    key: "city",
    label: "Город",
    finite: false,
    options: ["Москва", "Казань", "Самара", "Пермь"].map((v) => ({ value: v, label: v })),
  },
];

const APPLIED = {
  status: { include: ["paid"], exclude: [] },
  city: { include: [], exclude: ["Самара"] },
};

export default function SmartFilterNarrowExample() {
  return (
    <div className={styles.narrow}>
      <SmartFilter.Root fields={FIELDS} size="s" defaultValue={APPLIED}>
        <SmartFilter.Toolbar />
        <SmartFilter.Chips />
      </SmartFilter.Root>
    </div>
  );
}
