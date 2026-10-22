/** A strip that scrolls sideways and a wide schedule that scrolls both ways — `axis`. */
import { Badge, Card, ScrollContainer, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const TAGS = ["Новые", "В работе", "Ждут оплаты", "Отгружены", "Возвраты", "Архив", "Черновики"];
const HOURS = Array.from({ length: 12 }, (_, index) => `${String(9 + index).padStart(2, "0")}:00`);
const ROOMS = Array.from({ length: 16 }, (_, index) => `Зал ${index + 1}`);

export default function ScrollContainerVariantsExample() {
  return (
    <div className={styles.layout}>
      <Card.Root role="region" className={styles.card} aria-label="Статусы заказов">
        <Card.Header>
          <Card.Title>Статусы заказов</Card.Title>
          <Card.Actions>
            <Typography as="span" variant="caption" tone="muted">
              horizontal
            </Typography>
          </Card.Actions>
        </Card.Header>
        <ScrollContainer axis="horizontal">
          <div className={styles.strip}>
            {TAGS.map((tag) => (
              <Badge.Root key={tag}>{tag}</Badge.Root>
            ))}
          </div>
        </ScrollContainer>
      </Card.Root>
      <Card.Root role="region" className={styles.card} aria-label="Расписание залов">
        <Card.Header>
          <Card.Title>Расписание залов</Card.Title>
          <Card.Actions>
            <Typography as="span" variant="caption" tone="muted">
              both
            </Typography>
          </Card.Actions>
        </Card.Header>
        <ScrollContainer
          axis="both"
          tabIndex={0}
          aria-label="Сетка расписания"
          className={styles.canvas}
        >
          <div className={styles.grid}>
            {ROOMS.flatMap((room) =>
              HOURS.map((hour) => (
                <Typography
                  key={`${room}-${hour}`}
                  as="div"
                  variant="caption"
                  tone="secondary"
                  numeric="tabular"
                  className={styles.cell}
                >
                  {room} · {hour}
                </Typography>
              )),
            )}
          </div>
        </ScrollContainer>
      </Card.Root>
    </div>
  );
}
