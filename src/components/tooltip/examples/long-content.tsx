/** A long hint that wraps at the tooltip max width. Use for a sentence of explanation; anything with actions belongs in a Popover. */
import { Button, Tooltip } from "prime-ui-kit";
import styles from "./examples.module.css";

export default function TooltipLongContentExample() {
  return (
    <div className={styles.row}>
      <Tooltip.Root delayDuration={200}>
        <Tooltip.Trigger>
          <Button.Root variant="soft" tone="neutral">
            Требования к паролю
          </Button.Root>
        </Tooltip.Trigger>
        <Tooltip.Content size="l">
          Не короче 12 символов, буквы разного регистра и цифры. Не используйте пароль от других
          сервисов.
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  );
}
