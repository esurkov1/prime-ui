import * as React from "react";

import { Button } from "@/components/button/Button";
import { Modal } from "@/components/modal/Modal";
import { Icon } from "@/icons";

/** Custom `container` portal target and scrollable body via `bodyStyle`; mirrors `playground/snippets/modal/features.tsx`. */
export default function ModalPatternPortalAndScrollExample() {
  const [portalHost, setPortalHost] = React.useState<HTMLDivElement | null>(null);

  const longLines = [
    "Line 1: scrollable body inside the dialog while the page stays locked.",
    "Line 2: scrollable body inside the dialog while the page stays locked.",
    "Line 3: scrollable body inside the dialog while the page stays locked.",
    "Line 4: scrollable body inside the dialog while the page stays locked.",
    "Line 5: scrollable body inside the dialog while the page stays locked.",
    "Line 6: scrollable body inside the dialog while the page stays locked.",
    "Line 7: scrollable body inside the dialog while the page stays locked.",
    "Line 8: scrollable body inside the dialog while the page stays locked.",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--prime-sys-spacing-x3)" }}>
      <div
        ref={setPortalHost}
        style={{
          padding: "var(--prime-sys-spacing-x3)",
          border: "1px dashed var(--prime-sys-color-border-default)",
          borderRadius: "var(--prime-sys-shape-radius-s)",
        }}
      >
        <p>
          <code>Modal.Panel</code> <code>container</code> mounts the portal inside this box (useful
          for tests or custom stacking).
        </p>
        {portalHost ? (
          <Modal.Root>
            <Modal.Trigger>
              <Button.Root variant="neutral" mode="stroke">
                Portal into host
              </Button.Root>
            </Modal.Trigger>
            <Modal.Panel
              closeAriaLabel="Close"
              container={portalHost}
              icon={<Icon name="nav.layoutGrid" />}
              title="Custom container"
            >
              <p>Portal content is attached under the host element above.</p>
            </Modal.Panel>
          </Modal.Root>
        ) : null}
      </div>

      <Modal.Root>
        <Modal.Trigger>
          <Button.Root variant="neutral" mode="stroke">
            Long body (scroll)
          </Button.Root>
        </Modal.Trigger>
        <Modal.Panel
          bodyStyle={{ maxHeight: "10rem", overflowY: "auto" }}
          closeAriaLabel="Close"
          description="Cap the body height with `bodyStyle` (or `bodyClassName`) so only the panel scrolls."
          footer={
            <Modal.Close>
              <Button.Root variant="primary">Close</Button.Root>
            </Modal.Close>
          }
          icon={<Icon name="nav.itemDot" />}
          title="Scroll inside panel"
        >
          {longLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </Modal.Panel>
      </Modal.Root>
    </div>
  );
}
