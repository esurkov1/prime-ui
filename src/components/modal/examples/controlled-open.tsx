/** The parent owns the open state and opens the dialog from code, without a trigger — `open`, `onOpenChange`. */
import { Button, Modal } from "prime-ui-kit";
import * as React from "react";

export default function ModalControlledOpenExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root variant="soft" tone="neutral" onClick={() => setOpen(true)}>
        Сымитировать конец сессии
      </Button.Root>
      <Modal.Root open={open} onOpenChange={setOpen}>
        <Modal.Content size="s">
          <Modal.Header>
            <Modal.Title>Сессия скоро истечёт</Modal.Title>
            <Modal.Description>Через 2 минуты вы выйдете из аккаунта.</Modal.Description>
          </Modal.Header>
          <Modal.Footer>
            <Modal.Close>
              <Button.Root variant="outline" tone="neutral">
                Выйти
              </Button.Root>
            </Modal.Close>
            <Modal.Confirm>
              <Button.Root onClick={() => setOpen(false)}>Продлить</Button.Root>
            </Modal.Confirm>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
