import { Button } from "@/components/button/Button";
import { Modal } from "@/components/modal/Modal";
import { Icon } from "@/icons";

export default function ModalStatesSnippet() {
  return (
    <>
      <Modal.Root>
        <Modal.Trigger>
          <Button.Root variant="neutral" mode="stroke">
            Обычное закрытие
          </Button.Root>
        </Modal.Trigger>
        <Modal.Panel
          closeAriaLabel="Закрыть"
          description="Закрытие по Escape и по клику на затемнённый фон (если клик не на панели)."
          icon={<Icon name="field.email" />}
          title="Стандартное поведение"
        >
          <p>Попробуйте Escape и клик по области вне белой панели.</p>
        </Modal.Panel>
      </Modal.Root>

      <Modal.Root closeOnEscape={false} closeOnOverlayClick={false}>
        <Modal.Trigger>
          <Button.Root variant="error" mode="lighter">
            <Button.Icon>
              <Icon name="status.locked" />
            </Button.Icon>
            Только явные действия
          </Button.Root>
        </Modal.Trigger>
        <Modal.Panel
          description={
            <>
              <code>closeOnEscape=&#123;false&#125;</code> и{" "}
              <code>closeOnOverlayClick=&#123;false&#125;</code> — выход только через кнопки.
            </>
          }
          footer={
            <Modal.Close>
              <Button.Root variant="neutral" mode="stroke">
                Понятно
              </Button.Root>
            </Modal.Close>
          }
          icon={<Icon name="status.locked" />}
          showClose={false}
          title="Жёсткий режим"
        >
          <p>Escape и клик по фону не закроют окно.</p>
        </Modal.Panel>
      </Modal.Root>
    </>
  );
}
