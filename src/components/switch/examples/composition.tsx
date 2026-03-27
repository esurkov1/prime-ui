import { Switch } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Пустой `Switch.Label` + `aria-label`; колонка текста + hint; mirrors `playground/snippets/switch/composition.tsx`. */
export default function SwitchCompositionExample() {
  return (
    <div className={styles.stack}>
      <Switch.Root
        defaultChecked
        aria-label="Включено: имя для скринридеров без видимого текста у трека"
      >
        <Switch.Label />
      </Switch.Root>
      <Switch.Root>
        <Switch.Label>Разметка через Switch.Label и подсказка ниже</Switch.Label>
        <Switch.Hint>
          Hint выровнен под колонку текста; для ошибки используйте Switch.Error рядом с тем же Root.
        </Switch.Hint>
      </Switch.Root>
    </div>
  );
}
