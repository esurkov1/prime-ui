/** The courier is at the door: an icon tile heads the sheet, the order's number stands by its name, a line of data under it and its statuses under that, a ⋯ menu sits before the close button, and two equal buttons fill the footer — `Sheet.Icon`, `Sheet.Badges`, `Sheet.Actions`, `layout`. */
import { Badge, Button, ConfirmDialog, Dropdown, Icon, Sheet, Typography } from "prime-ui-kit";
import * as React from "react";

/** Pretends to refuse the order on the server. */
function refuseOrder() {
  return new Promise((resolve) => setTimeout(resolve, 900));
}

export default function SheetHeaderActionsExample() {
  const [open, setOpen] = React.useState(false);
  const [refusing, setRefusing] = React.useState(false);

  return (
    <Sheet.Root open={open} onOpenChange={setOpen}>
      <Sheet.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Курьер на месте
        </Button.Root>
      </Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Header>
          <Sheet.Icon tone="info">
            <Icon name="object.truck" />
          </Sheet.Icon>
          <Sheet.Title number="№ 1042">Заказ</Sheet.Title>
          <Sheet.Description>3 коробки · Анна Смирнова</Sheet.Description>
          <Sheet.Badges>
            <Badge.Root tone="info">Курьер у двери</Badge.Root>
            <Badge.Root tone="success">Оплачен</Badge.Root>
          </Sheet.Badges>
          <Sheet.Actions>
            <Dropdown.Root>
              <Dropdown.Trigger>
                <Button.Root variant="ghost" tone="neutral" aria-label="Действия с заказом">
                  <Button.Icon>
                    <Icon name="action.more" />
                  </Button.Icon>
                </Button.Root>
              </Dropdown.Trigger>
              <Dropdown.Content>
                <Dropdown.Item>Позвонить курьеру</Dropdown.Item>
                <Dropdown.Item>Перенести доставку</Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Item tone="danger" onSelect={() => setRefusing(true)}>
                  Отказаться от заказа
                </Dropdown.Item>
              </Dropdown.Content>
            </Dropdown.Root>
          </Sheet.Actions>
        </Sheet.Header>
        <Sheet.Body>
          <Typography variant="body-m" tone="secondary">
            Проверьте коробки при курьере: после приёмки претензии к упаковке не принимаются.
          </Typography>
        </Sheet.Body>
        <Sheet.Footer layout="fill">
          <Sheet.Close>
            <Button.Root variant="outline" tone="neutral">
              Позже
            </Button.Root>
          </Sheet.Close>
          <Sheet.Close>
            <Button.Root>Принять заказ</Button.Root>
          </Sheet.Close>
        </Sheet.Footer>
        <ConfirmDialog.Root
          open={refusing}
          onOpenChange={setRefusing}
          title="Отказаться от заказа № 1042?"
          description="Курьер увезёт коробки обратно, деньги вернутся в течение трёх дней."
          confirmLabel="Отказаться"
          onConfirm={() => refuseOrder().then(() => setOpen(false))}
        />
      </Sheet.Content>
    </Sheet.Root>
  );
}
