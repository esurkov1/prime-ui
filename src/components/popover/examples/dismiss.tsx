/** A note being typed is not lost to a stray click: the panel closes only from its buttons, and not at all while the note is saved — `closeOnOutsideClick`, `closeOnEscape`. */
import { Button, Input, Popover } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function PopoverDismissExample() {
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  return (
    <Popover.Root
      open={open}
      onOpenChange={setOpen}
      closeOnOutsideClick={false}
      closeOnEscape={!saving}
    >
      <Popover.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Заметка к заказу
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content className={styles.panel} trapFocus>
        <form
          className={styles.stack}
          onSubmit={(event) => {
            event.preventDefault();
            setSaving(true);
            window.setTimeout(() => {
              setSaving(false);
              setOpen(false);
            }, 1200);
          }}
        >
          <Popover.Header>
            <Popover.Title>Заметка к заказу №4821</Popover.Title>
            <Popover.Description>Её увидят все, кто работает с заказом.</Popover.Description>
          </Popover.Header>
          <Input.Root label="Текст заметки">
            <Input.Wrapper>
              <Input.Field name="note" placeholder="Клиент просит доставку после 18:00" />
            </Input.Wrapper>
          </Input.Root>
          <Popover.Actions>
            <Popover.Close>
              <Button.Root variant="ghost" tone="neutral" disabled={saving}>
                Отмена
              </Button.Root>
            </Popover.Close>
            <Button.Root type="submit" loading={saving}>
              Сохранить
            </Button.Root>
          </Popover.Actions>
        </form>
      </Popover.Content>
    </Popover.Root>
  );
}
