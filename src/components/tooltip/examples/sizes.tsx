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

/** All four `Tooltip.Content` sizes on the same trigger button (mirrors `playground/snippets/tooltip/sizes.tsx`). */
export default function TooltipSizesExample() {
  return (
    <>
      <TooltipDemoItem label="Size s">
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button.Root type="button" variant="neutral" mode="stroke" size="m">
                Hover
              </Button.Root>
            </Tooltip.Trigger>
            <Tooltip.Content size="s">Tooltip s</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </TooltipDemoItem>
      <TooltipDemoItem label="Size m">
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button.Root type="button" variant="neutral" mode="stroke" size="m">
                Hover
              </Button.Root>
            </Tooltip.Trigger>
            <Tooltip.Content size="m">Tooltip m</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </TooltipDemoItem>
      <TooltipDemoItem label="Size l">
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button.Root type="button" variant="neutral" mode="stroke" size="m">
                Hover
              </Button.Root>
            </Tooltip.Trigger>
            <Tooltip.Content size="l">Tooltip l</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </TooltipDemoItem>
      <TooltipDemoItem label="Size xl">
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button.Root type="button" variant="neutral" mode="stroke" size="m">
                Hover
              </Button.Root>
            </Tooltip.Trigger>
            <Tooltip.Content size="xl">Tooltip xl</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </TooltipDemoItem>
    </>
  );
}
