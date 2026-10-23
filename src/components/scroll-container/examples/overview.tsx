/** A feed that scrolls on its own inside a fixed-height card, with the kit's thin scrollbar — `ScrollContainer`. */
import { Card, List, ScrollContainer } from "prime-ui-kit";

import styles from "./examples.module.css";

const EVENTS = Array.from({ length: 16 }, (_, index) => `Заказ № ${1040 + index} оплачен`);

export default function ScrollContainerOverviewExample() {
  return (
    <Card.Root role="region" className={styles.card} aria-label="Лента событий">
      <Card.Header>
        <Card.Title>Лента событий</Card.Title>
      </Card.Header>
      <Card.Body>
        <ScrollContainer>
          <List.Root aria-label="События">
            {EVENTS.map((event) => (
              <List.Item key={event}>
                <List.ItemText>{event}</List.ItemText>
              </List.Item>
            ))}
          </List.Root>
        </ScrollContainer>
      </Card.Body>
    </Card.Root>
  );
}
