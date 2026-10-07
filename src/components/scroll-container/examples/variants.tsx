/** A strip that scrolls sideways and a wide schedule that scrolls both ways — `axis`. */
import { Badge, ScrollContainer, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const TAGS = ["Новые", "В работе", "Ждут оплаты", "Отгружены", "Возвраты", "Архив", "Черновики"];
const HOURS = Array.from({ length: 12 }, (_, index) => `${String(9 + index).padStart(2, "0")}:00`);
const ROOMS = Array.from({ length: 16 }, (_, index) => `Зал ${index + 1}`);

export default function ScrollContainerVariantsExample() {
  return (
    <div className={styles.layout}>
      <section className={styles.card} aria-label="Фильтры">
        <Typography.Root as="h3" variant="title-s" className={styles.cardTitle}>
          horizontal
        </Typography.Root>
        <ScrollContainer axis="horizontal">
          <div className={styles.strip}>
            {TAGS.map((tag) => (
              <Badge.Root key={tag}>{tag}</Badge.Root>
            ))}
          </div>
        </ScrollContainer>
      </section>
      <section className={styles.card} aria-label="Расписание залов">
        <Typography.Root as="h3" variant="title-s" className={styles.cardTitle}>
          both
        </Typography.Root>
        <ScrollContainer
          axis="both"
          tabIndex={0}
          aria-label="Сетка расписания"
          className={styles.canvas}
        >
          <div className={styles.grid}>
            {ROOMS.flatMap((room) =>
              HOURS.map((hour) => (
                <Typography.Root
                  key={`${room}-${hour}`}
                  as="div"
                  variant="caption"
                  tone="secondary"
                  className={styles.cell}
                >
                  {room} · {hour}
                </Typography.Root>
              )),
            )}
          </div>
        </ScrollContainer>
      </section>
    </div>
  );
}
