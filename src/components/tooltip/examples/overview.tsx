/** An icon-only button with a tooltip that repeats its name on hover and keyboard focus — `Tooltip.Trigger`, `Tooltip.Content`. */
import { Button, Icon, Tooltip } from "prime-ui-kit";

export default function TooltipOverviewExample() {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Button.Root variant="ghost" tone="neutral" aria-label="Скопировать ссылку">
          <Button.Icon>
            <Icon name="action.copy" />
          </Button.Icon>
        </Button.Root>
      </Tooltip.Trigger>
      <Tooltip.Content>Скопировать ссылку</Tooltip.Content>
    </Tooltip.Root>
  );
}
