import type * as React from "react";

import { Button } from "@/components/button/Button";
import { Label } from "@/components/label/Label";
import { Tooltip } from "@/components/tooltip/Tooltip";

import styles from "./snippets.module.css";

function TooltipDemoItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.demoItem}>
      <Label.Root size="s">{label}</Label.Root>
      {children}
    </div>
  );
}

export default function TooltipDelaySnippet() {
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
