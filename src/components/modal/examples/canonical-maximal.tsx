import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { Modal } from "@/components/modal/Modal";
import { Icon } from "@/icons";

/**
 * Maximal shell: `title`, `description`, `icon`, body field, `footer` with `Modal.Close` plus primary action.
 * Copy this structure when you need the full header/body/footer pattern.
 */
export default function ModalCanonicalMaximalExample() {
  return (
    <Modal.Root>
      <Modal.Trigger>
        <Button.Root size="m" variant="neutral" mode="stroke">
          Open workspace invite
        </Button.Root>
      </Modal.Trigger>
      <Modal.Panel
        description="We will send one invitation email. The recipient can accept or decline."
        footer={
          <>
            <Modal.Close>
              <Button.Root size="m" variant="neutral" mode="stroke">
                Cancel
              </Button.Root>
            </Modal.Close>
            <Button.Root size="m" variant="primary" type="button">
              Send invite
            </Button.Root>
          </>
        }
        icon={<Icon name="field.email" tone="subtle" />}
        title="Invite teammate"
      >
        <Input.Root label="Email address" size="m" hint="Work email preferred">
          <Input.Wrapper>
            <Input.Field autoComplete="email" placeholder="name@company.com" type="email" />
          </Input.Wrapper>
        </Input.Root>
      </Modal.Panel>
    </Modal.Root>
  );
}
