/** A shortcut as one key per `Kbd`; symbol keys get a name — `aria-label`, `title`. */
import { Kbd, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function KbdOverviewExample() {
  return (
    <span className={styles.chord}>
      <Kbd aria-label="Command" title="Command">
        ⌘
      </Kbd>
      <Typography.Root as="span" variant="body-m" tone="muted" aria-hidden="true">
        +
      </Typography.Root>
      <Kbd aria-label="Shift" title="Shift">
        ⇧
      </Kbd>
      <Typography.Root as="span" variant="body-m" tone="muted" aria-hidden="true">
        +
      </Typography.Root>
      <Kbd>P</Kbd>
    </span>
  );
}
