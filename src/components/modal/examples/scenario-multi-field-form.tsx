import * as React from "react";

import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { Label } from "@/components/label/Label";
import { Modal } from "@/components/modal/Modal";
import { Select } from "@/components/select/Select";
import { Textarea } from "@/components/textarea/Textarea";
import { Icon } from "@/icons";

import styles from "./examples.module.css";

/** Several fields in the modal body; footer mirrors the canonical pattern (cancel + submit). */
export default function ModalMultiFieldFormExample() {
  const messageId = React.useId();

  return (
    <Modal.Root>
      <Modal.Trigger>
        <Button.Root variant="neutral" mode="stroke">
          New support ticket
        </Button.Root>
      </Modal.Trigger>
      <Modal.Panel
        description="Include enough detail for our team to reproduce or route the issue."
        footer={
          <>
            <Modal.Close>
              <Button.Root variant="neutral" mode="stroke">
                Cancel
              </Button.Root>
            </Modal.Close>
            <Button.Root variant="primary" type="submit" form="modal-ticket-form">
              Submit ticket
            </Button.Root>
          </>
        }
        icon={<Icon surface="raised" name="nav.itemDot" tone="subtle" />}
        title="Contact support"
      >
        <form
          className={styles.fieldStack}
          id="modal-ticket-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <Input.Root label="Subject">
            <Input.Wrapper>
              <Input.Field name="subject" placeholder="Short summary" />
            </Input.Wrapper>
          </Input.Root>
          <Select.Root placeholder="Area">
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="billing">Billing</Select.Item>
              <Select.Item value="product">Product bug</Select.Item>
              <Select.Item value="account">Account access</Select.Item>
            </Select.Content>
          </Select.Root>
          <div className={styles.labeledControl}>
            <Label.Root htmlFor={messageId}>Message</Label.Root>
            <Textarea.Root id={messageId} placeholder="Steps, expected result, actual result" />
          </div>
        </form>
      </Modal.Panel>
    </Modal.Root>
  );
}
