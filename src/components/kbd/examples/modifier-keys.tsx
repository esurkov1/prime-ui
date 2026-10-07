/** A chord of symbol keys with `aria-label` / `title` and a visual "+" hidden from screen readers. Use whenever a key is shown as a symbol (⌘ ⌥ ⇧). */
import { Kbd, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function KbdModifierKeysExample() {
  return (
    <span className={styles.chord}>
      <Kbd.Root aria-label="Command" title="Command">
        ⌘
      </Kbd.Root>
      <Typography.Root as="span" variant="body-m" tone="muted" aria-hidden="true">
        +
      </Typography.Root>
      <Kbd.Root aria-label="Shift" title="Shift">
        ⇧
      </Kbd.Root>
      <Typography.Root as="span" variant="body-m" tone="muted" aria-hidden="true">
        +
      </Typography.Root>
      <Kbd.Root>P</Kbd.Root>
    </span>
  );
}
