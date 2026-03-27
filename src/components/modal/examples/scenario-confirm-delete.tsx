import { Button } from "@/components/button/Button";
import { Modal } from "@/components/modal/Modal";
import { Typography } from "@/components/typography/Typography";
import { Icon } from "@/icons";

/** Blocking confirmation before destructive action; dismiss via header, overlay, Escape, or Cancel. */
export default function ModalConfirmDeleteExample() {
  return (
    <Modal.Root>
      <Modal.Trigger>
        <Button.Root variant="error" mode="stroke">
          Delete project
        </Button.Root>
      </Modal.Trigger>
      <Modal.Panel
        description="This removes the project, its boards, and history. Connected integrations will stop receiving events."
        footer={
          <>
            <Modal.Close>
              <Button.Root variant="neutral" mode="stroke">
                Cancel
              </Button.Root>
            </Modal.Close>
            <Button.Root variant="error" type="button">
              Delete permanently
            </Button.Root>
          </>
        }
        icon={<Icon surface="raised" name="action.close" tone="subtle" />}
        title="Delete “Northwind rollout”?"
      >
        <Typography.Root as="p" variant="body-default">
          You can export an archive first from Project settings. This action cannot be undone.
        </Typography.Root>
      </Modal.Panel>
    </Modal.Root>
  );
}
