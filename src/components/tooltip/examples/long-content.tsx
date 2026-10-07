/** A sentence of explanation wraps at the tooltip max width; anything with actions belongs in a Popover — `Tooltip.Content`. */
import { Button, Tooltip } from "prime-ui-kit";

export default function TooltipLongContentExample() {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Требования к паролю
        </Button.Root>
      </Tooltip.Trigger>
      <Tooltip.Content>
        Не короче 12 символов, буквы разного регистра и цифры. Не используйте пароль от других
        сервисов.
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
