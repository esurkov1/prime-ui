/** While an order is opened for review, the queue behind it holds still: no wheel, touch, key or drag moves it — `lock`. */
import { Button, Card, List, ScrollContainer } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const ORDERS = [
  "Заказ № 1040 · ООО «Северный склад»",
  "Заказ № 1041 · АО «Тепломонтаж»",
  "Заказ № 1042 · ИП Кравцова",
  "Заказ № 1043 · ООО «Логистик Плюс»",
  "Заказ № 1044 · ООО «Альфа Ритейл»",
  "Заказ № 1045 · АО «ПромСнаб»",
  "Заказ № 1046 · ООО «Городские аптеки»",
  "Заказ № 1047 · ООО «Вектор»",
];

export default function ScrollContainerLockExample() {
  const [reviewing, setReviewing] = React.useState(false);

  return (
    <Card.Root role="region" className={styles.card} aria-label="Очередь заказов">
      <Card.Header>
        <Card.Title>Очередь заказов</Card.Title>
        <Card.Actions>
          <Button.Root
            variant="soft"
            tone="neutral"
            pressed={reviewing}
            onClick={() => setReviewing((current) => !current)}
          >
            {reviewing ? "Закрыть проверку" : "Проверить заказ"}
          </Button.Root>
        </Card.Actions>
      </Card.Header>
      <Card.Body>
        <ScrollContainer lock={reviewing}>
          <List.Root aria-label="Заказы в очереди">
            {ORDERS.map((order) => (
              <List.Item key={order}>
                <List.ItemText>{order}</List.ItemText>
              </List.Item>
            ))}
          </List.Root>
        </ScrollContainer>
      </Card.Body>
    </Card.Root>
  );
}
