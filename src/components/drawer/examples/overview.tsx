/** Order details next to the list: a trigger, a header with a close button and a read-only body — `Drawer.Trigger`, `Drawer.Body`. */
import { Button, Drawer, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const DETAILS = [
  { term: "Клиент", value: "Анна Смирнова" },
  { term: "Сумма", value: "12 480 ₽" },
  { term: "Доставка", value: "Курьер, 5 октября" },
  { term: "Статус", value: "Собирается на складе" },
];

export default function DrawerOverviewExample() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Заказ № 1042
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content size="s">
        <Drawer.Header>
          <Drawer.Title>Заказ № 1042</Drawer.Title>
          <Drawer.Description>Оформлен 3 октября</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          <dl className={styles.details}>
            {DETAILS.map(({ term, value }) => (
              <React.Fragment key={term}>
                <dt>
                  <Typography.Root as="span" variant="body-m" tone="muted">
                    {term}
                  </Typography.Root>
                </dt>
                <dd>
                  <Typography.Root as="span" variant="body-m">
                    {value}
                  </Typography.Root>
                </dd>
              </React.Fragment>
            ))}
          </dl>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
}
