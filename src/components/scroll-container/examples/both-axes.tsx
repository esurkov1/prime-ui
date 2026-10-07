/** `axis="both"` for a wide grid that scrolls in both directions, and `overscrollBehavior="auto"` that hands the scroll to the page at the end. Use for wide canvases, schedules and timetables. */
import { ScrollContainer, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const HOURS = Array.from({ length: 12 }, (_, i) => `${String(9 + i).padStart(2, "0")}:00`);
const ROOMS = Array.from({ length: 16 }, (_, i) => `Зал ${i + 1}`);

export default function ScrollContainerBothAxesExample() {
  return (
    <div className={styles.layout}>
      <section className={styles.card} aria-label="Расписание залов">
        <Typography.Root as="h3" variant="title-s" className={styles.cardTitle}>
          Расписание · axis=both
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
      <section className={styles.card} aria-label="Журнал">
        <Typography.Root as="h3" variant="title-s" className={styles.cardTitle}>
          Журнал · overscroll auto
        </Typography.Root>
        <ScrollContainer overscrollBehavior="auto" tabIndex={0} aria-label="Журнал событий">
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
    </div>
  );
}
