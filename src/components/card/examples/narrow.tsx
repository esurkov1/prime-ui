/** On a narrow card nothing wraps: the title gives way and the badges fold into a count, the footer buttons go under the total and share the width — `Card.Title`, `Card.Badges`, `Card.Footer`, `Card.Actions`. */
import { Badge, Button, Card, DescriptionList, Icon, StatusDot } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function CardNarrowExample() {
  return (
    <div className={styles.phone}>
      <Card.Root>
        <Card.Header>
          <Card.Icon>
            <Icon name="object.truck" />
          </Card.Icon>
          <Card.Title>Поставка № 318 на склад «Север»</Card.Title>
          <Card.Badges>
            <Badge.Root tone="warning">Срочно</Badge.Root>
            <Badge.Root>Опт</Badge.Root>
            <Badge.Root>Холодильник</Badge.Root>
            <Badge.Root>Хрупкое</Badge.Root>
          </Card.Badges>
          <Card.Description>
            <StatusDot tone="warning">Ждёт приёмки</StatusDot>9 окт., ООО «Северный ветер»
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <DescriptionList.Root align="end">
            <DescriptionList.Item label="Водитель">Сергей Орлов</DescriptionList.Item>
            <DescriptionList.Item label="Паллет">14</DescriptionList.Item>
          </DescriptionList.Root>
        </Card.Body>
        <Card.Footer>
          <Card.Total label="Стоимость" tone="warning">
            184 500 ₽
          </Card.Total>
          <Card.Actions>
            <Button.Root variant="soft" tone="neutral">
              Накладная
            </Button.Root>
            <Button.Root>Принять</Button.Root>
          </Card.Actions>
        </Card.Footer>
      </Card.Root>
    </div>
  );
}
