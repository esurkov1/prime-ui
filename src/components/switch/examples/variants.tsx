import { Switch } from "prime-ui-kit";

import styles from "./examples.module.css";

/** `default` vs `error`; mirrors `playground/snippets/switch/variants.tsx`. */
export default function SwitchVariantsExample() {
  return (
    <div className={styles.stack}>
      <Switch.Root defaultChecked>
        <Switch.Label>Обычный вид</Switch.Label>
        <Switch.Hint>variant по умолчанию — default</Switch.Hint>
      </Switch.Root>
      <Switch.Root defaultChecked variant="error">
        <Switch.Label>Ошибка валидации</Switch.Label>
        <Switch.Error>Отметьте согласие, чтобы продолжить</Switch.Error>
      </Switch.Root>
    </div>
  );
}
