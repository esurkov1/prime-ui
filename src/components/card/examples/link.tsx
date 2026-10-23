/** Cards that open: a link in the title stretches over the card while its own button stays its own, and a whole card is one link when nothing inside is a control — `Card.Link`, `asChild`. */
import { Badge, Button, Card, DescriptionList, Icon, StatusDot } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function CardLinkExample() {
  return (
    <div className={styles.grid}>
      <Card.Root>
        <Card.Header>
          <Card.Icon>
            <Icon name="object.motorbike" />
          </Card.Icon>
          <Card.Title>
            <Card.Link href="#nmax">Yamaha NMAX 155</Card.Link>
          </Card.Title>
          <Card.Badges>
            <Badge.Root tone="success">На линии</Badge.Root>
          </Card.Badges>
          <Card.Description>А 123 ВС 777 · пробег 3 200 км</Card.Description>
        </Card.Header>
        <Card.Body>
          <DescriptionList.Root align="end">
            <DescriptionList.Item label="Арендатор">Иван Петров</DescriptionList.Item>
            <DescriptionList.Item label="Возврат">12 окт.</DescriptionList.Item>
          </DescriptionList.Root>
        </Card.Body>
        <Card.Footer>
          <Card.Total label="Аренда">2 400 ₽ / сутки</Card.Total>
          <Card.Actions>
            <Button.Root variant="soft" tone="neutral">
              Продлить
            </Button.Root>
          </Card.Actions>
        </Card.Footer>
      </Card.Root>
      <Card.Root asChild>
        <a href="#project">
          <Card.Header>
            <Card.Icon>
              <Icon name="object.rocket" />
            </Card.Icon>
            <Card.Title>Внедрение CRM</Card.Title>
            <Card.Description>
              <StatusDot tone="accent">В работе</StatusDot>до 30 нояб.
            </Card.Description>
          </Card.Header>
        </a>
      </Card.Root>
    </div>
  );
}
