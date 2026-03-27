import { Switch } from "@/components/switch/Switch";

import styles from "./snippets.module.css";

export default function SwitchFullWidthSnippet() {
  return (
    <div className={styles.fullWidthCard}>
      <Switch.Root defaultChecked>
        <Switch.Label>Растягивается на ширину карточки</Switch.Label>
        <Switch.Hint>Корень поля занимает 100% ширины контейнера</Switch.Hint>
      </Switch.Root>
    </div>
  );
}
