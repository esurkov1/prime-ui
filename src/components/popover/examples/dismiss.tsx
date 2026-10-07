/** A destructive confirm that closes only from its buttons, and not at all while the request runs — `closeOnOutsideClick`, `closeOnEscape`. */
import { Button, Popover } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function PopoverDismissExample() {
  const [open, setOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const remove = () => {
    setDeleting(true);
    window.setTimeout(() => {
      setDeleting(false);
      setOpen(false);
    }, 1200);
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={setOpen}
      closeOnOutsideClick={false}
      closeOnEscape={!deleting}
    >
      <Popover.Trigger>
        <Button.Root variant="soft" tone="danger">
          Удалить комментарий
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content className={styles.panel}>
        <Popover.Header>
          <Popover.Title>Удалить комментарий?</Popover.Title>
          <Popover.Description>Его нельзя будет восстановить.</Popover.Description>
        </Popover.Header>
        <Popover.Actions>
          <Popover.Close>
            <Button.Root variant="ghost" tone="neutral" disabled={deleting}>
              Отмена
            </Button.Root>
          </Popover.Close>
          <Button.Root tone="danger" loading={deleting} onClick={remove}>
            Удалить
          </Button.Root>
        </Popover.Actions>
      </Popover.Content>
    </Popover.Root>
  );
}
