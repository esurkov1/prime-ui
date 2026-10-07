/** `sameMinWidthAsTrigger`: the panel takes the width of a full-width trigger and the text wraps. Use in narrow columns and sidebars. */
import { Button, Popover, Typography } from "prime-ui-kit";

import preview from "./examples.module.css";

export default function PopoverFullWidthExample() {
  return (
    <div className={preview.narrowColumn}>
      <Popover.Root>
        <Popover.Trigger>
          <Button.Root variant="soft" tone="neutral" fullWidth>
            Условия тарифа
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content sameMinWidthAsTrigger>
          <Typography.Root variant="body-s" tone="secondary" className={preview.text}>
            До 10 пользователей, 50 ГБ хранилища и приоритетная поддержка.
          </Typography.Root>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
