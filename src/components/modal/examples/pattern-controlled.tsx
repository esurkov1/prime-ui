import * as React from "react";

import { Button } from "@/components/button/Button";
import { Modal } from "@/components/modal/Modal";
import { Icon } from "@/icons";

/** Controlled `open` / `onOpenChange` without `Modal.Trigger`; mirrors `playground/snippets/modal/controlled.tsx`. */
export default function ModalPatternControlledExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--prime-sys-spacing-x2)" }}>
      <Button.Root variant="primary" onClick={() => setOpen(true)}>
        Open from outside
      </Button.Root>
      <Button.Root mode="stroke" variant="neutral" onClick={() => setOpen(false)}>
        Close from outside
      </Button.Root>

      <Modal.Root open={open} onOpenChange={setOpen}>
        <Modal.Panel
          closeAriaLabel="Close"
          description="Open and close are driven by `open` and `onOpenChange` on the root."
          footer={
            <Modal.Close>
              <Button.Root variant="primary">Done</Button.Root>
            </Modal.Close>
          }
          icon={<Icon name="action.copy" />}
          title="Externally controlled"
        >
          <p>No in-tree trigger is required: the parent owns visibility.</p>
        </Modal.Panel>
      </Modal.Root>
    </div>
  );
}
