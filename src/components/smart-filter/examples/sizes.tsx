/** `size` on the root: the button, the search, the tags and the panel follow one tier. `s` for dense toolbars, `m` by default, `l` for roomier pages. Use one size per row of controls. */
import { SmartFilter, type SmartFilterField } from "prime-ui-kit";

import styles from "./examples.module.css";

const FIELDS: SmartFilterField[] = [
  {
    key: "method",
    label: "Метод",
    options: ["GET", "POST", "PUT", "DELETE"].map((v) => ({ value: v, label: v })),
  },
  {
    key: "state",
    label: "Состояние",
    options: [
      { value: "active", label: "Активные" },
      { value: "inactive", label: "Неактивные" },
    ],
  },
];

const PRESET = { method: { include: ["GET"], exclude: [] } };

export default function SmartFilterSizesExample() {
  return (
    <div className={styles.stack}>
      {(["s", "m", "l"] as const).map((size) => (
        <SmartFilter.Root key={size} fields={FIELDS} size={size} defaultValue={PRESET}>
          <SmartFilter.Toolbar />
          <SmartFilter.Chips />
        </SmartFilter.Root>
      ))}
    </div>
  );
}
