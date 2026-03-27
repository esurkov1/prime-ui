import { Switch } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Root на всю ширину контейнера; mirrors `playground/snippets/switch/full-width.tsx`. */
export default function SwitchFullWidthExample() {
  return (
    <div className={styles.fullWidthCard}>
      <Switch.Root defaultChecked>
        <Switch.Label>Растягивается на ширину карточки</Switch.Label>
        <Switch.Hint>Корень поля занимает 100% ширины контейнера</Switch.Hint>
      </Switch.Root>
    </div>
  );
}
