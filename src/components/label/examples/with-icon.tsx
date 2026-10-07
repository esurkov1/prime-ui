/** `Label.Icon` puts a muted icon before the text, sized by the label size. Use it when an icon helps scan a long form. */
import { Icon, Label } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function LabelWithIconExample() {
  return (
    <div className={styles.list}>
      <Label.Root htmlFor="label-icon-email" required>
        <Label.Icon>
          <Icon name="field.email" />
        </Label.Icon>
        Рабочий email
      </Label.Root>
      <Label.Root htmlFor="label-icon-lock" size="l">
        <Label.Icon>
          <Icon name="status.locked" />
        </Label.Icon>
        Пароль
      </Label.Root>
    </div>
  );
}
