/** A destructive confirm with Header, Title, Description and Actions, and a disabled trigger that never opens the panel. Use for lightweight confirmations next to the action. */
import { Button, Popover, Typography } from "prime-ui-kit";
import * as React from "react";

import preview from "./examples.module.css";

export default function PopoverStatesExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={preview.row}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger>
          <Button.Root variant="soft" tone="danger">
            Удалить комментарий
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content className={preview.panelWidth}>
          <Popover.Header>
            <Popover.Title>Удалить комментарий?</Popover.Title>
            <Popover.Description>Его нельзя будет восстановить.</Popover.Description>
          </Popover.Header>
          <Popover.Actions>
            <Button.Root variant="ghost" tone="neutral" onClick={() => setOpen(false)}>
              Отмена
            </Button.Root>
            <Button.Root tone="danger" onClick={() => setOpen(false)}>
              Удалить
            </Button.Root>
          </Popover.Actions>
        </Popover.Content>
      </Popover.Root>

      <Popover.Root>
        <Popover.Trigger>
          <Button.Root variant="soft" tone="neutral" disabled>
            Недоступно
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content>
          <Typography.Root variant="body-s" tone="secondary" className={preview.text}>
            Не откроется: триггер отключён.
          </Typography.Root>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
