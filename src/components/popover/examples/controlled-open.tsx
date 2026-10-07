/** The parent owns the open state: another button opens the panel from code and its own button closes it — `open`, `onOpenChange`. */
import { Button, Popover, Typography } from "prime-ui-kit";
import * as React from "react";

export default function PopoverControlledOpenExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root variant="ghost" tone="neutral" onClick={() => setOpen(true)}>
        Показать подсказку
      </Button.Root>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger>
          <Button.Root variant="soft" tone="neutral">
            Экспорт
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content>
          <Typography variant="body-s" tone="secondary">
            Отчёт выгрузится в CSV с текущими фильтрами.
          </Typography>
          <Popover.Actions>
            <Button.Root variant="soft" tone="neutral" onClick={() => setOpen(false)}>
              Понятно
            </Button.Root>
          </Popover.Actions>
        </Popover.Content>
      </Popover.Root>
    </>
  );
}
