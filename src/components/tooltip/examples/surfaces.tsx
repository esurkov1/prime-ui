import { Button, Label, Tooltip } from "prime-ui-kit";
import type { ReactNode } from "react";

import styles from "./examples.module.css";

function Panel({
  label,
  variant,
  children,
}: {
  label: string;
  variant: "default" | "raised";
  children: ReactNode;
}) {
  const surfaceClass = variant === "default" ? styles.surfaceDefault : styles.surfaceRaised;
  return (
    <div className={`${styles.surfacePanel} ${surfaceClass}`}>
      <Label.Root size="s">{label}</Label.Root>
      {children}
    </div>
  );
}

/** Same tooltip chrome on `surface-default` vs `surface-raised` (mirrors `playground/snippets/tooltip/surfaces.tsx`). */
export default function TooltipSurfacesExample() {
  return (
    <div className={styles.rowWrapMStretch}>
      <Panel label="Surface default" variant="default">
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button.Root type="button" variant="neutral" mode="stroke" size="m">
                Hover
              </Button.Root>
            </Tooltip.Trigger>
            <Tooltip.Content>Tooltip on neutral page background</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </Panel>
      <Panel label="Surface raised" variant="raised">
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button.Root type="button" variant="neutral" mode="stroke" size="m">
                Hover
              </Button.Root>
            </Tooltip.Trigger>
            <Tooltip.Content>Tooltip on a raised card surface</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </Panel>
    </div>
  );
}
