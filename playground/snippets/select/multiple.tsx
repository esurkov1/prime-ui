import * as React from "react";

import { Select } from "@/components/select/Select";

import styles from "./select-snippets.module.css";

export default function SelectMultipleSnippet() {
  const [value, setValue] = React.useState<string[]>(["eng"]);

  return (
    <div className={`stack ${styles.stackNarrow}`}>
      <Select.Root multiple value={value} onChange={setValue} placeholder="Выберите отделы">
        <Select.Trigger aria-label="Отделы">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="eng">Инженерия</Select.Item>
          <Select.Item value="design">Дизайн</Select.Item>
          <Select.Item value="sales">Продажи</Select.Item>
          <Select.Item value="hr">HR</Select.Item>
        </Select.Content>
      </Select.Root>
      <p className="previewCaption previewCaptionTopBase">
        Выбрано: <code>{value.length ? value.join(", ") : "—"}</code>. Повторный клик по пункту
        снимает выбор; список не закрывается после выбора.
      </p>
    </div>
  );
}
