/** A panel that keeps its scroll: at the end of the list the page behind stays put — `overscrollBehavior`. */
import { Card, List, ScrollContainer } from "prime-ui-kit";

import styles from "./examples.module.css";

const HOURS = Array.from({ length: 12 }, (_, index) => `${String(9 + index).padStart(2, "0")}:00`);

export default function ScrollContainerOverscrollExample() {
  return (
    <Card.Root role="region" className={styles.card} aria-label="Журнал">
      <Card.Header>
        <Card.Title>Журнал выгрузок</Card.Title>
      </Card.Header>
      <Card.Body>
        <ScrollContainer overscrollBehavior="contain" tabIndex={0} aria-label="Журнал выгрузок">
          <List.Root aria-label="Выгрузки">
            {HOURS.map((hour) => (
              <List.Item key={hour}>
                <List.ItemText>{hour} — отчёт выгружен</List.ItemText>
              </List.Item>
            ))}
          </List.Root>
        </ScrollContainer>
      </Card.Body>
    </Card.Root>
  );
}
