/** `clearable` in sizes s, m and l with a value selected: the clear action is a full-height segment before the chevron, the whole segment is the hit area; Delete or Backspace on the trigger clears from the keyboard. Use for optional fields that can be reset. */
import { Select } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const SIZES = ["s", "m", "l"] as const;

export default function SelectClearableExample() {
  const [values, setValues] = React.useState<Record<string, string>>({
    s: "editor",
    m: "editor",
    l: "editor",
  });

  return (
    <div className={styles.narrow}>
      {SIZES.map((size) => (
        <Select.Root
          key={size}
          size={size}
          label={`Роль · ${size}`}
          placeholder="Выберите роль"
          clearable
          value={values[size]}
          onValueChange={(value) => setValues((prev) => ({ ...prev, [size]: value }))}
        >
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="admin">Администратор</Select.Item>
            <Select.Item value="editor">Редактор</Select.Item>
            <Select.Item value="viewer">Наблюдатель</Select.Item>
          </Select.Content>
        </Select.Root>
      ))}
    </div>
  );
}
