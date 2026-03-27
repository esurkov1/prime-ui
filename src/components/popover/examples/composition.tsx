import { Filter, SlidersHorizontal } from "lucide-react";
import { Button, Checkbox, Popover, Typography } from "prime-ui-kit";

import styles from "./popover-examples.module.css";

/**
 * Trigger with `Button.Icon`, header row, body copy, and native checkboxes with panel padding from `Content` `size`.
 */
export default function PopoverCompositionExample() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button.Root mode="stroke" variant="neutral">
          <Button.Icon>
            <SlidersHorizontal aria-hidden strokeWidth={1.75} />
          </Button.Icon>
          Report filters
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" side="bottom">
        <div className={styles.compositionHeader}>
          <Filter aria-hidden className={styles.headerIcon} strokeWidth={1.75} />
          <Typography.Root as="span" variant="body-small" weight="semibold">
            Quick filters
          </Typography.Root>
        </div>
        <Typography.Root as="p" className={styles.panelTextMuted} variant="body-small">
          Icon on the trigger, header and copy; panel padding comes from <code>Content</code>{" "}
          <code>size</code>.
        </Typography.Root>
        <div className={styles.checkboxStack}>
          <Checkbox.Root defaultChecked>
            <Checkbox.Label>Active only</Checkbox.Label>
          </Checkbox.Root>
          <Checkbox.Root>
            <Checkbox.Label>Hide zero values</Checkbox.Label>
          </Checkbox.Root>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
