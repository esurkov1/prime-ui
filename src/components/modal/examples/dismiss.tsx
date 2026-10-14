/** A step the person has to finish: the payment details dialog closes only from its buttons, and not at all while they are saved — `closeOnOutsideClick`, `closeOnEscape`. */
import { Button, Icon, Input, Modal } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function ModalDismissExample() {
  const formId = React.useId();
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  return (
    <Modal.Root
      open={open}
      onOpenChange={setOpen}
      closeOnOutsideClick={false}
      closeOnEscape={false}
    >
      <Modal.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Реквизиты для счетов
        </Button.Root>
      </Modal.Trigger>
      <Modal.Content size="s">
        {/* While the details are saved, the guard keeps «Позже» in place, disabled. */}
        <Modal.Guard busy={saving} />
        <Modal.Header showClose={false}>
          <Modal.Icon tone="accent">
            <Icon name="object.receipt" />
          </Modal.Icon>
          <Modal.Title>Укажите реквизиты</Modal.Title>
          <Modal.Description>Без них счета клиентам не выставить.</Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <form
            id={formId}
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
              setSaving(true);
              window.setTimeout(() => {
                setSaving(false);
                setOpen(false);
              }, 1200);
            }}
          >
            <Input.Root label="ИНН">
              <Input.Wrapper>
                <Input.Field name="inn" inputMode="numeric" autoComplete="off" />
              </Input.Wrapper>
            </Input.Root>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close>
            <Button.Root variant="outline" tone="neutral">
              Позже
            </Button.Root>
          </Modal.Close>
          <Button.Root type="submit" form={formId} loading={saving}>
            Сохранить
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
