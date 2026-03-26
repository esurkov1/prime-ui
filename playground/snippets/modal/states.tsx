import { Button } from "@/components/button/Button";
import { Modal } from "@/components/modal/Modal";
import { Icon } from "@/icons";

export default function ModalStatesSnippet() {
  return (
    <>
      <Modal.Root>
        <Modal.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            Обычное закрытие
          </Button.Root>
        </Modal.Trigger>
        <Modal.Layer>
          <Modal.Content>
            <Modal.Header
              icon={<Icon name="field.email" />}
              title="Стандартное поведение"
              description="Закрытие по Escape и по клику на затемнённый фон (если клик не на панели)."
              closeAriaLabel="Закрыть"
            />
            <Modal.Body>
              <p>Попробуйте Escape и клик по области вне белой панели.</p>
            </Modal.Body>
          </Modal.Content>
        </Modal.Layer>
      </Modal.Root>

      <Modal.Root closeOnEscape={false} closeOnOverlayClick={false}>
        <Modal.Trigger>
          <Button.Root size="m" variant="error" mode="lighter">
            <Button.Icon>
              <Icon name="status.locked" />
            </Button.Icon>
            Только явные действия
          </Button.Root>
        </Modal.Trigger>
        <Modal.Layer>
          <Modal.Content>
            <Modal.Header
              icon={<Icon name="status.locked" />}
              title="Жёсткий режим"
              description={
                <>
                  <code>closeOnEscape=&#123;false&#125;</code> и{" "}
                  <code>closeOnOverlayClick=&#123;false&#125;</code> — выход только через кнопки.
                </>
              }
              showClose={false}
            />
            <Modal.Body>
              <p>Escape и клик по фону не закроют окно.</p>
            </Modal.Body>
            <Modal.Footer>
              <Modal.Close>
                <Button.Root size="m" variant="neutral" mode="stroke">
                  Понятно
                </Button.Root>
              </Modal.Close>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Layer>
      </Modal.Root>
    </>
  );
}
