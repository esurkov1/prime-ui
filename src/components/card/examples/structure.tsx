/** The zones a card has: a header alone, a header and a body, all three with a footer, and a pane with no zone where a list stands edge to edge — `Card.Header`, `Card.Body`, `Card.Footer`. */
import { Button, Card, DescriptionList, Icon, List } from "prime-ui-kit";

export default function CardStructureExample() {
  return (
    <>
      <Card.Root>
        <Card.Header>
          <Card.Icon>
            <Icon name="object.users" />
          </Card.Icon>
          <Card.Title>Команда продаж</Card.Title>
        </Card.Header>
      </Card.Root>
      <Card.Root>
        <Card.Header>
          <Card.Title>Реквизиты</Card.Title>
          <Card.Description>Попадают в счета и акты</Card.Description>
        </Card.Header>
        <Card.Body>
          <DescriptionList.Root align="end">
            <DescriptionList.Item label="ИНН">7704512398</DescriptionList.Item>
            <DescriptionList.Item label="КПП">770401001</DescriptionList.Item>
            <DescriptionList.Item label="Банк">Т-Банк</DescriptionList.Item>
          </DescriptionList.Root>
        </Card.Body>
      </Card.Root>
      <Card.Root>
        <Card.Header>
          <Card.Title>Счёт № 2026-0418</Card.Title>
          <Card.Description>Выставлен 7 окт.</Card.Description>
        </Card.Header>
        <Card.Body>
          <DescriptionList.Root align="end">
            <DescriptionList.Item label="Клиент">ООО «Гранит»</DescriptionList.Item>
            <DescriptionList.Item label="Срок оплаты">21 окт.</DescriptionList.Item>
          </DescriptionList.Root>
        </Card.Body>
        <Card.Footer>
          <Card.Total label="К оплате">256 000 ₽</Card.Total>
          <Card.Actions>
            <Button.Root variant="soft" tone="neutral">
              Скачать
            </Button.Root>
            <Button.Root>Оплатить</Button.Root>
          </Card.Actions>
        </Card.Footer>
      </Card.Root>
      <Card.Root>
        <List.Root aria-label="Последние обращения">
          <List.Item>
            <List.ItemText>Счёт без НДС</List.ItemText>
            <List.ItemDescription>ООО «Гранит»</List.ItemDescription>
          </List.Item>
          <List.Item>
            <List.ItemText>Перенос доставки</List.ItemText>
            <List.ItemDescription>ООО «Лето»</List.ItemDescription>
          </List.Item>
          <List.Item>
            <List.ItemText>Подключение ЭДО</List.ItemText>
            <List.ItemDescription>ИП Козлов</List.ItemDescription>
          </List.Item>
        </List.Root>
      </Card.Root>
    </>
  );
}
