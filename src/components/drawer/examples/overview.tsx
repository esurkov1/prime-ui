/** Order details next to the list: the three zones of every drawer — a header with a close button, a read-only body and a footer with Close and the main action — `Drawer.Trigger`, `Drawer.Body`, `Drawer.Footer`. */
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
                  <Typography as="span" variant="body-m" tone="muted">
                    {term}
                  </Typography>
                </dt>
                <dd>
                  <Typography as="span" variant="body-m">
                    {value}
                  </Typography>
                </dd>
              </React.Fragment>
            ))}
          </dl>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close>
            <Button.Root variant="outline" tone="neutral">
              Закрыть
            </Button.Root>
          </Drawer.Close>
          <Button.Root>Изменить заказ</Button.Root>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
}
