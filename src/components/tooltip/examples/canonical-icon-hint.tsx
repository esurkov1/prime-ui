import { Button, Icon, Tooltip } from "prime-ui-kit";

/**
 * Icon-only control: accessible name on the trigger plus a short tooltip on hover/focus.
 */
export default function TooltipCanonicalIconHint() {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Button.Root type="button" variant="neutral" mode="ghost" aria-label="Copy link">
          <Button.Icon>
            <Icon name="action.copy" size="s" tone="subtle" />
          </Button.Icon>
        </Button.Root>
      </Tooltip.Trigger>
      <Tooltip.Content size="s">Copy page link to clipboard</Tooltip.Content>
    </Tooltip.Root>
  );
}
