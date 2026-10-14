/** A destructive confirm closes only from its buttons, and not at all while the request runs — `closeOnOutsideClick`, `closeOnEscape`. */
import { Button, Icon, Modal } from "prime-ui-kit";
import * as React from "react";

export default function ModalDismissExample() {
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
    <Modal.Root
      open={open}
      onOpenChange={setOpen}
      closeOnOutsideClick={false}
      closeOnEscape={false}
    >
      <Modal.Trigger>
        <Button.Root variant="outline" tone="danger">
          Удалить проект
        </Button.Root>
      </Modal.Trigger>
      <Modal.Content size="s">
        {/* While the request runs, the guard keeps «Отмена» in place, disabled. */}
        <Modal.Guard busy={deleting} />
        <Modal.Header showClose={false}>
          <Modal.Icon tone="danger">
            <Icon name="action.delete" />
          </Modal.Icon>
          <Modal.Title>Удалить «Сайт компании»?</Modal.Title>
          <Modal.Description>
            Задачи, файлы и история будут удалены без возможности восстановления.
          </Modal.Description>
        </Modal.Header>
        <Modal.Footer>
          <Modal.Close>
            <Button.Root variant="outline" tone="neutral">
              Отмена
            </Button.Root>
          </Modal.Close>
          <Modal.Confirm>
            <Button.Root tone="danger" loading={deleting} onClick={remove}>
              Удалить
            </Button.Root>
          </Modal.Confirm>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
