import { Button } from "@/components/button/Button";
import { Modal } from "@/components/modal/Modal";
import { Icon } from "@/icons";

/** Ширина панели в стилях: min(100%, максимум для выбранного size) — на узком экране занимает доступную ширину с отступами оверлея. */
export default function ModalResponsiveSnippet() {
  return (
    <Modal.Root size="l">
      <Modal.Trigger>
        <Button.Root size="m" variant="neutral" mode="stroke">
          Широкая панель (l)
        </Button.Root>
      </Modal.Trigger>
      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content aria-labelledby="modal-responsive-title">
            <Modal.Header icon={<Icon name="nav.home" />}>
              <Modal.Title id="modal-responsive-title">Адаптивная ширина</Modal.Title>
              <Modal.Description>
                При уменьшении окна браузера панель сжимается вместе с полем, не вылезая за отступы
                затемнения.
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
              <p>
                Смените ширину окна: на десктопе виден верхний предел по токенам, на мобильной
                ширине — почти вся область между боковыми отступами оверлея.
              </p>
            </Modal.Body>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal.Root>
  );
}
