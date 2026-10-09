/** Why an action is unavailable: the disabled button still shows its tooltip on hover and Tab, no wrapper needed — `Tooltip.Trigger`. */
import { Button, Tooltip } from "prime-ui-kit";

export default function TooltipDisabledTriggerExample() {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Button.Root disabled>Опубликовать</Button.Root>
      </Tooltip.Trigger>
      <Tooltip.Content>Заполните обязательные поля, чтобы опубликовать</Tooltip.Content>
    </Tooltip.Root>
  );
}
