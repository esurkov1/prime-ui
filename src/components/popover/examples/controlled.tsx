import { Button, Popover, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./popover-examples.module.css";

/**
 * Controlled `open` / `onOpenChange` on `Popover.Root`: open from outside, toggle from trigger, close from panel.
 */
export default function PopoverControlledExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={styles.controlledRow}>
      <Typography.Root as="p" className={styles.stateLine} variant="body-small" weight="medium">
        Panel is {open ? "open" : "closed"}
      </Typography.Root>
      <div className={styles.sizesRow}>
        <Button.Root mode="stroke" variant="neutral" onClick={() => setOpen(true)}>
          Open from outside
        </Button.Root>
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Button.Root mode="filled" variant="primary">
              Toggle with trigger
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content align="start" side="bottom">
            <p className={styles.panelTextMuted}>
              State is driven by <code>open</code> and <code>onOpenChange</code> on{" "}
              <code>Popover.Root</code>.
            </p>
            <Button.Root mode="ghost" variant="neutral" onClick={() => setOpen(false)}>
              Close
            </Button.Root>
          </Popover.Content>
        </Popover.Root>
      </div>
    </div>
  );
}
