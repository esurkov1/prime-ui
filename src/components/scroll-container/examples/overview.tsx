/** A feed that scrolls on its own inside a fixed-height card, with the kit's thin scrollbar. */
import { Card, ScrollContainer, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const EVENTS = Array.from({ length: 16 }, (_, index) => `Заказ № ${1040 + index} оплачен`);

export default function ScrollContainerOverviewExample() {
  return (
    <Card.Root role="region" className={styles.card} aria-label="Лента событий">
      <Typography as="h3" variant="title-s" className={styles.cardTitle}>
        Лента событий
      </Typography>
      <ScrollContainer>
        <ul className={styles.list}>
          {EVENTS.map((event) => (
            <li key={event}>
              <Typography as="span" variant="body-m" tone="secondary">
                {event}
              </Typography>
            </li>
          ))}
        </ul>
      </ScrollContainer>
    </Card.Root>
  );
}
