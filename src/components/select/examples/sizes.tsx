/** All five size tiers of the trigger (28–48px); list items take the same tier. Use it to line a select up with buttons and inputs of the same size. */
import { Select } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function SelectSizesExample() {
  return (
    <div className={styles.sizeRow}>
      {SIZES.map((size) => (
        <div key={size} className={styles.sizeCell}>
          <Select.Root size={size} defaultValue="week">
            <Select.Trigger aria-label={`Период, размер ${size}`}>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="day">За день</Select.Item>
              <Select.Item value="week">За неделю</Select.Item>
              <Select.Item value="month">За месяц</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>
      ))}
    </div>
  );
}
