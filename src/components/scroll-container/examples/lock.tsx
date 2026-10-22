/** While an order is opened for review, the queue behind it holds still: no wheel, touch, key or drag moves it — `lock`. */
import { Button, Card, ScrollContainer, Typography } from "prime-ui-kit";
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
      <ScrollContainer lock={reviewing}>
        <Card.List>
          {ORDERS.map((order) => (
            <Card.ListItem key={order}>
              <Typography as="span" variant="body-m">
                {order}
              </Typography>
            </Card.ListItem>
          ))}
        </Card.List>
      </ScrollContainer>
    </Card.Root>
  );
}
