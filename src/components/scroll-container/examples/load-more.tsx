/** An order log that loads the next page as the reader nears its end, with loading lines in the rows' place — `onReachEnd`. */
import { Card, List, ScrollContainer, Skeleton } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const ORDERS = Array.from({ length: 40 }, (_, index) => ({
  id: 2400 - index,
  amount: `${(18 + ((index * 7) % 23)) * 1000} ₽`,
}));

const PAGE = 10;

export default function ScrollContainerLoadMoreExample() {
  const [shown, setShown] = React.useState(PAGE);
  const [loading, setLoading] = React.useState(false);
  const done = shown >= ORDERS.length;

  const loadMore = () => {
    if (done) return;
    setLoading(true);
    // The promise keeps the region `aria-busy` and stops repeat calls until it settles.
    return new Promise<void>((resolve) => {
      window.setTimeout(() => {
        setShown((count) => Math.min(count + PAGE, ORDERS.length));
        setLoading(false);
        resolve();
      }, 800);
    });
  };

  return (
    <Card.Root role="region" className={styles.card} aria-label="Журнал заказов">
      <Card.Header>
        <Card.Title>Журнал заказов</Card.Title>
      </Card.Header>
      <Card.Body>
        <ScrollContainer onReachEnd={loadMore} tabIndex={0} aria-label="Заказы">
          <List.Root aria-label="Заказы">
            {ORDERS.slice(0, shown).map((order) => (
              <List.Item key={order.id}>
                <List.ItemText>Заказ № {order.id}</List.ItemText>
                <List.ItemMeta>{order.amount}</List.ItemMeta>
              </List.Item>
            ))}
          </List.Root>
          {loading ? <Skeleton lines={3} className={styles.older} /> : null}
        </ScrollContainer>
      </Card.Body>
    </Card.Root>
  );
}
