import { Button, Popover } from "prime-ui-kit";

import styles from "./popover-examples.module.css";

const sizes = ["s", "m", "l", "xl"] as const;

/**
 * Content `size` tier: panel padding, type scale, and `ControlSizeProvider` for nested controls.
 */
export default function PopoverSizesExample() {
  return (
    <div className={styles.sizesRow}>
      {sizes.map((size) => (
        <Popover.Root key={size}>
          <Popover.Trigger asChild>
            <Button.Root mode="stroke" variant="neutral">
              Size {size}
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content align="start" side="bottom" size={size}>
            <p className={styles.panelTextMuted}>
              Panel with <code>size=&quot;{size}&quot;</code>: padding and type scale from the
              control tier; nested controls use <code>ControlSizeProvider</code>.
            </p>
          </Popover.Content>
        </Popover.Root>
      ))}
    </div>
  );
}
