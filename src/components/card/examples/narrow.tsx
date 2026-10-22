/** The card is a size container: below 22rem its header actions drop under the text and share the width, below 30rem the footer's note takes its own line above the total — `Card.Actions`, `Card.Total`. */
import { Badge, Button, Card, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

const WIDTHS = [
  { id: "narrow", className: styles.w18 },
  { id: "wide", className: styles.w40 },
];

export default function CardNarrowExample() {
  return (
    <div className={styles.stack}>
      {WIDTHS.map((width) => (
        <div key={width.id} className={width.className}>
          <Card.Root>
            <Card.Header>
              <Card.Icon>
                <Icon name="object.receipt" />
              </Card.Icon>
              <Card.Title>Счёт № 4821</Card.Title>
              <Card.Description>ООО «Мостострой» · до 15 окт</Card.Description>
              <Card.Actions>
                <Button.Root variant="soft" tone="neutral">
                  Отправить
                </Button.Root>
              </Card.Actions>
            </Card.Header>
            <Card.Footer divider="fill">
              <Button.Root>Оплачен</Button.Root>
              <Card.Description>
                <Badge.Dot color="yellow" />
                Напомнить 14 окт
              </Card.Description>
              <Card.Total label="к оплате" tone="warning">
                248 000 ₽
              </Card.Total>
            </Card.Footer>
          </Card.Root>
        </div>
      ))}
    </div>
  );
}
