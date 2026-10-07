/** All five size tiers with two selected tags; chips are one tier below the field. Use it to match the field to the other controls of a form. */
import { TagSelect, type TagSelectOption } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

const options: TagSelectOption[] = [
  { value: "design", label: "Дизайн", color: "purple" },
  { value: "backend", label: "Бэкенд", color: "blue" },
  { value: "urgent", label: "Срочно", color: "red" },
];

export default function TagSelectSizesExample() {
  return (
    <div className={styles.column}>
      {SIZES.map((size) => (
        <TagSelect.Root
          key={size}
          size={size}
          options={options}
          defaultValue={["design", "backend"]}
          label={`Метки, ${size}`}
          labels={{ panelHint: "Выберите метку" }}
          placeholder="Добавить метку"
        />
      ))}
    </div>
  );
}
