/** A record card: the mark, the title with its badges, a status line, a more menu, label — value rows and the total with one accent button — `Card.Icon`, `Card.Badges`, `Card.Description`, `StatusDot`, `Card.Actions`, `Card.Total`. */
import { Badge, Button, Card, DescriptionList, Dropdown, Icon, StatusDot } from "prime-ui-kit";

export default function CardOverviewExample() {
  return (
    <Card.Root>
      <Card.Header>
        <Card.Icon>
          <Icon name="object.package" />
        </Card.Icon>
        <Card.Title>Заказ № 4821</Card.Title>
        <Card.Badges>
          <Badge.Root tone="warning">Срочно</Badge.Root>
          <Badge.Root>Опт</Badge.Root>
        </Card.Badges>
        <Card.Description>
          <StatusDot tone="warning">Ждёт оплаты</StatusDot>
          ООО «Северный ветер»
        </Card.Description>
        <Card.Actions>
          <Dropdown.Root>
            <Dropdown.Trigger>
              <Button.Root variant="soft" tone="neutral" aria-label="Ещё">
                <Button.Icon>
                  <Icon name="action.more" />
                </Button.Icon>
              </Button.Root>
            </Dropdown.Trigger>
            <Dropdown.Content align="end">
              <Dropdown.Item>Открыть заказ</Dropdown.Item>
              <Dropdown.Item>Скопировать ссылку</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        </Card.Actions>
      </Card.Header>
      <Card.Body>
        <DescriptionList.Root align="end">
          <DescriptionList.Item label="Менеджер">Анна Котова</DescriptionList.Item>
          <DescriptionList.Item label="Доставка">Курьер, 9 окт.</DescriptionList.Item>
          <DescriptionList.Item label="Позиций">12</DescriptionList.Item>
        </DescriptionList.Root>
      </Card.Body>
      <Card.Footer>
        <Card.Total label="К оплате" tone="warning">
          184 500 ₽
        </Card.Total>
        <Card.Actions>
          <Button.Root>Выставить счёт</Button.Root>
        </Card.Actions>
      </Card.Footer>
    </Card.Root>
  );
}
