/** `autoResize` (default) vs fixed height with native resize; a soft limit (counter only) vs a hard limit (`maxLength`). Use it to choose height and limit behaviour. */
import { Textarea } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const LONG_TEXT = "Текст длиннее лимита в 30 символов — счётчик краснеет.";

export default function TextareaHeightAndLimitsExample() {
  const [soft, setSoft] = React.useState(LONG_TEXT);
  const [hard, setHard] = React.useState("");

  return (
    <div className={styles.pair}>
      <Textarea.Root
        label="autoResize"
        placeholder="Пишите несколько строк — поле растёт"
        hint="Высота следует за текстом, минимум три строки."
      />
      <Textarea.Root
        label="autoResize={false}"
        autoResize={false}
        rows={4}
        placeholder="Тяните угол"
        hint="Фиксированная высота и нативный resize."
      />
      <Textarea.Root
        label="Мягкий лимит"
        value={soft}
        onValueChange={setSoft}
        hint="Ввод не блокируется, счётчик показывает переполнение."
        counter={<Textarea.Counter current={soft.length} max={30} />}
      />
      <Textarea.Root
        label="Жёсткий лимит"
        value={hard}
        maxLength={80}
        onValueChange={setHard}
        placeholder="Не больше 80 символов"
        hint="maxLength не даёт ввести лишнее."
        counter={<Textarea.Counter current={hard.length} max={80} />}
      />
    </div>
  );
}
