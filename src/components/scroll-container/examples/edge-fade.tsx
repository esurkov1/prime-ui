/** Edges fade where more content is hidden; the horizontal strip also hides its scrollbar — `fade`, `scrollbar`. */
import { Badge, Card, ScrollContainer, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const EVENTS = [
  "Заказ № 1040 оплачен",
  "Счёт № 318 выставлен",
  "Заказ № 1041 передан в доставку",
  "Возврат по заказу № 1032 одобрен",
  "Заказ № 1042 оплачен",
  "Акт № 77 подписан",
  "Заказ № 1043 отменён клиентом",
  "Счёт № 319 оплачен",
  "Заказ № 1044 собран на складе",
  "Заказ № 1045 оплачен",
];
const TAGS = ["Новые", "В работе", "Ждут оплаты", "Отгружены", "Возвраты", "Архив", "Черновики"];

export default function ScrollContainerEdgeFadeExample() {
  return (
    <div className={styles.layout}>
      <Card.Root role="region" className={styles.card} aria-label="Лента событий">
        <Typography as="h3" variant="title-s" className={styles.cardTitle}>
          Лента событий
        </Typography>
        <ScrollContainer fade>
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
      <Card.Root role="region" className={styles.card} aria-label="Фильтры">
        <Typography as="h3" variant="title-s" className={styles.cardTitle}>
          Фильтры
        </Typography>
        <ScrollContainer axis="horizontal" fade scrollbar="hidden">
          <div className={styles.strip}>
            {TAGS.map((tag) => (
              <Badge.Root key={tag}>{tag}</Badge.Root>
            ))}
          </div>
        </ScrollContainer>
      </Card.Root>
    </div>
  );
}
