/** A long list in a card: the scroller shows six rows, loads the next batch near its end and holds the place of the new rows with skeleton lines — `ScrollContainer`, `onReachEnd`, `Skeleton`. */
import { Card, List, ScrollContainer, Skeleton } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const CLIENTS = Array.from({ length: 40 }, (_, index) => ({
  id: index + 1,
  name: `Клиент № ${1200 + index}`,
  manager: ["Анна Котова", "Илья Соколов", "Мария Морозова"][index % 3],
}));

const PAGE = 10;

export default function CardLongListExample() {
  const [shown, setShown] = React.useState(PAGE);
  const [loading, setLoading] = React.useState(false);
  const done = shown >= CLIENTS.length;

  const loadMore = () => {
    if (done) return;
    setLoading(true);
    return new Promise<void>((resolve) => {
      window.setTimeout(() => {
        setShown((count) => Math.min(count + PAGE, CLIENTS.length));
        setLoading(false);
        resolve();
      }, 800);
    });
  };

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>Клиенты</Card.Title>
        <Card.Description>{CLIENTS.length} в базе</Card.Description>
      </Card.Header>
      <Card.Body>
        <ScrollContainer
          onReachEnd={loadMore}
          tabIndex={0}
          aria-label="Клиенты"
          className={styles.scroller}
        >
          <List.Root aria-label="Клиенты">
            {CLIENTS.slice(0, shown).map((client) => (
              <List.Item key={client.id}>
                <List.ItemText>{client.name}</List.ItemText>
                <List.ItemDescription>{client.manager}</List.ItemDescription>
              </List.Item>
            ))}
          </List.Root>
          {loading ? <Skeleton lines={3} /> : null}
        </ScrollContainer>
      </Card.Body>
    </Card.Root>
  );
}
