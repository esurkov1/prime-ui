import { Button, Switch, Tooltip } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/** `open` / `onOpenChange` on `Tooltip.Root` with `delayDuration={0}` (mirrors `playground/snippets/tooltip/controlled.tsx`). */
export default function TooltipControlledExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={styles.controlledStack}>
      <Switch.Root size="m" checked={open} onCheckedChange={setOpen}>
        <Switch.Label>Tooltip open (programmatic)</Switch.Label>
        <Switch.Hint>
          State stays in sync with <code>open</code> and <code>onOpenChange</code> on{" "}
          <code>Tooltip.Root</code>; hovering the button updates the same state.
        </Switch.Hint>
      </Switch.Root>
      <Tooltip.Provider delayDuration={0}>
        <Tooltip.Root open={open} onOpenChange={setOpen}>
          <Tooltip.Trigger>
            <Button.Root type="button" variant="neutral" mode="stroke" size="m">
              Trigger
            </Button.Root>
          </Tooltip.Trigger>
          <Tooltip.Content>Controlled tooltip</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
}
