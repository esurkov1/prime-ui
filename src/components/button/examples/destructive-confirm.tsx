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
        <Button.Root variant="error" mode="stroke">
          Delete project
        </Button.Root>
      </Modal.Trigger>
      <Modal.Panel
        title="Delete this project?"
        footer={
          <Modal.Footer
            primary={
              <Button.Root variant="error" mode="filled" onClick={() => setOpen(false)}>
                Delete
              </Button.Root>
            }
            secondary={
              <Modal.Close>
                <Button.Root variant="neutral" mode="stroke">
                  Cancel
                </Button.Root>
              </Modal.Close>
            }
          />
        }
      >
        <p style={{ margin: 0 }}>This permanently removes the project and its data.</p>
      </Modal.Panel>
    </Modal.Root>
  );
}
