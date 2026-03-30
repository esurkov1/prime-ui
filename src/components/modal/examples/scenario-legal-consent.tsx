import { Button } from "@/components/button/Button";
import { Modal } from "@/components/modal/Modal";
import { Typography } from "@/components/typography/Typography";
import { Icon } from "@/icons";

/** Disclosure + explicit accept; primary action is wrapped in `Modal.Close` so accepting dismisses the dialog. */
export default function ModalLegalConsentExample() {
  return (
    <Modal.Root closeOnOverlayClick={false}>
      <Modal.Trigger>
        <Button.Root variant="neutral" mode="stroke">
          Review terms
        </Button.Root>
      </Modal.Trigger>
      <Modal.Panel
        description="Please read the following before continuing to use the service."
        footer={
          <Modal.Footer
            primary={
              <Modal.Close>
                <Button.Root variant="primary" type="button">
                  I agree
                </Button.Root>
              </Modal.Close>
            }
          />
        }
        icon={<Icon name="status.locked" tone="subtle" />}
        title="Terms and data processing"
      >
        <Typography.Root as="p" variant="body-default">
          By continuing, you agree to our Terms of Service and acknowledge our Privacy Policy. We
          process account data to provide the product, send essential notices, and improve
          reliability. You may withdraw consent where applicable by contacting support or adjusting
          settings.
        </Typography.Root>
      </Modal.Panel>
    </Modal.Root>
  );
}
