import { Button, Label, Tooltip } from "prime-ui-kit";
import type * as React from "react";

import styles from "./examples.module.css";

function TooltipDemoItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.demoItem}>
      <Label.Root size="s">{label}</Label.Root>
      {children}
    </div>
  );
}

/** `Tooltip.Provider` with `delayDuration={800}` (mirrors `playground/snippets/tooltip/delay.tsx`). */
export default function TooltipDelayExample() {
  return (
    <TooltipDemoItem label="Delay 800 ms">
      <Tooltip.Provider delayDuration={800}>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Button.Root type="button" variant="neutral" mode="stroke">
              Hover me slowly
            </Button.Root>
          </Tooltip.Trigger>
          <Tooltip.Content>Appears after 800ms</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </TooltipDemoItem>
  );
}
