import { Button, Modal } from "prime-ui-kit";
import * as React from "react";

/**
 * Destructive flow: `variant="error"` on the trigger and on the confirming action; neutral cancel.
 */
export default function DestructiveConfirmExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger>
        <Button.Root variant="error" mode="stroke" size="m">
          Delete project
        </Button.Root>
      </Modal.Trigger>
      <Modal.Panel
        title="Delete this project?"
        footer={
          <>
            <Modal.Close>
              <Button.Root variant="neutral" mode="stroke" size="m">
                Cancel
              </Button.Root>
            </Modal.Close>
            <Button.Root variant="error" mode="filled" size="m" onClick={() => setOpen(false)}>
              Delete
            </Button.Root>
          </>
        }
      >
        <p style={{ margin: 0 }}>This permanently removes the project and its data.</p>
      </Modal.Panel>
    </Modal.Root>
  );
}
