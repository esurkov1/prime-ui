import { Button, Popover } from "prime-ui-kit";

import styles from "./popover-examples.module.css";

const sizes = ["s", "m", "l", "xl"] as const;

/**
 * Content `size` tier: padding, min width, and helper text scale (`ControlSizeProvider`).
 */
export default function PopoverSizesExample() {
  return (
    <div className={styles.sizesRow}>
      {sizes.map((size) => (
        <Popover.Root key={size}>
          <Popover.Trigger asChild>
            <Button.Root mode="stroke" size="m" variant="neutral">
              Size {size}
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content align="start" insetGap="x2" insetPadding="x2" side="bottom" size={size}>
            <p className={styles.panelTextMuted}>
              Panel with <code>size=&quot;{size}&quot;</code>: padding, min width, and type scale
              from the control tier.
            </p>
          </Popover.Content>
        </Popover.Root>
      ))}
    </div>
  );
}
