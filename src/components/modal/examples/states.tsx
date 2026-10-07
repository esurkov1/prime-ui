/** Destructive confirm without a body (danger icon, `closeOnOutsideClick={false}`, loading action in Modal.Confirm) and a header-only info dialog. Use for delete confirmations and short notices. */
import { FileText, Trash2 } from "lucide-react";
import { Button, Modal } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function ModalStatesExample() {
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
    <div className={styles.row}>
      <Modal.Root open={open} onOpenChange={setOpen} closeOnOutsideClick={false}>
        <Modal.Trigger>
          <Button.Root variant="soft" tone="danger">
            Удалить проект
          </Button.Root>
        </Modal.Trigger>
        <Modal.Content size="s">
          <Modal.Header>
            <Modal.Icon tone="danger">
              <Trash2 />
            </Modal.Icon>
            <Modal.Title>Удалить «Сайт компании»?</Modal.Title>
            <Modal.Description>
              Задачи, файлы и история будут удалены без возможности восстановления.
            </Modal.Description>
          </Modal.Header>
          <Modal.Footer>
            <Modal.Close>
              <Button.Root variant="outline" tone="neutral" disabled={deleting}>
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

      <Modal.Root>
        <Modal.Trigger>
          <Button.Root variant="soft" tone="neutral">
            Только информация
          </Button.Root>
        </Modal.Trigger>
        <Modal.Content size="s">
          <Modal.Header>
            <Modal.Icon tone="info">
              <FileText />
            </Modal.Icon>
            <Modal.Title>Отчёт готовится</Modal.Title>
            <Modal.Description>
              Пришлём письмо, когда файл можно будет скачать. Обычно это пара минут.
            </Modal.Description>
          </Modal.Header>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
}
