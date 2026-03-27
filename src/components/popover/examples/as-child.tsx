import { Popover } from "prime-ui-kit";

import styles from "./popover-examples.module.css";

/**
 * Single custom child under `Popover.Trigger` (native `<button>` styled as a text link): ref and ARIA merge on that element.
 */
export default function PopoverAsChildExample() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className={styles.textLinkTrigger} type="button">
          Text button trigger
        </button>
      </Popover.Trigger>
      <Popover.Content align="start" side="bottom">
        <p className={styles.panelTextMuted}>
          One arbitrary element as the anchor; the kit merges <code>ref</code>,{" "}
          <code>aria-expanded</code>, <code>aria-controls</code>, and the click toggle handler.
        </p>
      </Popover.Content>
    </Popover.Root>
  );
}
