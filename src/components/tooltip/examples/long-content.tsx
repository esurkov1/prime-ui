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

/** Multi-line body, `size="m"`, theme max-width and wrapping (mirrors `playground/snippets/tooltip/long-content.tsx`). */
export default function TooltipLongContentExample() {
  return (
    <TooltipDemoItem label="Long copy, size m">
      <Tooltip.Provider delayDuration={200}>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Button.Root type="button" variant="neutral" mode="stroke" size="m">
              Details
            </Button.Root>
          </Tooltip.Trigger>
          <Tooltip.Content size="m">
            Password must be at least 12 characters and include upper and lower case letters and
            numbers. Do not reuse passwords from other services.
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </TooltipDemoItem>
  );
}
