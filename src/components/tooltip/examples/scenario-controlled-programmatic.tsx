import { Button, Switch, Tooltip } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/**
 * Controlled open state: drive the same boolean from UI and Tooltip.Root.
 */
export default function TooltipScenarioControlledProgrammatic() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={styles.stack}>
      <Switch.Root size="m" checked={open} onCheckedChange={setOpen}>
        <Switch.Label>Show tooltip programmatically</Switch.Label>
        <Switch.Hint>
          Hover or focus the button still updates <code>open</code> via <code>onOpenChange</code>.
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
