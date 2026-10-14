/** In a narrow column the panel takes the exact width of a full-width trigger and its text wraps — `matchTriggerWidth`. */
import { Button, Popover, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function PopoverMatchTriggerWidthExample() {
  return (
    <div className={styles.narrowColumn}>
      <Popover.Root>
        <Popover.Trigger>
          <Button.Root variant="soft" tone="neutral" fullWidth>
            Условия тарифа
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content matchTriggerWidth>
          <Typography variant="body-s" tone="secondary">
            До 10 пользователей, 50 ГБ хранилища и приоритетная поддержка.
          </Typography>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
