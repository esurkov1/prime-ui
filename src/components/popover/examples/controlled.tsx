/** Controlled popover: `open` + `onOpenChange` held by the parent, opened from another button and closed from inside. Use when other UI must open or close the panel. */
import { Button, Popover, Typography } from "prime-ui-kit";
import * as React from "react";

import preview from "./examples.module.css";

export default function PopoverControlledExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={preview.column}>
      <div className={preview.row}>
        <Button.Root variant="ghost" tone="neutral" onClick={() => setOpen(true)}>
          Открыть извне
        </Button.Root>
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger>
            <Button.Root variant="soft" tone="neutral">
              Триггер
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content>
            <Typography.Root variant="body-s" tone="secondary" className={preview.text}>
              Состояние хранит родитель.
            </Typography.Root>
            <Popover.Actions>
              <Button.Root variant="soft" tone="neutral" onClick={() => setOpen(false)}>
                Закрыть
              </Button.Root>
            </Popover.Actions>
          </Popover.Content>
        </Popover.Root>
      </div>
      <Typography.Root as="p" variant="body-s" tone="secondary">
        Панель {open ? "открыта" : "закрыта"}
      </Typography.Root>
    </div>
  );
}
