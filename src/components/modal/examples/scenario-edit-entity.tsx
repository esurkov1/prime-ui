import * as React from "react";

import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { Modal } from "@/components/modal/Modal";
import { Icon } from "@/icons";

/** Short edit flow: pre-filled field, save keeps the dialog open only if you handle state (here: close on save click). */
export default function ModalEditEntityExample() {
  const [name, setName] = React.useState("Acme Corp");

  return (
    <Modal.Root>
      <Modal.Trigger>
        <Button.Root variant="neutral" mode="stroke">
          Rename account
        </Button.Root>
      </Modal.Trigger>
      <Modal.Panel
        description="The new name appears on invoices and in the member directory."
        footer={
          <>
            <Modal.Close>
              <Button.Root variant="neutral" mode="stroke">
                Cancel
              </Button.Root>
            </Modal.Close>
            <Modal.Close>
              <Button.Root variant="primary" type="button">
                Save changes
              </Button.Root>
            </Modal.Close>
          </>
        }
        icon={<Icon surface="raised" name="nav.layoutGrid" tone="subtle" />}
        title="Edit account name"
      >
        <Input.Root label="Account name">
          <Input.Wrapper>
            <Input.Field
              onChange={(e) => setName(e.target.value)}
              value={name}
              autoComplete="organization"
            />
          </Input.Wrapper>
        </Input.Root>
      </Modal.Panel>
    </Modal.Root>
  );
}
