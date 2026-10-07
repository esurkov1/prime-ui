/** The label itself is not interactive; `disabled` dims the text together with the asterisk and the optional marker. Use it next to a disabled control. */
import { Label } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function LabelStatesExample() {
  return (
    <div className={styles.list}>
      <Label.Root htmlFor="label-st-1" required>
        Название профиля
      </Label.Root>
      <Label.Root htmlFor="label-st-2" disabled required>
        Название профиля
      </Label.Root>
      <Label.Root htmlFor="label-st-3" disabled optional>
        Описание
      </Label.Root>
    </div>
  );
}
