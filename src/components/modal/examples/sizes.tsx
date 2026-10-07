/** Every width; s and m fill the footer with equal buttons, l and xl align them to the end — `size`. */
import { Button, Modal, Typography } from "prime-ui-kit";

const SIZES = [
  { size: "s", width: "440 px — подтверждения" },
  { size: "m", width: "560 px — короткие формы" },
  { size: "l", width: "720 px — формы в две колонки" },
  { size: "xl", width: "960 px — таблицы и превью" },
] as const;

export default function ModalSizesExample() {
  return (
    <>
      {SIZES.map(({ size, width }) => (
        <Modal.Root key={size}>
          <Modal.Trigger>
            <Button.Root variant="soft" tone="neutral">
              {size}
            </Button.Root>
          </Modal.Trigger>
          <Modal.Content size={size}>
            <Modal.Header>
              <Modal.Title>Окно размера {size}</Modal.Title>
              <Modal.Description>{width}</Modal.Description>
            </Modal.Header>
            <Modal.Body>
              <Typography variant="body-m" tone="secondary">
                Выбирайте самый узкий размер, в который содержимое помещается без переносов строк
                формы.
              </Typography>
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
    </>
  );
}
