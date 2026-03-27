import { Button, Popover } from "prime-ui-kit";

import styles from "./popover-examples.module.css";

/**
 * `defaultOpen` for initially visible panel; disabled trigger does not open the popover.
 */
export default function PopoverStatesExample() {
  return (
    <div className={styles.sizesRow}>
      <Popover.Root defaultOpen>
        <Popover.Trigger asChild>
          <Button.Root mode="stroke" size="m" variant="neutral">
            Starts open
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content align="start" insetGap="x3" insetPadding="x2" side="bottom" size="m">
          <p className={styles.panelTextMuted}>
            <code>defaultOpen</code> on the root — initial open state without lifting state up.
          </p>
        </Popover.Content>
      </Popover.Root>

      <Popover.Root>
        <Popover.Trigger asChild>
          <Button.Root disabled mode="stroke" size="m" variant="neutral">
            Trigger disabled
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content align="start" insetGap="x3" insetPadding="x2" side="bottom" size="m">
          <p className={styles.panelTextMuted}>Panel never opens while the button is disabled.</p>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
