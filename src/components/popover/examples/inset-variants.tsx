import { Button, Popover } from "prime-ui-kit";

import styles from "./popover-examples.module.css";

/**
 * `insetPadding` and `insetGap` on `Popover.Content`, including `none` for a flush layout.
 */
export default function PopoverInsetVariantsExample() {
  return (
    <div className={styles.sizesRow}>
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button.Root mode="stroke" variant="neutral">
            padding: none
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content insetGap="none" insetPadding="none">
          <p className={styles.flushText}>Content flush to the panel radius.</p>
        </Popover.Content>
      </Popover.Root>

      <Popover.Root>
        <Popover.Trigger asChild>
          <Button.Root mode="stroke" variant="neutral">
            padding: x2
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content insetGap="x2" insetPadding="x2">
          <p className={styles.panelTextMuted}>Typical inset defaults for inner spacing.</p>
        </Popover.Content>
      </Popover.Root>

      <Popover.Root>
        <Popover.Trigger asChild>
          <Button.Root mode="stroke" variant="neutral">
            padding: x3
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content insetGap="x4" insetPadding="x3">
          <p className={styles.panelTextMuted}>More air between blocks (gap x4).</p>
          <p className={styles.panelTextMuted}>Second paragraph shows vertical rhythm.</p>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
