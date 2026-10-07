/** Off, on, disabled in both positions, read-only and invalid switches. Use it as a reference for every visual state. */
import { Switch } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SwitchStatesExample() {
  return (
    <div className={styles.grid}>
      <Switch.Root>
        <Switch.Label>Выключен</Switch.Label>
      </Switch.Root>
      <Switch.Root defaultChecked>
        <Switch.Label>Включён</Switch.Label>
      </Switch.Root>
      <Switch.Root disabled>
        <Switch.Label>Отключён, выкл.</Switch.Label>
      </Switch.Root>
      <Switch.Root defaultChecked disabled>
        <Switch.Label>Отключён, вкл.</Switch.Label>
      </Switch.Root>
      <Switch.Root defaultChecked readOnly>
        <Switch.Label>Только чтение</Switch.Label>
        <Switch.Hint>Меняет администратор.</Switch.Hint>
      </Switch.Root>
      <Switch.Root>
        <Switch.Label>Ошибка</Switch.Label>
        <Switch.Error>Включите, чтобы продолжить.</Switch.Error>
      </Switch.Root>
    </div>
  );
}
