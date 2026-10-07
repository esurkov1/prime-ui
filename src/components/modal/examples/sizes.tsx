/** Modal.Content widths s · m · l · xl; s/m fill the footer with equal buttons, l/xl align them to the end. Pick the narrowest size the content fits. */
import { Button, Modal, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = [
  { size: "s", width: "440 px — подтверждения" },
  { size: "m", width: "560 px — короткие формы" },
  { size: "l", width: "720 px — формы в две колонки" },
  { size: "xl", width: "960 px — таблицы и превью" },
] as const;

export default function ModalSizesExample() {
  return (
    <div className={styles.row}>
      {SIZES.map(({ size, width }) => (
        <Modal.Root key={size}>
          <Modal.Trigger>
            <Button.Root variant="soft" tone="neutral">
              Размер {size}
            </Button.Root>
          </Modal.Trigger>
          <Modal.Content size={size}>
            <Modal.Header>
              <Modal.Title>Окно размера {size}</Modal.Title>
              <Modal.Description>{width}</Modal.Description>
            </Modal.Header>
            <Modal.Body>
              <Typography.Root variant="body-m" tone="secondary">
                Выбирайте самый узкий размер, в который контент помещается без переносов строк
                формы.
              </Typography.Root>
            </Modal.Body>
            <Modal.Footer>
              <Modal.Close>
                <Button.Root variant="outline" tone="neutral">
                  Отмена
                </Button.Root>
              </Modal.Close>
              <Modal.Confirm>
                <Button.Root>Продолжить</Button.Root>
              </Modal.Confirm>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Root>
      ))}
    </div>
  );
}
