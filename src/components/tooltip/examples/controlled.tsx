/** Controlled tooltip: `open` + `onOpenChange` shared by hover and a switch. Use when another control or an onboarding step must show the hint. */
import { Button, Switch, Tooltip } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function TooltipControlledExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={styles.column}>
      <Switch.Root checked={open} onCheckedChange={setOpen}>
        <Switch.Label>Показать подсказку</Switch.Label>
      </Switch.Root>
      <Tooltip.Root open={open} onOpenChange={setOpen} delayDuration={0}>
        <Tooltip.Trigger>
          <Button.Root variant="soft" tone="neutral">
            Экспорт
          </Button.Root>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom">Выгрузка займёт около минуты</Tooltip.Content>
      </Tooltip.Root>
    </div>
  );
}
