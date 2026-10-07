/** At the end of the list the scroll passes on to the page instead of stopping — `overscrollBehavior`. */
import { ScrollContainer, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const HOURS = Array.from({ length: 12 }, (_, index) => `${String(9 + index).padStart(2, "0")}:00`);

export default function ScrollContainerOverscrollExample() {
  return (
    <section className={styles.card} aria-label="Журнал">
      <Typography.Root as="h3" variant="title-s" className={styles.cardTitle}>
        Журнал выгрузок
      </Typography.Root>
      <ScrollContainer overscrollBehavior="auto" tabIndex={0} aria-label="Журнал выгрузок">
        <ul className={styles.list}>
          {HOURS.map((hour) => (
            <li key={hour}>
              <Typography.Root as="span" variant="body-m" tone="secondary">
                {hour} — отчёт выгружен
              </Typography.Root>
            </li>
          ))}
        </ul>
      </ScrollContainer>
    </section>
  );
}
