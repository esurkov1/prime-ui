/** A vertical list that scrolls inside a fixed-height flex card and a horizontal strip of badges (`axis="horizontal"`). Use when a region inside a card or panel must scroll on its own. */
import { Badge, ScrollContainer, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const EVENTS = Array.from({ length: 16 }, (_, i) => `Заказ № ${1040 + i} оплачен`);
const TAGS = ["Новые", "В работе", "Ждут оплаты", "Отгружены", "Возвраты", "Архив", "Черновики"];

export default function ScrollContainerListExample() {
  return (
    <div className={styles.layout}>
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
      <section className={styles.card} aria-label="Фильтры">
        <Typography.Root as="h3" variant="title-s" className={styles.cardTitle}>
          Фильтры
        </Typography.Root>
        <ScrollContainer axis="horizontal">
          <div className={styles.strip}>
            {TAGS.map((tag) => (
              <Badge.Root key={tag} size="m">
                {tag}
              </Badge.Root>
            ))}
          </div>
        </ScrollContainer>
      </section>
    </div>
  );
}
