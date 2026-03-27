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

/** `side` on `Tooltip.Content`: top, bottom, left, right (mirrors `playground/snippets/tooltip/side.tsx`). */
export default function TooltipSideExample() {
  return (
    <>
      <TooltipDemoItem label="Top">
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button.Root type="button" variant="neutral" mode="stroke">
                Hover
              </Button.Root>
            </Tooltip.Trigger>
            <Tooltip.Content side="top">Content top</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </TooltipDemoItem>
      <TooltipDemoItem label="Bottom">
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button.Root type="button" variant="neutral" mode="stroke">
                Hover
              </Button.Root>
            </Tooltip.Trigger>
            <Tooltip.Content side="bottom">Content bottom</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </TooltipDemoItem>
      <TooltipDemoItem label="Left">
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button.Root type="button" variant="neutral" mode="stroke">
                Hover
              </Button.Root>
            </Tooltip.Trigger>
            <Tooltip.Content side="left">Content left</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </TooltipDemoItem>
      <TooltipDemoItem label="Right">
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button.Root type="button" variant="neutral" mode="stroke">
                Hover
              </Button.Root>
            </Tooltip.Trigger>
            <Tooltip.Content side="right">Content right</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </TooltipDemoItem>
    </>
  );
}
