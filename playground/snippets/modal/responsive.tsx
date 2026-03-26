import { Button } from "@/components/button/Button";
import { Modal } from "@/components/modal/Modal";
import { Icon } from "@/icons";

/** Ширина панели в стилях: min(100%, max-width по токенам) — на узком экране занимает доступную ширину с отступами оверлея. */
export default function ModalResponsiveSnippet() {
  return (
    <Modal.Root>
      <Modal.Trigger>
        <Button.Root size="m" variant="neutral" mode="stroke">
          Адаптивная ширина
        </Button.Root>
      </Modal.Trigger>
      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content aria-labelledby="modal-responsive-title">
            <Modal.Header
              icon={<Icon name="nav.home" />}
              titleId="modal-responsive-title"
              title="Адаптивная ширина"
              description="При уменьшении окна браузера панель сжимается вместе с полем, не вылезая за отступы затемнения."
              closeAriaLabel="Закрыть"
            />
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
