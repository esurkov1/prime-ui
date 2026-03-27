import { Button, Popover } from "prime-ui-kit";

import styles from "./popover-examples.module.css";

/**
 * `sameMinWidthAsTrigger`: panel width matches the trigger (`border-box`), useful in narrow columns.
 */
export default function PopoverFullWidthExample() {
  return (
    <div className={styles.narrowColumn}>
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button.Root className={styles.fullWidthTrigger} mode="stroke" variant="neutral">
            Match trigger width
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content align="start" sameMinWidthAsTrigger side="bottom">
          <p className={styles.panelTextMuted}>
            <code>sameMinWidthAsTrigger</code> sets panel <code>width</code> and{" "}
            <code>minWidth</code> to the anchor — text wraps, still capped by panel max width and
            the viewport.
          </p>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
