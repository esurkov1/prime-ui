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

export default function TooltipSizesSnippet() {
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
