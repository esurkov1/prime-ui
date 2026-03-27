import { Button, Icon, LinkButton, Tooltip, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Link trigger with rich content; icon-only button with `aria-label` (mirrors `playground/snippets/tooltip/composition.tsx`). */
export default function TooltipCompositionExample() {
  return (
    <div className={styles.rowWrapXlCenter}>
      <Tooltip.Provider delayDuration={200}>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <LinkButton.Root href="#" size="m" onClick={(e) => e.preventDefault()}>
              Promotion terms
            </LinkButton.Root>
          </Tooltip.Trigger>
          <Tooltip.Content size="m">
            <Typography.Root variant="body-small" as="p" className={styles.tooltipContentP}>
              Discount applies through month-end on orders over $100.
            </Typography.Root>
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>

      <Tooltip.Provider delayDuration={200}>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Button.Root
              type="button"
              variant="neutral"
              mode="ghost"
              size="m"
              aria-label="Copy link"
            >
              <Button.Icon>
                <Icon name="action.copy" size="s" tone="subtle" />
              </Button.Icon>
            </Button.Root>
          </Tooltip.Trigger>
          <Tooltip.Content size="s">Copy link to clipboard</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
}
