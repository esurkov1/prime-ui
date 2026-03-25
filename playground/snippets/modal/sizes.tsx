import { Button } from "@/components/button/Button";
import { Modal } from "@/components/modal/Modal";
import { Icon } from "@/icons";
import type { ModalSize } from "@/internal/states";

function SizedModal({ size, label }: { size: ModalSize; label: string }) {
  return (
    <Modal.Root size={size}>
      <Modal.Trigger>
        <Button.Root size="m" variant="neutral" mode="stroke">
          {label}
        </Button.Root>
      </Modal.Trigger>
      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content aria-labelledby={`modal-size-${size}-title`}>
            <Modal.Header icon={<Icon name="nav.layoutGrid" />}>
              <Modal.Title id={`modal-size-${size}-title`}>Размер {size}</Modal.Title>
              <Modal.Description>
                Панель, отступы и размер кнопки закрытия в шапке соответствуют выбранному{" "}
                <code>size</code> на <code>Modal.Root</code>.
              </Modal.Description>
              <Modal.Close>
                <Button.Root variant="neutral" mode="ghost" aria-label="Закрыть">
                  <Button.Icon>
                    <Icon name="action.close" tone="subtle" />
                  </Button.Icon>
                </Button.Root>
              </Modal.Close>
            </Modal.Header>
            <Modal.Body>
              <p>Внутри диалога включён общий контекст размера для контролов.</p>
            </Modal.Body>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal.Root>
  );
}

/** Четыре размера оболочки: s, m, l, xl — по одному триггеру в ряд. */
export default function ModalSizesSnippet() {
  return (
    <>
      <SizedModal size="s" label="Modal s" />
      <SizedModal size="m" label="Modal m" />
      <SizedModal size="l" label="Modal l" />
      <SizedModal size="xl" label="Modal xl" />
    </>
  );
}
