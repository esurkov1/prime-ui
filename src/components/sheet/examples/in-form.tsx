/** A short form that needs an explicit submit: the one case for a footer, Cancel and Send under the field, an empty comment keeps the sheet open — `Sheet.Footer`, `error`. */
import { Button, Sheet, Textarea } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function SheetInFormExample() {
  const formId = React.useId();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string>();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const comment = String(new FormData(event.currentTarget).get("comment") ?? "").trim();
    if (!comment) {
      setError("Напишите, что передать курьеру");
      return;
    }
    setOpen(false);
  };

  return (
    <Sheet.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setError(undefined);
      }}
    >
      <Sheet.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Комментарий курьеру
        </Button.Root>
      </Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Header>
          <Sheet.Title>Комментарий курьеру</Sheet.Title>
          <Sheet.Description>Заказ № 1042 · доставка 5 октября</Sheet.Description>
        </Sheet.Header>
        <Sheet.Body>
          <form id={formId} className={styles.form} noValidate onSubmit={submit}>
            <Textarea.Root
              label="Комментарий"
              name="comment"
              placeholder="Позвонить за час, домофон не работает"
              error={error}
              reserveSupportRow
              onValueChange={() => setError(undefined)}
            />
          </form>
        </Sheet.Body>
        <Sheet.Footer>
          <Sheet.Close>
            <Button.Root variant="soft" tone="neutral">
              Отмена
            </Button.Root>
          </Sheet.Close>
          <Button.Root type="submit" form={formId}>
            Отправить
          </Button.Root>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet.Root>
  );
}
