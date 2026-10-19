/** A form that holds the drawer from inside: after an edit Escape, the scrim and Cancel ask before discarding, the footer says so, and saving locks every way out — `Drawer.Guard`, `Drawer.Meta`. */
import { Button, Drawer, Fieldset, Input, Textarea } from "prime-ui-kit";
import * as React from "react";

/** Pretends to send the form. */
function saveTask() {
  return new Promise((resolve) => setTimeout(resolve, 1200));
}

export default function DrawerGuardExample() {
  const formId = React.useId();
  const [open, setOpen] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    await saveTask();
    setSaving(false);
    setDirty(false);
    setOpen(false);
  };

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setDirty(false);
      }}
    >
      <Drawer.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Изменить задачу
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Подготовить договор</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <Drawer.Guard busy={saving} dirty={dirty} />
          <form id={formId} onSubmit={submit}>
            <Fieldset disabled={saving}>
              <Input.Root label="Название">
                <Input.Wrapper>
                  <Input.Field
                    name="title"
                    defaultValue="Подготовить договор"
                    onValueChange={() => setDirty(true)}
                  />
                </Input.Wrapper>
              </Input.Root>
              <Textarea.Root
                label="Комментарий"
                name="comment"
                defaultValue="Согласовать сроки оплаты с юристами клиента"
                onValueChange={() => setDirty(true)}
              />
            </Fieldset>
          </form>
        </Drawer.Body>
        <Drawer.Footer>
          {dirty ? <Drawer.Meta>Есть несохранённые изменения</Drawer.Meta> : null}
          <Drawer.Close>
            <Button.Root variant="soft" tone="neutral">
              Отмена
            </Button.Root>
          </Drawer.Close>
          <Button.Root type="submit" form={formId} loading={saving} disabled={!dirty}>
            Сохранить
          </Button.Root>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
}
