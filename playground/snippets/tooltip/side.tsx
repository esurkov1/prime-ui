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

export default function TooltipSideSnippet() {
  return (
    <>
      <TooltipDemoItem label="Top">
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button.Root type="button" variant="neutral" mode="stroke" size="m">
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
              <Button.Root type="button" variant="neutral" mode="stroke" size="m">
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
              <Button.Root type="button" variant="neutral" mode="stroke" size="m">
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
              <Button.Root type="button" variant="neutral" mode="stroke" size="m">
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
