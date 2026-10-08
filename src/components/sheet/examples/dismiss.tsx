/** A handover the courier must answer: no swipe, scrim or Escape closes the sheet, only its two buttons — `closeOnOutsideClick`, `closeOnEscape`. */
import { Button, Sheet, Typography } from "prime-ui-kit";
import * as React from "react";

export default function SheetDismissExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet.Root
      open={open}
      onOpenChange={setOpen}
      closeOnOutsideClick={false}
      closeOnEscape={false}
    >
      <Sheet.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Передать заказ
        </Button.Root>
      </Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Header showClose={false}>
          <Sheet.Title>Заказ № 1042 передан клиенту?</Sheet.Title>
        </Sheet.Header>
        <Sheet.Body>
          <Typography variant="body-m" tone="secondary">
            Ответ попадёт в историю заказа и закроет доставку. Случайный свайп его не отменит.
          </Typography>
        </Sheet.Body>
        <Sheet.Footer>
          <Sheet.Close>
            <Button.Root variant="outline" tone="neutral">
              Клиент не вышел
            </Button.Root>
          </Sheet.Close>
          <Sheet.Close>
            <Button.Root>Передан</Button.Root>
          </Sheet.Close>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet.Root>
  );
}
