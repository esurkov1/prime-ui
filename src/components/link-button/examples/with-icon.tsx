/** Leading and trailing `Icon` inside the link; `Icon` without `size` takes the link tier. Use when an icon hints at the destination; the text stays the accessible name. */
import { Icon, LinkButton } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function LinkButtonWithIconExample() {
  return (
    <div className={styles.row}>
      <LinkButton.Root href="#">
        <Icon name="field.email" />
        Написать в поддержку
      </LinkButton.Root>
      <LinkButton.Root href="#">
        Все проекты
        <Icon name="nav.chevronRight" />
      </LinkButton.Root>
    </div>
  );
}
