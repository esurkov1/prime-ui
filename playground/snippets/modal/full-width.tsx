import { Button } from "@/components/button/Button";
import { Modal } from "@/components/modal/Modal";
import { Icon } from "@/icons";

/** Кнопки в подвале с `fullWidth`: колонка действий на всю ширину панели (типично для узкой ширины). */
export default function ModalFullWidthSnippet() {
  return (
    <Modal.Root>
      <Modal.Trigger>
        <Button.Root size="m" variant="neutral" mode="stroke">
          Оформить заказ
        </Button.Root>
      </Modal.Trigger>
      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content aria-labelledby="modal-fw-title">
            <Modal.Header
              icon={<Icon name="action.upload" />}
              titleId="modal-fw-title"
              title="Подтверждение"
              description={
                <>
                  В подвале — вертикальный стек: у <code>Button.Root</code> задан{" "}
                  <code>fullWidth</code>, панель задаёт ширину колонки.
                </>
              }
              closeAriaLabel="Закрыть"
            />
            <Modal.Body>
              <p style={{ margin: 0 }}>Проверьте состав корзины перед оплатой.</p>
            </Modal.Body>
            <Modal.Footer
              style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}
            >
              <Modal.Close>
                <Button.Root size="m" variant="primary" fullWidth>
                  Перейти к оплате
                </Button.Root>
              </Modal.Close>
              <Modal.Close>
                <Button.Root size="m" variant="neutral" mode="stroke" fullWidth>
                  В корзину
                </Button.Root>
              </Modal.Close>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal.Root>
  );
}
