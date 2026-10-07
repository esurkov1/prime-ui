/** A feed that scrolls on its own inside a fixed-height card, with the kit's thin scrollbar. */
import { ScrollContainer, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const EVENTS = Array.from({ length: 16 }, (_, index) => `Заказ № ${1040 + index} оплачен`);

export default function ScrollContainerOverviewExample() {
  return (
    <section className={styles.card} aria-label="Лента событий">
      <Typography.Root as="h3" variant="title-s" className={styles.cardTitle}>
        Лента событий
      </Typography.Root>
      <ScrollContainer>
        <ul className={styles.list}>
          {EVENTS.map((event) => (
            <li key={event}>
              <Typography.Root as="span" variant="body-m" tone="secondary">
                {event}
              </Typography.Root>
            </li>
          ))}
        </ul>
      </ScrollContainer>
    </section>
  );
}
