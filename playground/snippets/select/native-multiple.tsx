import * as React from "react";

import { Select } from "@/components/select/Select";

import styles from "./select-snippets.module.css";

export default function SelectNativeMultipleSnippet() {
  const [value, setValue] = React.useState<string[]>(["a", "c"]);

  return (
    <div className={`stack ${styles.stackNarrow}`}>
      <Select.Root native multiple value={value} onChange={setValue}>
        <Select.Content>
          <Select.Item value="a">Вариант A</Select.Item>
          <Select.Item value="b">Вариант B</Select.Item>
          <Select.Item value="c">Вариант C</Select.Item>
        </Select.Content>
      </Select.Root>
      <p className="previewCaption previewCaptionTopBase">
        Нативный <code>&lt;select multiple&gt;</code>: удерживайте Cmd (macOS) или Ctrl (Windows)
        для выбора нескольких значений. Текущее состояние: <code>{value.join(", ")}</code>
      </p>
    </div>
  );
}
