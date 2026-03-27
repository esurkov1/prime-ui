import { Button } from "@/components/button/Button";
import { Modal } from "@/components/modal/Modal";
import { Icon } from "@/icons";

/** Default dismiss vs `closeOnEscape` / `closeOnOverlayClick` disabled; mirrors `playground/snippets/modal/states.tsx`. */
export default function ModalPatternCloseBehaviorExample() {
  return (
    <>
      <Modal.Root>
        <Modal.Trigger>
          <Button.Root variant="neutral" mode="stroke">
            Standard dismiss
          </Button.Root>
        </Modal.Trigger>
        <Modal.Panel
          closeAriaLabel="Close"
          description="Escape and a direct backdrop click close the dialog (click target must be the overlay)."
          icon={<Icon surface="raised" name="field.email" />}
          title="Default behavior"
        >
          <p>Try Escape and clicking the dimmed area outside the panel.</p>
        </Modal.Panel>
      </Modal.Root>

      <Modal.Root closeOnEscape={false} closeOnOverlayClick={false}>
        <Modal.Trigger>
          <Button.Root variant="error" mode="lighter">
            <Button.Icon>
              <Icon surface="raised" name="status.locked" />
            </Button.Icon>
            Explicit actions only
          </Button.Root>
        </Modal.Trigger>
        <Modal.Panel
          description="With both flags false, only buttons dismiss the dialog."
          footer={
            <Modal.Close>
              <Button.Root variant="neutral" mode="stroke">
                OK
              </Button.Root>
            </Modal.Close>
          }
          icon={<Icon surface="raised" name="status.locked" />}
          showClose={false}
          title="Strict mode"
        >
          <p>Escape and backdrop clicks do nothing.</p>
        </Modal.Panel>
      </Modal.Root>
    </>
  );
}
