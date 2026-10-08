/** The parent owns the state and raises the sheet from a link in the text, without a trigger — `open`, `onOpenChange`. */
import { LinkButton, Sheet, Typography } from "prime-ui-kit";
import * as React from "react";

export default function SheetControlledOpenExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Typography variant="body-m" tone="secondary">
        Доставка 5 октября.{" "}
        <LinkButton
          href="#delivery-cost"
          onClick={(event) => {
            event.preventDefault();
            setOpen(true);
          }}
        >
          Как считается стоимость?
        </LinkButton>
      </Typography>
      <Sheet.Root open={open} onOpenChange={setOpen}>
        <Sheet.Content>
          <Sheet.Header>
            <Sheet.Title>Стоимость доставки</Sheet.Title>
          </Sheet.Header>
          <Sheet.Body>
            <Typography variant="body-m" tone="secondary">
              Базовый тариф 390 ₽ до 5 кг, дальше 40 ₽ за каждый килограмм. От 5 000 ₽ в заказе
              доставка бесплатная.
            </Typography>
          </Sheet.Body>
        </Sheet.Content>
      </Sheet.Root>
    </>
  );
}
