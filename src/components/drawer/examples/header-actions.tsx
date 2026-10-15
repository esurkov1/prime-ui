/** A record card: its status and a ⋯ menu sit in the header before the close button, one tier smaller; on a phone, where the title has no room beside them, they move under it — `Drawer.Actions`. */
import { Badge, Button, DescriptionList, Drawer, Dropdown, Icon } from "prime-ui-kit";

const DEAL = {
  title: "Сделка №1042",
  client: "ООО «Северный ветер»",
  amount: "480 000 ₽",
  owner: "Анна Соколова",
};

export default function DrawerHeaderActionsExample() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Открыть сделку
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>{DEAL.title}</Drawer.Title>
          <Drawer.Description>{DEAL.client}</Drawer.Description>
          <Drawer.Actions>
            <Badge.Root tone="success">Выиграна</Badge.Root>
            <Dropdown.Root>
              <Dropdown.Trigger>
                <Button.Root variant="ghost" tone="neutral" aria-label="Действия со сделкой">
                  <Button.Icon>
                    <Icon name="action.more" />
                  </Button.Icon>
                </Button.Root>
              </Dropdown.Trigger>
              <Dropdown.Content>
                <Dropdown.Item>Дублировать</Dropdown.Item>
                <Dropdown.Item>Скопировать ссылку</Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Item tone="danger">Удалить сделку</Dropdown.Item>
              </Dropdown.Content>
            </Dropdown.Root>
          </Drawer.Actions>
        </Drawer.Header>
        <Drawer.Body>
          <DescriptionList.Root>
            <DescriptionList.Item label="Сумма">{DEAL.amount}</DescriptionList.Item>
            <DescriptionList.Item label="Ответственный">{DEAL.owner}</DescriptionList.Item>
          </DescriptionList.Root>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close>
            <Button.Root variant="outline" tone="neutral">
              Закрыть
            </Button.Root>
          </Drawer.Close>
          <Button.Root>Выставить счёт</Button.Root>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
}
