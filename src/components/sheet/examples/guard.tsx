/** A review form that holds the sheet: after an edit a swipe, the scrim, Escape and Cancel ask before discarding and the footer says so; sending locks every way out — `Sheet.Guard`, `Sheet.Meta`. */
import { Button, Fieldset, Sheet, Textarea } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/** Pretends to send the review. */
function sendReview() {
  return new Promise((resolve) => setTimeout(resolve, 1200));
}

export default function SheetGuardExample() {
  const formId = React.useId();
  const [open, setOpen] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);
  const [sending, setSending] = React.useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    await sendReview();
    setSending(false);
    setDirty(false);
    setOpen(false);
  };

  return (
    <Sheet.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setDirty(false);
      }}
    >
      <Sheet.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Отзыв о доставке
        </Button.Root>
      </Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Guard busy={sending} dirty={dirty} />
        <Sheet.Header>
          <Sheet.Title>Отзыв о доставке</Sheet.Title>
          <Sheet.Description>Заказ № 1042 · курьер Олег Р.</Sheet.Description>
        </Sheet.Header>
        <Sheet.Body>
          <form id={formId} className={styles.form} onSubmit={submit}>
            <Fieldset disabled={sending}>
              <Textarea.Root
                label="Что понравилось или нет"
                name="review"
                placeholder="Привёз вовремя, помог занести коробки"
                onValueChange={() => setDirty(true)}
              />
            </Fieldset>
          </form>
        </Sheet.Body>
        <Sheet.Footer>
          {dirty ? <Sheet.Meta>Есть несохранённые изменения</Sheet.Meta> : null}
          <Sheet.Close>
            <Button.Root variant="outline" tone="neutral">
              Отмена
            </Button.Root>
          </Sheet.Close>
          <Button.Root type="submit" form={formId} loading={sending} disabled={!dirty}>
            Отправить
          </Button.Root>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet.Root>
  );
}
