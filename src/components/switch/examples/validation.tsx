/** A normal switch with a hint next to an invalid one with Switch.Error. Use it when turning a setting on is required to continue. */
import { Switch } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SwitchValidationExample() {
  return (
    <div className={styles.grid}>
      <Switch.Root defaultChecked>
        <Switch.Label>Резервное копирование</Switch.Label>
        <Switch.Hint>Каждую ночь в 03:00.</Switch.Hint>
      </Switch.Root>
      <Switch.Root>
        <Switch.Label>Согласие на обработку данных</Switch.Label>
        <Switch.Error>Без согласия аккаунт не создать.</Switch.Error>
      </Switch.Root>
    </div>
  );
}
