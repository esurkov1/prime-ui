import { Button } from "@/components/button/Button";
import { Modal } from "@/components/modal/Modal";
import { Typography } from "@/components/typography/Typography";
import { Icon } from "@/icons";

/** Full-width footer actions via `Button.Root` `fullWidth`; mirrors `playground/snippets/modal/full-width.tsx`. */
export default function ModalPatternFullWidthFooterExample() {
  return (
    <Modal.Root>
      <Modal.Trigger>
        <Button.Root variant="neutral" mode="stroke">
          Checkout
        </Button.Root>
      </Modal.Trigger>
      <Modal.Panel
        description="Stack full-width buttons so the footer column matches the panel width on narrow layouts."
        footer={
          <div
            style={{
              display: "grid",
              gap: "var(--prime-sys-spacing-x2)",
              width: "100%",
            }}
          >
            <Modal.Close>
              <Button.Root variant="primary" fullWidth>
                Pay now
              </Button.Root>
            </Modal.Close>
            <Modal.Close>
              <Button.Root variant="neutral" mode="stroke" fullWidth>
                Back to cart
              </Button.Root>
            </Modal.Close>
          </div>
        }
        icon={<Icon name="action.upload" />}
        title="Confirm order"
      >
        <Typography.Root as="p" variant="body-default">
          Review your cart before continuing to payment.
        </Typography.Root>
      </Modal.Panel>
    </Modal.Root>
  );
}
