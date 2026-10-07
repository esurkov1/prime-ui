/** A controlled multi-select: string[] value, checkboxes in the list, the panel stays open, labels joined in the trigger. Use it for a few values from a short list when chips are not needed. */
import { Select, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function SelectMultipleExample() {
  const [value, setValue] = React.useState<string[]>(["eng", "design"]);

  return (
    <div className={styles.narrow}>
      <Select.Root
        label="Отделы"
        multiple
        value={value}
        onValueChange={setValue}
        placeholder="Выберите отделы"
        clearable
      >
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content searchable>
          <Select.Item value="eng">Разработка</Select.Item>
          <Select.Item value="design">Дизайн</Select.Item>
          <Select.Item value="sales">Продажи</Select.Item>
          <Select.Item value="support">Поддержка</Select.Item>
          <Select.Item value="hr" disabled>
            HR — нет доступа
          </Select.Item>
        </Select.Content>
      </Select.Root>
      <Typography.Root variant="caption" tone="muted" className={styles.caption}>
        Выбрано: <code>{value.length ? value.join(", ") : "—"}</code>
      </Typography.Root>
    </div>
  );
}
