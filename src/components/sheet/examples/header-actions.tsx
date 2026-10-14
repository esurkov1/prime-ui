/** The courier is at the door: an icon tile heads the sheet, the payment status and a ⋯ menu sit before the close button, and two equal buttons fill the footer — `Sheet.Icon`, `Sheet.Actions`, `layout`. */
import { Badge, Button, Dropdown, Icon, Sheet, Typography } from "prime-ui-kit";

export default function SheetHeaderActionsExample() {
  return (
    <Sheet.Root>
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
          <Sheet.Title>Курьер у двери</Sheet.Title>
          <Sheet.Description>Заказ № 1042 · 3 коробки</Sheet.Description>
          <Sheet.Actions>
            <Badge.Root color="green">Оплачен</Badge.Root>
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
                <Dropdown.Item tone="danger">Отказаться от заказа</Dropdown.Item>
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
      </Sheet.Content>
    </Sheet.Root>
  );
}
