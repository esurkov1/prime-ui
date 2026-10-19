/** An edit form that holds the dialog: changes make any dismiss ask first and show a note in the footer, the submit button saves the form, and while saving nothing closes it — `Modal.Guard`, `Modal.Meta`. */
import { Button, Fieldset, Input, Modal } from "prime-ui-kit";
import * as React from "react";

const CLIENT = { company: "ООО «Северный ветер»", email: "office@nwind.ru" };

/** Pretends to send the form. */
function saveClient() {
  return new Promise((resolve) => setTimeout(resolve, 1200));
}

export default function ModalGuardExample() {
  const formId = React.useId();
  const [open, setOpen] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    await saveClient();
    setSaving(false);
    setDirty(false);
    setOpen(false);
  };

  return (
    <Modal.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setDirty(false);
      }}
    >
      <Modal.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Изменить клиента
        </Button.Root>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Guard busy={saving} dirty={dirty} />
        <Modal.Header>
          <Modal.Title>Клиент</Modal.Title>
          <Modal.Description>Реквизиты для счетов и актов</Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <form id={formId} onSubmit={submit}>
            <Fieldset disabled={saving}>
              <Input.Root label="Компания">
                <Input.Wrapper>
                  <Input.Field
                    name="company"
                    defaultValue={CLIENT.company}
                    onValueChange={() => setDirty(true)}
                  />
                </Input.Wrapper>
              </Input.Root>
              <Input.Root label="Почта для документов">
                <Input.Wrapper>
                  <Input.Field
                    name="email"
                    type="email"
                    defaultValue={CLIENT.email}
                    onValueChange={() => setDirty(true)}
                  />
                </Input.Wrapper>
              </Input.Root>
            </Fieldset>
          </form>
        </Modal.Body>
        <Modal.Footer>
          {dirty ? <Modal.Meta>Есть несохранённые изменения</Modal.Meta> : null}
          <Modal.Close>
            <Button.Root variant="soft" tone="neutral">
              Отмена
            </Button.Root>
          </Modal.Close>
          <Button.Root type="submit" form={formId} loading={saving} disabled={!dirty}>
            Сохранить
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
