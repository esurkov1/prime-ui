/** At the end of the list the scroll passes on to the page instead of stopping — `overscrollBehavior`. */
import { Card, ScrollContainer, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const HOURS = Array.from({ length: 12 }, (_, index) => `${String(9 + index).padStart(2, "0")}:00`);

export default function ScrollContainerOverscrollExample() {
  return (
    <Card.Root role="region" className={styles.card} aria-label="Журнал">
      <Card.Header>
        <Card.Title>Журнал выгрузок</Card.Title>
      </Card.Header>
      <ScrollContainer overscrollBehavior="auto" tabIndex={0} aria-label="Журнал выгрузок">
        <Card.List>
          {HOURS.map((hour) => (
            <Card.ListItem key={hour}>
              <Typography as="span" variant="body-m" tone="secondary">
                {hour} — отчёт выгружен
              </Typography>
            </Card.ListItem>
          ))}
        </Card.List>
      </ScrollContainer>
    </Card.Root>
  );
}
