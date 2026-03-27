import { Filter, SlidersHorizontal } from "lucide-react";
import { Button, Checkbox, Popover, Typography } from "prime-ui-kit";

import styles from "./popover-examples.module.css";

/**
 * Trigger with `Button.Icon`, header row, body copy, and native checkboxes with inset spacing.
 */
export default function PopoverCompositionExample() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button.Root mode="stroke" size="m" variant="neutral">
          <Button.Icon>
            <SlidersHorizontal aria-hidden strokeWidth={1.75} />
          </Button.Icon>
          Report filters
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" insetGap="x3" insetPadding="x2" side="bottom" size="m">
        <div className={styles.compositionHeader}>
          <Filter aria-hidden className={styles.headerIcon} strokeWidth={1.75} />
          <Typography.Root as="span" variant="body-small" weight="semibold">
            Quick filters
          </Typography.Root>
        </div>
        <Typography.Root as="p" className={styles.panelTextMuted} variant="body-small">
          Icon on the trigger, header and copy inside the panel with <code>insetPadding</code> /{" "}
          <code>insetGap</code>.
        </Typography.Root>
        <div className={styles.checkboxStack}>
          <Checkbox.Root size="m" defaultChecked>
            <Checkbox.Label>Active only</Checkbox.Label>
          </Checkbox.Root>
          <Checkbox.Root size="m">
            <Checkbox.Label>Hide zero values</Checkbox.Label>
          </Checkbox.Root>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
