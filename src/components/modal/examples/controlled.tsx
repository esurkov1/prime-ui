/** Controlled dialog without Modal.Trigger: the parent owns `open` and opens it from code. Use when a route, store or timer decides when the dialog shows. */
import { Button, Modal, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function ModalControlledExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={styles.row}>
      <Button.Root variant="soft" tone="neutral" onClick={() => setOpen(true)}>
        Открыть из кода
      </Button.Root>
      <Typography.Root as="span" variant="body-s" tone="secondary">
        open = {String(open)}
      </Typography.Root>

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
    </div>
  );
}
