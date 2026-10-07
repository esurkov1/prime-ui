/** The parent owns the open state: a switch shows the tooltip from code, hover and focus still work — `open`, `onOpenChange`. */
import { Button, Switch, Tooltip } from "prime-ui-kit";
import * as React from "react";

export default function TooltipControlledOpenExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Switch.Root checked={open} onCheckedChange={setOpen}>
        <Switch.Label>Показать подсказку</Switch.Label>
      </Switch.Root>
      <Tooltip.Root open={open} onOpenChange={setOpen}>
        <Tooltip.Trigger>
          <Button.Root variant="soft" tone="neutral">
            Экспорт
          </Button.Root>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom">Выгрузка займёт около минуты</Tooltip.Content>
      </Tooltip.Root>
    </>
  );
}
