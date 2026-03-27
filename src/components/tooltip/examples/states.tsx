import { Button, Label, Tooltip } from "prime-ui-kit";
import type * as React from "react";

import styles from "./examples.module.css";

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.demoItem}>
      <Label.Root size="s">{label}</Label.Root>
      {children}
    </div>
  );
}

/** Default trigger, native disabled (tooltip does not open), glossary-style focus trigger (mirrors `playground/snippets/tooltip/states.tsx`). */
export default function TooltipStatesExample() {
  return (
    <div className={styles.rowWrapXlJustifyCenter}>
      <Block label="Default — hover and focus">
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button.Root type="button" variant="neutral" mode="stroke" size="m">
                Save
              </Button.Root>
            </Tooltip.Trigger>
            <Tooltip.Content>Send the draft to the server</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </Block>
      <Block label="Native disabled — hover does not open">
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button.Root type="button" variant="neutral" mode="stroke" size="m" disabled>
                Unavailable
              </Button.Root>
            </Tooltip.Trigger>
            <Tooltip.Content>This copy does not appear on native disabled hover</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </Block>
      <Block label="Keyboard focus — unstyled term button">
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <button type="button" className={styles.inlineHelpTrigger}>
                KPI
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content>Key performance indicator</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </Block>
    </div>
  );
}
